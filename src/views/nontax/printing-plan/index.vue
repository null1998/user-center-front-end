<!-- 本级印制计划维护 -->
<template>
  <div class="app-container">
    <!-- 编辑印制计划 -->
    <div v-if="showTable">
      <hyd-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @handleCreate="handleCreate"
        @handleSubmit="handleSubmit"
      />
      <printing-plan-dialog
        :data="dialogData"
        :tableData="dialogTableData"
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
import {
  save,
  deleteById,
  update,
  listByUnitId,
  getById,
} from "@/api/nontax/printing-plan/printing-plan-index";
import { listByPrintingPlanId } from "@/api/nontax/printing-plan/printing-plan-ticket";
export default {
  components: { printingPlanDialog },
  name: "printing-plan",
  data() {
    return {
      showTable: false,
      showBillboard: false,
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "orderNumber",
          label:"单号"
        },
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
          prop: "submitDate",
          label:"填报日期"
        },
        {
          prop: "status",
          label: "状态",
        },
      ],
      tableLoading: false,
      dialogData: {},
      dialogTableData: [],
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
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            switch (element.status) {
              case 0:
                this.tableData[i].status = "待上报";
                break;
              case 1:
                this.tableData[i].status = "待审核";
                break;
              case 2:
                this.tableData[i].status = "已审核";
                break;
              case 3:
                this.tableData[i].status = "已退回"
                break;
              default:
                break;
            }
          }
        }
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.dialogData = {};
      this.dialogTableData = [];
      this.getTableData();
    },
    handleCreate() {
      this.dialogData.unitId = this.$store.getters.unitId;
      this.dialogData.year = new Date().getFullYear()+1;
      this.dialogData.person = this.$store.getters.nickname
      this.dialogData.status = 0
      save(this.dialogData).then((res) => {
        if (res && res.body && res.body.data) {
          this.$notify({
            title: "success",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.dialogData.id = res.body.data;
          this.dialogVisible = true;
          this.dialogTitle = "印制计划-新增";
          this.dialogType = "create";
        }
      });
    },
    handleEdit(index, row) {
      if (row.status==='待上报' || row.status==='已退回'){
      getById(row.id).then((res) => {
        if (res && res.body && res.body.data) {
          this.dialogData = res.body.data;
        }
      });
      listByPrintingPlanId(row.id).then((res) => {
        if (res && res.body) {
          this.dialogTableData = res.body.data;
          this.dialogVisible = true;
          this.dialogTitle = "印制计划-编辑";
          this.dialogType = "update";
        }
      });}
    },
    handleDelete(index, row) {
      deleteById(row.id).then((res) => {
        if (res && res.body && res.body.data) {
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
    /**
     * 上报按钮
     */
    handleSubmit(index, row) {
      if (row.status === '待上报') {
        const dto = {...row}
        dto.status = 1
        const now = new Date()
        dto.submitDate = now.getFullYear()+'年'+parseInt(now.getMonth()+1)+'月'+now.getDate()+'日'
        update(dto).then((res) => {
          if (res && res.body && res.body.data) {
            this.$notify({
              title: "success",
              message: "操作成功",
              type: "success",
              duration: 2000,
            });
            this.getTableData();
          }
        });
      }
    },
  },
};
</script>
<style scoped>

</style>
