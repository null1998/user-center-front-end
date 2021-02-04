<!-- 权限管理 -->
<template>
  <div class="app-container">
    <!-- 搜索栏和新增按钮 -->
    <div class="filter-container">
      <el-input
        v-model="permissionListQuery.name"
        placeholder="权限名"
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
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
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

      <el-table-column label="权限名" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动作" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag>{{ row.action }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路径" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.url
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag>{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listPermission } from "@/api/permission";
export default {
  name: "",
  data() {
    return {
      tableKey: 0,
      /**
       * 动作
       */
      actions:["新增","删除","编辑","查看"],
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
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    getPermissionList() {
      this.permissionListLoading = true;
      listPermission(this.permissionListQuery)
        .then((resp) => {
          
          this.permissionList = resp.data;
        })
        .finally(() => {
          this.permissionListLoading = false;
        });
    },
    handleFilter() {
      this.getPermissionList();
    },
    handleCreate() {},
    handleUpdate() {},
    handleDelete() {}
  },
};
</script>
<style>
</style>
