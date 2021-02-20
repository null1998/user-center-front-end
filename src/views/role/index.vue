<!-- 角色管理 -->
<template>
  <div class="app-container">
    <!-- 搜索栏和新增按钮 -->
    <div class="filter-container">
      <el-input
        v-model="roleListQuery.name"
        placeholder="角色名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="roleListQuery.type"
        placeholder="角色类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in roleTypes"
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
    <!-- 角色列表 -->
    <el-table
      :key="tableKey"
      v-loading="roleListLoading"
      :data="roleList"
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
      <el-table-column label="角色名" width="250px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色类型" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150px" align="center">
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
    <!-- 对话框，用于新增，编辑角色 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <!-- 角色表单 -->
      <el-form
        :disabled="roleCreated"
        ref="dataForm"
        :rules="rules"
        :model="roleData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="roleData.type"
            class="filter-item"
            placeholder="请选择"
            clearable
            @change="handleSeletorChange"
          >
            <el-option
              v-for="item in roleTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="roleData.name" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="roleData.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <!-- 选择权限，创建基础角色 -->
      <el-table
        v-if="roleData.type == '基础角色'"
        :key="permissionTableKey"
        v-loading="permissionListLoading"
        :data="permissionList"
        border
        fit
        highlight-current-row
        @selection-change="handleTableSelect"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
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
        <el-table-column label="备注" min-width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 选择基础角色，创建高级角色 -->
      <el-table
        v-if="roleData.type === '高级角色'"
        :key="tableKey"
        v-loading="roleListLoading"
        :data="roleList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleTableSelect"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色名" width="200px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色类型" width="110px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, save, deleteById } from "@/api/role";
import { listPermission } from "@/api/permission";
import { saveList as saveRolePermissionList } from "@/api/role-permission";
import { saveList as saveRoleRelateList } from "@/api/role-relate";
export default {
  name: "",
  data() {
    return {
      tableKey: 0,
      permissionTableKey: 0,
      roleTypes: ["基础角色", "高级角色"],
      roleListQuery: {
        name: undefined,
        type: undefined,
      },
      /**
       * 角色列表数据
       */
      roleList: undefined,
      /**
       * 角色列表加载状态
       */
      roleListLoading: false,
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
       * 角色数据
       */
      roleData: {},
      /**
       * 表单规则
       */
      rules: {
        type: [
          { required: true, message: "角色类型不能为空", trigger: "change" },
        ],
        name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
      },
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
       * 角色是否创建
       */
      roleCreated: false,
      permissionOrRoleList: [],
    };
  },
  created() {
    /**
     * 加载所有角色
     */
    this.getRoleList();
  },
  methods: {
    /**
     * 查询权限列表
     */
    getRoleList() {
      this.roleListLoading = true;
      listRole(this.roleListQuery)
        .then((resp) => {
          if (resp && resp.body) {
            this.roleList = resp.body.data;
          }
          
        })
        .finally(() => {
          this.roleListLoading = false;
        });
    },
    /**
     * 查询
     */
    handleFilter() {
      this.searchBtnLoading = true;
      this.getRoleList();
      this.searchBtnLoading = false;
    },
    /**
     * 新增
     */
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.roleCreated = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
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
                this.getRoleList();
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
    /**
     * 角色类型选择器变化时执行
     */
    handleSeletorChange(val) {
      if (val == "基础角色") {
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
      } else if (val == "高级角色") {
        this.getRoleList();
      }
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
    handleClose() {
      this.getRoleList();
      this.roleData = {};
      this.dialogFormVisible = false;
    },
    handleEdit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$confirm("创建后角色信息无法更改, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            save(this.roleData).then((resp) => {
              if (resp) {
                this.roleData.id = resp.body.data;
                if (this.roleData.type == "基础角色") {
                  var rolePermissionList = [];
                  for (let i = 0; i < this.permissionOrRoleList.length; i++) {
                    const element = this.permissionOrRoleList[i];
                    var tmp = {};
                    tmp.roleId = this.roleData.id;
                    tmp.permissionId = element.id;
                    rolePermissionList.push(tmp);
                  }
                  saveRolePermissionList(rolePermissionList);
                } else if (this.roleData.type == "高级角色") {
                  var roleRelateList = [];
                  for (let i = 0; i < this.permissionOrRoleList.length; i++) {
                    const element = this.permissionOrRoleList[i];
                    var tmp = {};
                    tmp.parentRoleId = this.roleData.id;
                    tmp.childRoleId = element.id;
                    roleRelateList.push(tmp);
                  }
                  saveRoleRelateList(roleRelateList);
                }

                this.roleCreated = true;
                this.$notify({
                  title: "Success",
                  message: "创建角色成功",
                  type: "success",
                  duration: 2000,
                });
                this.handleClose();
              }
            });
          });
        }
      });
    },
    handleTableSelect(val) {
      this.permissionOrRoleList = val;
    },
  },
};
</script>
<style>
</style>
