<!-- 通用可编辑table，动态创建列，支持行内编辑 -->
<template>
  <div>
    <el-table
      v-if="show"
      :key="tableKey"
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
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
      >
        <template slot-scope="scope">
          <span v-if="editingRowIndex === scope.$index">
            <el-input
              v-if="item.type === 'input'"
              size="mini"
              placeholder="请输入内容"
              v-model="scope.row[item.prop]"
            >
            </el-input>
            <!-- 下拉框 -->
            <el-select
              v-if="item.type === 'select'"
              size="mini"
              v-model="scope.row[item.prop]"
              filterable
              clearable
              :placeholder="item.placeholder"
            >
              <el-option
                v-for="op in item.options"
                :label="op.label"
                :value="op.value"
                :key="op.value"
              ></el-option>
            </el-select>
          </span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </af-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            round
            v-if="editingRowIndex !== scope.$index"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            round
            v-if="editingRowIndex !== scope.$index"
            :loading="delBtnLoading"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-edit"
            round
            v-if="editingRowIndex === scope.$index"
            @click="handleSave(scope.$index, scope.row)"
            >保存</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            round
            v-if="editingRowIndex === scope.$index"
            @click="handleCancel(scope.$index, scope.row)"
            >取消</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="el-table-add-row" style="width: 99.2%" @click="handleAdd()">
      <span>+ 添加</span>
    </div>
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
      edit: false,
      del: false,
      editBtnLoading: false,
      delBtnLoading: false,
      editingRowIndex: -1,
      originRow: undefined,
      sumRow:0
    };
  },
  created() {
    this.sumRow = this.tableData.length
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
      this.editingRowIndex = index;
      this.originRow = {...row}
    },
    /**
     * 删除按钮
     */
    handleDelete(index, row) {
      this.delBtnLoading = true;
      this.$emit("handleDelete", index, row);
      this.delBtnLoading = false;
      this.sumRow = this.tableData.length
    },
    /**
     * 保存按钮
     */
    handleSave(index, row) {
      this.editBtnLoading = true;
      this.$emit("handleSave", index, row);
      this.editBtnLoading = false;
      this.editingRowIndex = -1;
      this.sumRow = this.tableData.length
    },
    /**
     * 取消按钮
     */
    handleCancel(index, row) {
      this.editingRowIndex = -1;
      this.tableData[index] = this.originRow;
    },
    /**
     * 添加按钮
     */
    handleAdd() {
      if (this.tableData.length > this.sumRow) {
        return
      }
      if (this.editingRowIndex !== -1) {
        this.$confirm("有尚未保存的数据, 是否保存?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.handleSave(
            this.editingRowIndex,
            this.tableData[this.editingRowIndex]
          );
          this.tableData.push({});
        });
      }  else {
        this.tableData.push({});
      }
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
  border-color: #18ab8f;
}
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
</style>
