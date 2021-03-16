<!-- 下级印制计划审核 -->
<template>
  <div class="app-container">
    <div v-if="showTable">
      <hyd-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleCheck="handleCheck"/>
        <subordinate-review-dialog
        :data="dialogData"
        :tableData="dialogTableData"
        :visible="dialogVisible"
        :close="dialogClose"
        :title="dialogTitle"
        />          
    </div>
    <!-- 不在上报日期内，显示告示牌 -->
    <div v-if="showBillboard">
      <hyd-billboard sign="未到上报时间"></hyd-billboard>
    </div>
  </div>
</template>

<script>
import { inRangeOfLimitDate } from "@/api/nontax/printing-plan/limit-date";
import { listByParentUnitIdAndStatusAndYear as listAll,getById} from "@/api/nontax/printing-plan/printing-plan-index";
import { listByPrintingPlanId } from "@/api/nontax/printing-plan/printing-plan-ticket";
import subordinateReviewDialog from './subordinate-review-dialog.vue';
export default {
  components: { subordinateReviewDialog },
  name: '',
  data () {
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
          prop:"unitName",
          label:"填报单位"
        },
        {
          prop: "person",
          label: "填报人",
        },
        {
          prop: "submitDate",
          label:"填报日期"
        }
      ],
      tableLoading: false,
      dialogData:{},
      dialogTableData:[],
      dialogVisible:false,
      dialogTitle:'下级印制计划审核'
    }
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
  methods:{
    getTableData() {
      const params = {}
      params.parentUnitId = this.$store.getters.unitId
      params.printingPlanStatus = 1
      params.year = new Date().getFullYear()+1
      listAll(params).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableData = res.body.data
        }
      })

      
    },
    handleCheck(index,row){
      getById(row.id).then((res) => {
        if (res && res.body && res.body.data) {
          this.dialogData = res.body.data;
        }
      });
      listByPrintingPlanId(row.id).then((res) => {
        if (res && res.body) {
          this.dialogTableData = res.body.data;
          this.dialogVisible = true;
        }
      });
    },
    dialogClose(){
      this.dialogVisible=false
      this.getTableData()
    }
  }
}

</script>
<style>
</style>
