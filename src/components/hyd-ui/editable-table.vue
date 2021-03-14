<!-- 通用可编辑table，动态创建列，支持行内编辑 -->
<template>
  <div>
    <el-table
      v-if="show"
      :key="tableKey"
      :data="myTableData"
      v-loading="loading"
      style="width: 100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
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
      >
        <template slot-scope="scope">
          <span v-if="editingRowIndex === scope.$index">
            <div v-if="item.type === 'show'">
              {{scope.row[item.prop]}}
            </div>
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
                v-for="option in item.options"
                :label="option[item.optionLabel?item.optionLabel:'label']"
                :value="option[item.optionValue?item.optionValue:'value']"
                :key="option[item.optionValue?item.optionValue:'value']"
              ></el-option>
            </el-select>
          </span>
          <span v-else>{{
            item.type === "select"
              ? showSelectorValue(index, scope.row[item.prop],item.optionLabel,item.optionValue)
              : scope.row[item.prop]
          }}</span>
        </template>
      </af-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            v-if="editingRowIndex !== scope.$index"
            @click="handleEdit(scope.$index, scope.row)"
            class="pan-btn light-blue-btn"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-delete"
            v-if="editingRowIndex !== scope.$index"
            :loading="delBtnLoading"
            @click="handleDelete(scope.$index, scope.row)"
            type="danger"
            class="pan-btn light-blue-btn"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
            >删除</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-circle-check"
            v-if="editingRowIndex === scope.$index"
            :loading="saveBtnLoading"
            @click="handleSave(scope.$index, scope.row)"
            class="pan-btn light-blue-btn"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
            >保存</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-circle-close"
            v-if="editingRowIndex === scope.$index"
            @click="handleCancel(scope.$index, scope.row)"
            class="pan-btn light-blue-btn"
            style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
            >取消</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-button
      style="
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      "
      @click="handleAdd()"
      >
      <mallki class-name="mallki-text" text="添加" />
      </el-button
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
      myTableData:this.tableData,
      selector: false,
      edit: false,
      del: false,
      saveBtnLoading: false,
      delBtnLoading: false,
      editingRowIndex: -1,
      originRow: undefined,
      sumRow: 0,
    };
  },
  watch: {
      tableData (val) {
        this.myTableData = val
      },
      myTableData(val) {

      }
    },
  created() {
    this.sumRow = this.myTableData.length;
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
      if (this.editingRowIndex !== -1) {
        this.$confirm("有尚未保存的数据, 是否保存?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.handleSave(
            this.editingRowIndex,
            this.myTableData[this.editingRowIndex]
          ).then(()=>{
            this.editingRowIndex = index;
            this.originRow = { ...row };
          })   
        });
        
      } else {
        this.editingRowIndex = index;
        this.originRow = { ...row };
      }
    },
    /**
     * 删除按钮
     */
    handleDelete(index, row) {
      this.delBtnLoading = true;
      this.myTableData.splice(index, 1);
      this.$emit("handleDelete", index, row);
      this.delBtnLoading = false;
      this.sumRow = this.myTableData.length;
    },
    /**
     * 保存按钮
     */
    handleSave(index, row) {
      this.saveBtnLoading = true;
      this.$emit("handleSave", index, row);
      this.saveBtnLoading = false;
      this.editingRowIndex = -1;
      this.sumRow = this.myTableData.length;
    },
    /**
     * 取消按钮
     */
    handleCancel(index, row) {
      this.editingRowIndex = -1;
      this.myTableData[index] = this.originRow;
    },
    /**
     * 添加按钮
     */
    handleAdd() {
      if(this.myTableData.length === 0) {
        this.editingRowIndex = -1
      }
      // if (this.myTableData.length > this.sumRow) {
      //   return;
      // }
      if (this.editingRowIndex !== -1) {
        this.$confirm("有尚未保存的数据, 是否保存?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.handleSave(
            this.editingRowIndex,
            this.myTableData[this.editingRowIndex]
          ).then(()=>{
            this.myTableData.push({});
          })
        });
      } else {
        this.myTableData.push({});
      }
    },
    showSelectorValue(index, key, optionLabel, optionValue) {
      if (key) {
        for (let i = 0; i < this.tableColumns[index].options.length; i++) {
          const element = this.tableColumns[index].options[i];
          if (element[optionValue?optionValue:'value'] === key) {
            
            return element[optionLabel?optionLabel:'label'];
          }
        }
      }
      return "";
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
  border-color: #409EFF;
}
</style>
