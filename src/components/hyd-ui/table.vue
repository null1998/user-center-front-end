<!-- 通用table，动态创建列 -->
<template>
  <div>
    <el-table
      v-if="show"
      :key="tableKey"
      :data="tableData"
      v-loading="loading"
      style="
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      "
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#409EFF', color: '#FFFFFF' }"
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

      <el-table-column
        label="操作"
        fixed="right"
        width="260"
        v-if="edit || del || submit || check"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-s-check"
            v-if="check"
            :loading="checkBtnLoading"
            @click="handleCheck(scope.$index, scope.row)"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),0 0 6px rgba(0, 0, 0, 0.04); "
            >审核</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-upload2"
            v-if="submit"
            :loading="submitBtnLoading"
            @click="handleSubmit(scope.$index, scope.row)"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),0 0 6px rgba(0, 0, 0, 0.04); "
            >上报</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-edit"
            v-if="edit"
            :loading="editBtnLoading"
            @click="handleEdit(scope.$index, scope.row)"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),0 0 6px rgba(0, 0, 0, 0.04); "
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            v-if="del"
            :loading="delBtnLoading"
            @click="handleDelete(scope.$index, scope.row)"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),0 0 6px rgba(0, 0, 0, 0.04);"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="add"
      icon="el-icon-plus"
      :loading="addBtnLoading"
      style="
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      "
      @click="handleCreate()"
      >添加</el-button
    >
  </div>
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
    show: { type: Boolean, required: false, default: true },
    // 自定义列名
    tableColumns: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    handleRowClassName: {
      type: Function,
      default: function ({ row, rowIndex }) {
        return "white-row";
      },
    },
  },
  data() {
    return {
      selector: false,
      check:false,
      submit:false,
      edit: false,
      del: false,
      add: false,
      checkBtnLoading:false,
      submitBtnLoading:false,
      editBtnLoading: false,
      delBtnLoading: false,
      addBtnLoading:false
    };
  },
  created() {
    // 监听父组件传进来的数据
    if (this.$listeners["handleSelectionChange"]) {
      this.selector = true;
    }
    if (this.$listeners["handleCheck"]) {
      this.check = true;
    }
    if (this.$listeners["handleSubmit"]) {
      this.submit = true;
    }
    if (this.$listeners["handleEdit"]) {
      this.edit = true;
    }
    if (this.$listeners["handleDelete"]) {
      this.del = true;
    }
    if (this.$listeners["handleCreate"]) {
      this.add = true;
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
     * 审核
     */
    handleCheck(index, row) {
      this.checkBtnLoading = true;
      this.$emit("handleCheck", index, row);
      this.checkBtnLoading = false;
    },
    /**
     * 上报按钮
     */
    handleSubmit(index, row) {
      this.submitBtnLoading = true;
      this.$emit("handleSubmit", index, row);
      this.submitBtnLoading = false;
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
    /**
     * 添加按钮
     */
    handleCreate() {
      this.addBtnLoading = true
      this.$emit("handleCreate");
      this.addBtnLoading = false
    },
  },
};
</script>
<style>
/* 解决表头不对齐问题 */
.el-table th {
  display: table-cell !important;
}
.el-table {
  border-radius: 4px;
}
.el-table .warning-row {
  background: #e6a23c44;
}

.el-table .info-row {
  background: #90939946;
}
.el-table .danger-row {
  background: #f56c6c42;
}
.el-table .white-row {
  background: #ffffff;
}
.el-table .gray-row {
  background: rgb(240, 240, 238);
}
.el-table .success-row {
  background: #67c23a7c;
}
.el-button:hover,
.el-button:focus {
  border-color: #409eff;
}

</style>
