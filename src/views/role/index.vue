<!-- 角色管理 -->
<template>
  <div class="app-container">
    <!-- 搜索栏和新增按钮 -->
    <div class="filter-container">
      <hyd-form
        @handleFilter="handleFilter"
        @handleCreate="handleCreate"
        :editCfg="editCfg"
        :editData="roleListQuery"
        inline
        size="medium"
      ></hyd-form>
    </div>
    <hyd-table
    :height="580"
      :tableKey="tableKey"
      :tableData="roleList"
      :tableColumns="roleTableColumons"
      :loading="roleListLoading"
      @handleDelete="handleDelete"
      @handleView="handleView"
    ></hyd-table>
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
      <!-- 搜索栏-->
      <div class="filter-container" v-if="roleData.type == '基础角色'">
        <el-input
          v-model="permissionListQuery.name"
          placeholder="资源名"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handlePermissionFilter"
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
          :loading="searchPermissionBtnLoading"
          @click="handlePermissionFilter"
        >
          搜索
        </el-button>
      </div>
      <!-- 创建基础角色 -->
      <hyd-table
      :height="400"
        :show="roleData.type == '基础角色'"
        :loading="permissionListLoading"
        :tableKey="permissionTableKey"
        :tableData="permissionList"
        :tableColumns="permissionTableColumons"
        @handleSelectionChange="handleTableSelect"
      ></hyd-table>
      <el-pagination
        v-if="roleData.type == '基础角色'"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="pageInfo.pageNum"
        :page-sizes="[10, 30, 50]"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="margin-top: 10px; margin-bottom: 10px; margin-right: 20px"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
      />
      <!-- 选择基础角色，创建高级角色 -->
      <hyd-table
      :height="400"
        :show="roleData.type == '高级角色'"
        :loading="roleListLoading"
        :tableKey="tableKey"
        :tableData="roleList"
        :tableColumns="roleTableColumons"
        @handleSelectionChange="handleTableSelect"
      ></hyd-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit"> 确认 </el-button>
      </div>
    </el-dialog>
    <role-dialog
      :visible="visible"
      :close="dialogClose"
      :dialogTableData="dialogTableData"
    />
    <role-advanced-dialog
      :visible="visibleAdvanced"
      :close="dialogCloseAdvanced"
      :dialogTableData="dialogTableDataAdvanced"
    />
  </div>
</template>

<script>
import roleDialog from "./role-dialog.vue";
import roleAdvancedDialog  from "./role-advanced-dialog.vue";
import { listRole, save, deleteById } from "@/api/role";
import { listPermission } from "@/api/permission";
import {
  saveList as saveRolePermissionList,
  listByRoleId,
} from "@/api/role-permission";
import { saveList as saveRoleRelateList,listByParentRoleId } from "@/api/role-relate";
export default {
  components: { roleDialog,roleAdvancedDialog },
  name: "role",
  data() {
    return {
      visible: false,
      dialogTableData: [],
      visibleAdvanced:false,
      dialogTableDataAdvanced:[],
      editCfg: [
        {
          prop: "name",
          label: "角色名",
          type: "input",
          width: "200px",
        },
        {
          prop: "type",
          label: "角色类型",
          type: "select",
          width: "130px",
          placeholder: "",
          options: [
            {
              label: "基础角色",
              value: "基础角色",
            },
            {
              label: "高级角色",
              value: "高级角色",
            },
          ],
        },
        {
          type: "button",
          name: "搜索",
          icon: "el-icon-search",
          handleName: "handleFilter",
        },
        {
          type: "button",
          name: "新增",
          icon: "el-icon-plus",
          handleName: "handleCreate",
        },
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
      ],
      roleTableColumons: [
        {
          prop: "name",
          label: "角色名",
          sortable: true,
        },
        {
          prop: "type",
          label: "角色类型",
          sortable: true,
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
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
        pageNum: 1,
        pageSize: 10,
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

      searchPermissionBtnLoading: false,
      /**
       * 查询条件是否改变
       */
      queryPermissionOptionsChanged: false,
      /**
       * 分页信息
       */
      pageInfo: {
        pageSize: 1,
        pageNum: 10,
        total: 0,
      },
      /**
       * 动作
       */
      actions: ["新增", "删除", "编辑", "查看", "审核"],
    };
  },
  created() {
    /**
     * 加载所有角色
     */
    this.getRoleList();
  },
  methods: {
    handleView(index, row) {
      if (row&&row.id&&row.type) {
        if (row.type==='基础角色') {
          listByRoleId(row.id).then((resp) => {
          if(resp&&resp.body&&resp.body.data) {
            this.dialogTableData = resp.body.data;
            this.visible = true;
          }
          });
        } else if(row.type==='高级角色') {
          listByParentRoleId(row.id).then(resp=>{
            if(resp&&resp.body&&resp.body.data) {
            this.dialogTableDataAdvanced = resp.body.data;
            this.visibleAdvanced = true;
          }
          })
        }
        
      }
    },
    dialogClose() {
      this.visible = false;
      this.dialogTableData = [];
    },
    dialogCloseAdvanced(){
      this.visibleAdvanced = false;
      this.dialogTableDataAdvanced = []
    },
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
    handleDelete(index, row) {
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
        this.getPermissionList();
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
    /**
     * 查询权限
     */
    handlePermissionFilter() {
      this.searchPermissionBtnLoading = true;
      this.getPermissionList();
      this.searchPermissionBtnLoading = false;
    },
    /**
     * 查询权限列表
     */
    getPermissionList() {
      this.permissionListLoading = true;
      if (this.queryPermissionOptionsChanged) {
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
            this.pageInfo.pageNum = this.queryPermissionOptionsChanged
              ? 1
              : actualPageNum;
            this.pageInfo.total = Number.parseInt(total);
            this.permissionList = resp.body.data;
          }
        })
        .finally(() => {
          this.permissionListLoading = false;
          this.queryPermissionOptionsChanged = false;
        });
    },
    handlePageSizeChange(currentPageSize) {
      this.permissionListQuery.pageSize = currentPageSize;
      this.queryPermissionOptionsChanged = true;
      this.getPermissionList();
    },
    handleCurrentPageChange(currentPageNum) {
      this.permissionListQuery.pageNum = currentPageNum;
      this.getPermissionList();
    },
    handleRowClassName() {},
  },
};
</script>
<style>
</style>
