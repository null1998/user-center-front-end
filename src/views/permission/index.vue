<!-- 权限管理 -->
<template>
  <div class="app-container">
    <!-- 搜索栏和新增按钮 -->
    <div class="filter-container">
      <hyd-form
        @handleFilter='handleFilter'
        @handleCreate='handleCreate'
        :editCfg="editCfg"
        :editData="permissionListQuery"
        inline
        size="medium"
      ></hyd-form>
    </div>
    <!-- 主表单显示权限列表 -->
    <hyd-table
    :height="580"
      :tableKey="tableKey"
      :tableData="permissionList"
      :tableColumns="permissionTableColumons"
      :loading="permissionListLoading"
      @handleEdit="handleUpdate"
      @handleDelete="handleDelete"
    ></hyd-table>
    <!-- 分页 -->
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pageInfo.pageNum"
      :page-sizes="[10, 30, 50]"
      :page-size="pageInfo.pageSize"
      :total="pageInfo.total"
      style="margin-top: 10px; margin-bottom: 10px; margin-right: 20px"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <!-- <hyd-form
        ref="dataForm"
        formRef="dataForm"
        :editCfg="dialogEditCfg"
        :editData="permissionData"
        :editRules="rules"
        size="medium"
      ></hyd-form> -->
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
          :loading="dialogBtnLoading"
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
  name: "permission",
  data() {
    return {
      dialogEditCfg:[
        {
          prop: "action",
          label: "动作",
          type: "select",
          placeholder: "",
          width:"200px",
          options: [
            {
              label: "新增",
              value: "新增",
            },
            {
              label: "删除",
              value: "删除",
            },
            {
              label: "编辑",
              value: "编辑",
            },
            {
              label: "查询",
              value: "查询",
            },
            {
              label: "审核",
              value: "审核",
            },
          ],
        },
        {
          prop: "name",
          label: "资源名",
          type: "input",
          width:"200px"
        },
        {
          prop: "method",
          label: "方法",
          type: "select",
          placeholder: "",
          width:"200px",
          options: [
            {
              label: "POST",
              value: "POST",
            },
            {
              label: "DELETE",
              value: "DELETE",
            },
            {
              label: "PUT",
              value: "PUT",
            },
            {
              label: "GET",
              value: "GET",
            },
          ]
        },
        {
          prop: "url",
          label: "路径",
          type: "input",
          width:"200px"
        },
        {
          prop: "remark",
          label: "备注",
          type: "textarea",
          width:"200px"
        },
      ],
      editCfg: [
        {
          prop: "name",
          label: "资源名",
          type: "input",
          width: "200px",
        },
        {
          prop: "action",
          label: "动作",
          type: "select",
          width: "130px",
          placeholder: "",
          options: [
            {
              label: "新增",
              value: "新增",
            },
            {
              label: "删除",
              value: "删除",
            },
            {
              label: "编辑",
              value: "编辑",
            },
            {
              label: "查询",
              value: "查询",
            },
            {
              label: "审核",
              value: "审核",
            },
          ],
        },
        {
          type:'button',
          name: '搜索',
          icon: 'el-icon-search',
          handleName: 'handleFilter'
        },
        {
          type:'button',
          name: '新增',
          icon: 'el-icon-plus',
          handleName: 'handleCreate'
        }
      ],
      permissionTableColumons: [
        {
          prop: "name",
          label: "资源名",
          sortable: true,
        },
        {
          prop: "action",
          label: "动作",
        },
        {
          prop: "remark",
          label: "备注",
        },
        {
          prop: "method",
          label: "method",
        },
        {
          prop: "url",
          label: "url",
          sortable: false,
        },
      ],
      /**
       * 查询条件是否改变
       */
      queryOptionsChanged: false,
      /**
       * 分页信息
       */
      pageInfo: {
        pageSize: 1,
        pageNum: 10,
        total: 0,
      },
      tableKey: 0,
      /**
       * http方法
       */
      httpMethod: ["POST", "DELETE", "PUT", "GET"],
      actions:["新增","删除","编辑","查询","审核"],
      /**
       * 权限列表搜素条件
       */
      permissionListQuery: {
        pageSize: 10,
        pageNum: 1,
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
      dialogBtnLoading: false,
      addPermissionBtnLoading: false,
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
        action: [
          { required: true, message: "动作不能为空", trigger: "change" },
        ],
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
  watch: {
    "permissionListQuery.name": {
      handler() {
        // 设置查询条件改变状态
        this.queryOptionsChanged = true;
      },
    },
    "permissionListQuery.action": {
      handler() {
        // 设置查询条件改变状态
        this.queryOptionsChanged = true;
      },
    },
  },
  methods: {
    handleRowClassName({ index, row }) {
      switch (row.method) {
        case "POST":
          return "success-row";
        case "DELETE":
          return "danger-row";
        case "PUT":
          return "warning-row";
        case "GET":
          return "info-row";
        default:
          return "info-row";
      }
    },
    handlePageSizeChange(currentPageSize) {
      this.permissionListQuery.pageSize = currentPageSize;
      this.queryOptionsChanged = true;
      this.getPermissionList();
    },
    handleCurrentPageChange(currentPageNum) {
      this.permissionListQuery.pageNum = currentPageNum;
      this.getPermissionList();
    },
    /**
     * 查询权限列表
     */
    getPermissionList() {
      this.permissionListLoading = true;
      if (this.queryOptionsChanged) {
        this.permissionListQuery.pageNum = 1;
      }
      listPermission(this.permissionListQuery)
        .then((resp) => {
          if (resp && resp.body) {
            const { pageSize, pageNum, total } = resp.body;
            // 设置分页信息
            const totalInt = Number.parseInt(total);
            // 计算最多多少页
            const maxPages =
              Number.parseInt(totalInt / pageSize) +
              (totalInt % pageSize !== 0 ? 1 : 0);
            // 实际页码，超出最大页数则为最大页数页码
            const actualPageNum = pageNum <= maxPages ? pageNum : maxPages;

            this.pageInfo.pageSize = pageSize;
            this.pageInfo.pageNum = this.queryOptionsChanged
              ? 1
              : actualPageNum;
            this.pageInfo.total = Number.parseInt(total);
            this.permissionList = resp.body.data;
          }
        })
        .finally(() => {
          this.permissionListLoading = false;
          this.queryOptionsChanged = false;
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
    handleUpdate(index, row) {
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.permissionData = row;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    /**
     * 删除
     */
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteById(row.id).then((resp) => {
            if (resp) {
              this.$notify({
                title: "Success",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
              this.getPermissionList();
            }
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
/*设置xx条/页的框的颜色*/
.el-select .el-input.is-focus .el-input__inner,
.el-select .el-input__inner:focus,
.el-pagination__sizes .el-input .el-input__inner:hover,
.el-input .is-focus .el-input__inner,
.el-input .el-input__inner:focus {
  border-color: #18ab8f;
}
/*设置当前页码的样式，及鼠标移上其他页码时的样式,以及左右箭头鼠标移上的样式*/
.el-pager li.active,
.el-pager li:hover,
.el-pagination button:hover {
  color: #18ab8f;
}
</style>
