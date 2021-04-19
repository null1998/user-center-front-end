<!-- 用户管理 -->
<template>
  <div class="app-container">
    <!-- 新增按钮 -->
    <div class="filter-container">
      <hyd-form
        @handleCreate="handleCreate"
        :editCfg="editCfg"
        inline
        size="medium"
      ></hyd-form>
    </div>
    <!-- 用户列表 -->
    <hyd-table
    :height="580"
      :tableKey="tableKey"
      :tableData="userList"
      :tableColumns="userTableColumons"
      :loading="userListLoading"
      @handleEdit="handleUpdate"
      @handleDelete="handleDelete"
      @handleView="handleView"
    ></hyd-table>
    <!-- 对话框，用于新增，编辑角色 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <!-- 用户表单 -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="userData.username"
            :disabled="this.dialogStatus === 'update'"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="nickname">
          <el-input
            v-model="userData.nickname"
            :disabled="this.dialogStatus === 'update'"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userData.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userData.confirmPassword" show-password />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="userData.sex"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sex"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="userData.birthday"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="userData.tel" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userData.email" />
        </el-form-item>
        <el-form-item label="单位" prop="unitId">
          <el-select
            v-model="userData.unitId"
            clearable
            filterable
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role" v-if="dialogStatus === 'create'">
          <el-select
            v-model="value1"
            multiple
            placeholder="请选择"
            v-if="dialogStatus === 'create'"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createUser() : updateUser()"
          :loading="dialogBtnLoading"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <user-dialog
      :visible="visible"
      :close="dialogClose"
      :dialogTableData="dialogTableData"
    />
  </div>
</template>

<script>
import userDialog  from "./user-dialog.vue";
import { listAll as listAllUnit } from "@/api/basedata/unit";
import { listAll as listAllUser, save, removeById, update } from "@/api/user";
import { listRole } from "@/api/role";
import { listByUserId } from "@/api/user-role";
export default {
  components: { userDialog },
  name: "user",
  data() {
    const checkPhoneNumberValidator = (rule, value, callback) => {
      // if (this.dialogStatus == "update" && (!value || value === "")) {
      //   callback();
      // }
      if (value === null || value === undefined || value === "") {
        callback(new Error("联系电话不能为空"));
      } else if (!/^[1]([3-9])[0-9]{9}$/g.test(value)) {
        callback(new Error("联系电话格式不正确"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      // if (this.dialogStatus == "update" && (!value || value === "")) {
      //   callback();
      // }
      if (!value || value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userData.confirmPassword !== "") {
          this.$refs.dataForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      // if (this.dialogStatus == "update" && (!value || value === "")) {
      //   callback();
      // }
      if (!value || value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      dialogTableData: [],
      editCfg: [
        {
          type: "button",
          name: "新增",
          icon: "el-icon-plus",
          handleName: "handleCreate",
        },
      ],
      userTableColumons: [
        {
          prop: "username",
          label: "账号",
        },
        {
          prop: "nickname",
          label: "用户名",
        },
        {
          prop: "sex",
          label: "性别",
        },
        {
          prop: "email",
          label: "邮箱",
        },
        {
          prop: "tel",
          label: "电话",
        },
        {
          prop: "unitName",
          label: "单位",
        },
        {
          prop: "",
          label: "",
        },
      ],
      tableKey: 0,
      /**
       * 对话框可见性
       */
      dialogFormVisible: false,
      /**
       * 对话框状态
       */
      dialogStatus: "",
      userData: {},
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        //tel: [{ validator: checkPhoneNumberValidator, trigger: "change" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
      },
      /**
       * 对话框标题
       */
      textMap: {
        create: "新增",
        update: "编辑",
      },
      userListLoading: false,
      userList: [],
      deleteBtnLoading: false,
      sex: [
        {
          key: "0",
          value: "男",
        },
        {
          key: "1",
          value: "女",
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      unitList: [],
      dialogBtnLoading: false,
      editBtnLoading: false,
      roleList: [],
      value1: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleView(index, row) {
      if (row && row.id) {
        listByUserId(row.id).then((resp) => {
          if (resp && resp.body && resp.body.data) {
            this.dialogTableData = resp.body.data;
            this.visible = true;
          }
        });
      }
    },
    dialogClose() {
      this.visible = false;
      this.dialogTableData = [];
    },
    getList() {
      this.userListLoading = true;
      listAllUser().then((resp) => {
        if (resp && resp.body) {
          this.userListLoading = false;
          this.userList = resp.body.data;
        }
      });
    },
    /**
     * 新增
     */
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      listAllUnit().then((resp) => {
        if (resp && resp.body) {
          this.unitList = resp.body.data;
        }
      });
      listRole().then((resp) => {
        if (resp && resp.body) {
          this.roleList = resp.body.data;
        }
      });
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleClose() {
      this.getList();
      this.userData = {};
      this.dialogFormVisible = false;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteBtnLoading = true;
          removeById(row.id).then((resp) => {
            if (resp) {
              this.$notify({
                title: "Success",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            }
          });
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        })
        .finally(() => {
          this.deleteBtnLoading = false;
        });
    },
    handleUpdate(row) {
      this.editBtnLoading = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      listAllUnit().then((resp) => {
        if (resp && resp.body) {
          this.unitList = resp.body.data;
        }
      });
      this.userData = row;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.editBtnLoading = false;
    },
    createUser() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          this.userData.roleIdList = this.value1;
          save(this.userData)
            .then((resp) => {
              if (resp) {
                this.$notify({
                  title: "Success",
                  message: "新增成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
                this.dialogFormVisible = false;
              }
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
        }
      });
    },
    updateUser() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          update(this.userData)
            .then((resp) => {
              if (resp) {
                this.$notify({
                  title: "Success",
                  message: "编辑成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
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
