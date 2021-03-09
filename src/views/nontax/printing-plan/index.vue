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
import { save, deleteById,update,listByUnitId,getById } from "@/api/nontax/printing-plan/printing-plan-index";
import { listByPrintingPlanId } from "@/api/nontax/printing-plan/printing-plan-ticket";
export default {
  components: { printingPlanDialog },
  name: "",
  data() {
    return {
      showTable: false,
      showBillboard: false,
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
      dialogTableData:[],
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
                this.tableData[i].status='待上报'
                break;
              case 1:
                this.tableData[i].status='待审核'
                break;
              case 2:
                this.tableData[i].status='已审核'
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
      this.dialogData = {}
      this.dialogTableData = []
      this.getTableData();
    },
    handleCreate() {
      this.dialogData.unitId = this.$store.getters.unitId
      this.dialogData.year = new Date().getFullYear()
      save(this.dialogData).then((res) => {
        if (res && res.body && res.body.data) {
          this.$notify({
            title: "success",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.dialogData.id = res.body.data
          this.dialogVisible = true;
          this.dialogTitle = "印制计划-新增";
          this.dialogType = "create";  
        }
      });
    },
    handleEdit(index, row) {
      getById(row.id).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.dialogData = res.body.data
        }
      })
      listByPrintingPlanId(row.id).then(res=>{
        if (res&&res.body) {
          this.dialogTableData = res.body.data
          this.dialogVisible = true;
        this.dialogTitle = "印制计划-编辑";
        this.dialogType = "update";
        }
      })
      
    },
    handleDelete(index, row) {
      deleteById(row.id).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.$notify({
            title: "success",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.getTableData();
        }
      })
    },
    handleSubmit(index,row) {
      row.status = 1
      update(row).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.$notify({
            title: "success",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.getTableData();
        }
      })
    }
  },
};
</script>
<style>
</style>
