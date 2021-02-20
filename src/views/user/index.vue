<!-- 用户管理 -->
<template>
  <div class="app-container">
    <!-- 新增按钮 -->
    <div class="filter-container">
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
    <!-- 用户列表 -->
    <el-table
      :key="tableKey"
      v-loading="userListLoading"
      :data="userList"
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
      <el-table-column label="用户名" width="250px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.birthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="250px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" width="250px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.unitId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="110px"
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
      <!-- 用户表单 -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="userData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userData.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userData.password" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="userData.sex" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="userData.birthday" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="userData.tel" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userData.email" />
        </el-form-item>
        <el-form-item label="单位" prop="unitId">
          <el-input v-model="userData.unitId" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      tableKey:0,
      /**
       * 对话框可见性
       */
      dialogFormVisible: false,
      /**
       * 对话框状态
       */
      dialogStatus: "",
      userData:{},
      rules:{

      },
      /**
       * 对话框标题
       */
      textMap: {
        create: "新增",
        update: "编辑",
      },
      userListLoading: false,
      userList:[],
      deleteBtnLoading:false
    }
  },
  methods:{
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
    handleClose() {
      this.getUserList();
      this.userData = {};
      this.dialogFormVisible = false;
    },
    getUserList(){

    },
    handleDelete(){

    }
  }
}

</script>
<style>
</style>
