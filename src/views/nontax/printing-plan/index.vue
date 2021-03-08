<!-- 本级印制计划维护 -->
<template>
  <div class="app-container">
    <!-- 编辑印制计划 -->
    <div v-if="showTable">
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
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
      />
      <printing-plan-dialog
        :data="dialogData"
        :visible="dialogVisible"
        :close="dialogClose"
        :title="dialogTitle"
        :type="dialogType"
      ></printing-plan-dialog>
    </div>
    <!-- 不在上报日期内，显示告示牌 -->
    <div v-if="showBillboard">
      <hyd-billboard sign="未到上报时间"></hyd-billboard>
    </div>
  </div>
</template>

<script>
import printingPlanDialog from "./printing-plan-dialog.vue";
import { inRangeOfLimitDate } from "@/api/nontax/printing-plan/limit-date";
import { listByUnitId } from "@/api/nontax/printing-plan/printing-plan";
export default {
  components: { printingPlanDialog },
  name: "",
  data() {
    return {
      showTable:false,
      showBillboard:false,
      editCfg: [
        {
          type: "button",
          name: "新增",
          icon: "el-icon-plus",
          handleName: "handleCreate",
        },
      ],
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "year",
          label: "计划年度",
          sortable: true,
        },
        {
          prop: "person",
          label: "填报人",
        },
        {
          prop: "status",
          label: "状态",
        },
      ],
      tableLoading: false,
      dialogData: {},
      dialogVisible: false,
      dialogTitle: "",
      dialogType: "",
    };
  },
  created() {
    inRangeOfLimitDate(this.$store.getters.unitId).then((res) => {
      if (res && res.body) {
        this.showTable = res.body.data;
        this.showBillboard = !res.body.data;
      }
    });
    this.getTableData();
  },
  methods: {
    getTableData() {
      listByUnitId(this.$store.getters.unitId).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
        }
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.getTableData();
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "印制计划-新增";
      this.dialogType = "create";
    },
    handleEdit(index, row) {
      //this.dialogData =
      this.dialogVisible = true;
      this.dialogTitle = "印制计划-编辑";
      this.dialogType = "update";
    },
    handleDelete(index, row) {
      console.log(row);
      this.getTableData();
    },
  },
};
</script>
<style>
</style>
