<!-- 印制计划上报设置 -->
<template>
  <div class="app-container">
    <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleUpdate"
      @handleDelete="handleDelete"
      @handleCreate="handleCreate"
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
import {
  listByUnitId,
  deleteById,
} from "@/api/nontax/printing-plan/limit-date";
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
        }
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "印制计划上报设置",
      dialogType: "",
      dialogDataId: undefined,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "新增";
      this.dialogType = "create";
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑";
      this.dialogType = "update";
      this.dialogDataId = row.id;
    },
    handleDelete(index, row) {
      deleteById(row.id).then((res) => {
        if (res) {
          this.$notify({
            title: "success",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.getTableData();
        }
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.getTableData();
    },
    getTableData() {
      const unitId = this.$store.getters.unitId
      listByUnitId(unitId).then((res) => {
        if (res && res.body) {
          this.tableData = res.body.data;
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            this.tableData[i].startDate =
              element.startDate.year +
              "年" +
              element.startDate.monthValue +
              "月" +
              element.startDate.dayOfMonth +
              "日";
            this.tableData[i].endDate =
              element.endDate.year +
              "年" +
              element.endDate.monthValue +
              "月" +
              element.endDate.dayOfMonth +
              "日";
          }
        }
      });
    },
  },
};
</script>
<style>
</style>
