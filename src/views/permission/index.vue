<!-- 权限管理 -->
<template>
  <div class="app-container">
    <!-- 搜索栏和新增按钮 -->
    <div class="filter-container">
      <el-input
        v-model="permissionListQuery.name"
        placeholder="资源名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="permissionListQuery.action"
        placeholder="动作"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in actions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        :loading="searchBtnLoading"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="permissionListLoading"
      :data="permissionList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动作" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="handleTagType(row.method)">{{ row.action }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="资源名" width="200px" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="handleTagType(row.method)">{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路径" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.url
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            :loading="editBtnLoading"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :loading="deleteBtnLoading"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="permissionData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="动作" prop="action">
          <el-select
            v-model="permissionData.action"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in actions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="permissionData.name" />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-select
            v-model="permissionData.method"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in httpMethod"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="url">
          <el-input v-model="permissionData.url" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="permissionData.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPermission, save, update, deleteById } from "@/api/permission";
export default {
  name: "",
  data() {
    return {
      tableKey: 0,
      /**
       * 动作
       */
      actions: ["新增", "删除", "编辑", "查看","审核"],
      /**
       * http方法
       */
      httpMethod: ["POST", "DELETE", "PUT", "GET"],
      /**
       * 权限列表搜素条件
       */
      permissionListQuery: {
        name: undefined,
        action: undefined,
      },
      /**
       * 权限列表数据
       */
      permissionList: undefined,
      /**
       * 权限列表加载状态
       */
      permissionListLoading: false,
      /**
       * 按钮加载状态
       */
      searchBtnLoading: false,
      deleteBtnLoading: false,
      editBtnLoading: false,
      dialogBtnLoading: false,
      /**
       * 对话框可见性
       */
      dialogFormVisible: false,
      /**
       * 对话框状态
       */
      dialogStatus: "",
      /**
       * 对话框标题
       */
      textMap: {
        create: "新增",
        update: "编辑",
      },
      /**
       * 权限数据
       */
      permissionData: {},
      /**
       * 表单规则
       */
      rules: {
        action: [{ required: true, message: "动作不能为空", trigger: "change" }],
        method: [
          { required: true, message: "方法不能为空", trigger: "change" },
        ],
        url: [{ required: true, message: "路径不能为空", trigger: "blur" }],
        name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    /**
     * 加载所有权限
     */
    this.getPermissionList();
  },
  methods: {
    /**
     * 查询权限列表
     */
    getPermissionList() {
      this.permissionListLoading = true;
      listPermission(this.permissionListQuery)
        .then((resp) => {
          if (resp && resp.body) {
            this.permissionList = resp.body.data;
          }
        })
        .finally(() => {
          this.permissionListLoading = false;
        });
    },
    /**
     * 查询
     */
    handleFilter() {
      this.searchBtnLoading = true;
      this.getPermissionList();
      this.searchBtnLoading = false;
    },
    /**
     * 新增
     */
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    /**
     * 更新
     */
    handleUpdate(row) {
      this.editBtnLoading = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.permissionData = row;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.editBtnLoading = false;
    },
    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteBtnLoading = true;
          deleteById(row.id)
            .then((resp) => {
              if (resp) {
                this.$notify({
                  title: "Success",
                  message: "删除成功",
                  type: "success",
                  duration: 2000,
                });
                this.getPermissionList();
              }
            })
            .finally(() => {
              this.deleteBtnLoading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleTagType(method) {
      switch (method) {
        case "POST":
          return "success";
        case "DELETE":
          return "danger";
        case "UPDATE":
          return "waring";
        case "GET":
          return "info";

        default:
          break;
      }
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          save(this.permissionData)
            .then((resp) => {
              if (resp) {
                this.$notify({
                  title: "Success",
                  message: "新增成功",
                  type: "success",
                  duration: 2000,
                });
                this.getPermissionList();
                this.dialogFormVisible = false;
              }
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          update(this.permissionData)
            .then((resp) => {
              if (resp) {
                this.$notify({
                  title: "Success",
                  message: "编辑成功",
                  type: "success",
                  duration: 2000,
                });
                this.getPermissionList();
                this.dialogFormVisible = false;
              }
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
        }
      });
    },
  },
};
</script>
<style>
</style>
