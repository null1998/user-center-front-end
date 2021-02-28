<!-- 通用table，动态创建列 -->
<template>
  <el-table
    :key="tableKey"
    :data="tableData"
    v-loading="loading"
    style="width: 100%"
    @selection-change="handleSelectionChange"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    :row-class-name="handleRowClassName"
    border
  >
    <el-table-column type="selection" v-if="selector"> </el-table-column>
    <el-table-column label="ID" prop="id">
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <af-table-column
      v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :sortable="item.sortable"
    ></af-table-column>

    <el-table-column label="操作" fixed="right" width="200" v-if="edit || del">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit" round
          v-if="edit"
          :loading="editBtnLoading"
          @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-delete" round
          v-if="del"
          :loading="delBtnLoading"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "",
  props: {
    tableKey: { type: Number, required: true, default: "key" },
    // 表格数据
    tableData: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    loading: { type: Boolean, required: true, default: false },
    // 自定义列名
    tableColumns: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    handleRowClassName: {type: Function}
  },
  data() {
    return {
      selector: false,
      edit: false,
      del: false,
      editBtnLoading: false,
      delBtnLoading: false,
    };
  },
  created() {
    // 监听父组件传进来的数据
    if (this.$listeners["handleSelectionChange"]) {
      this.selector = true;
    }
    if (this.$listeners["handleEdit"]) {
      this.edit = true;
    }
    if (this.$listeners["handleDelete"]) {
      this.del = true;
    }
  },
  methods: {
    /**
     * 选择器
     */
    handleSelectionChange(rows) {
      // 回调父组件函数
      this.$emit("handleSelectionChange", rows);
    },
    /**
     * 编辑按钮
     */
    handleEdit(index, row) {
      this.editBtnLoading = true;
      this.$emit("handleEdit", index, row);
      this.editBtnLoading = false;
    },
    /**
     * 删除按钮
     */
    handleDelete(index, row) {
      this.delBtnLoading = true;
      this.$emit("handleDelete", index, row);
      this.delBtnLoading = false;
    },
  },
};
</script>
<style>
/* 解决表头不对齐问题 */
.el-table th {
  display: table-cell !important;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .info-row {
  background: #f0f9eb;
}
.el-table .danger-row {
  background: rgb(252, 238, 236);
}

.el-table .success-row {
  background: #e8f3f7fa;
}
.el-button:hover,
.el-button:focus{
  border-color: #18ab8f;
}
</style>
