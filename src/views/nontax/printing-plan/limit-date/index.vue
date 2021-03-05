<!-- 印制计划上报设置 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 新增按钮 -->
      <hyd-form
        @handleCreate="handleCreate"
        :editCfg="editCfg"
        inline
        size="medium"
      />
    </div>
    <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleUpdate"
      @handleDelete="handleDelete"
    />
    <limit-date-dialog
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
      :type="dialogType"
      :dataId="dialogDataId"
    />
  </div>
</template>

<script>
import limitDateDialog from "./limit-date-dialog.vue";
export default {
  components: { limitDateDialog },
  name: "",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "year",
          label: "年度",
          sortable: true,
        },
        {
          prop: "startDate",
          label: "上报起始日期",
        },
        {
          prop: "endDate",
          label: "上报截止日期",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      tableLoading: false,
      editCfg: [
        {
          type: "button",
          name: "计划上报设置",
          icon: "el-icon-plus",
          handleName: "handleCreate",
        },
      ],
      dialogVisible: false,
      dialogTitle: "印制计划上报设置",
      dialogType: "",
      dialogDataId: undefined,
    };
  },
  methods: {
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.dialogType = "create";
    },
    handleUpdate(index,row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.dialogType = "update";
      this.dialogDataId = row.id;
    },
    handleDelete(index,row) {
      
    },
    dialogClose() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style>
</style>
