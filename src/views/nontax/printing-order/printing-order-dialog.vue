<!-- 省级财政印制订单对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :before-close="close"
      width="30%"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data" style="font-family: 'PingFang SC'">{{
          title
        }}</i>
      </div>
      <el-form ref="data" :model="data" label-width="80px" :rules="rule">
        <el-form-item label="印刷单位">
          <el-select
            v-model="data.printUnitId"
            placeholder="请选择印刷单位"
            filterable
            clearable
          >
            <el-option
              v-for="option in printUnitList"
              :label="option.name"
              :value="option.id"
              :key="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送货仓库">
          <el-select
            v-model="data.warehouseId"
            placeholder="请选择送货仓库"
            filterable
            clearable
          >
            <el-option
              v-for="option in warehousetList"
              :label="option.name"
              :value="option.id"
              :key="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交货日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="data.end"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listByPrintingPlanId } from "@/api/nontax/printing-plan/printing-plan-ticket";
import { listByParentUnitIdAndStatusAndYear } from "@/api/nontax/printing-plan/printing-plan-index";
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    data: { type: Object, required: true },
    tableData: { type: Array },
  },
  data() {
    return {
      rule: {},
      form: {},
      printUnitList: [],
      warehousetList: [],
      subordinateTableData:[]
    };
  },
  created() {
    this.listSubordinatePrintingPlanTicket(this.$store.getters.unitId);
  },
  methods: {
    /**
     * 查询下级单位下年的审核通过的印制计划票据
     * @param {父级单位id} parentUnitId
     */
    listSubordinatePrintingPlanTicket(parentUnitId) {
      const params = {};
      params.parentUnitId = parentUnitId;
      params.printingPlanStatus = 2;
      params.year = new Date().getFullYear() + 1;
      // 查询下级单位下年的审核通过的印制计划
      listByParentUnitIdAndStatusAndYear(params).then((res) => {
        if (res && res.body && res.body.data) {
          // 查询其中的所有票据
          this.listPrintingPlanTicket(res.body.data).then(
            (printingPlanTicketList) => {
              var map = new Map();
              for (let i = 0; i < printingPlanTicketList.length; i++) {
                const printingPlanTicket = { ...printingPlanTicketList[i] };
                if (map.get(printingPlanTicket.ticketId)) {
                  let old = map.get(printingPlanTicket.ticketId);
                  old.theFirstSeason =
                    parseInt(old.theFirstSeason) +
                    parseInt(printingPlanTicket.theFirstSeason);
                  old.theSecondSeason =
                    parseInt(old.theSecondSeason) +
                    parseInt(printingPlanTicket.theSecondSeason);
                  old.theThirdSeason =
                    parseInt(old.theThirdSeason) +
                    parseInt(printingPlanTicket.theThirdSeason);
                  old.theFourthSeason =
                    parseInt(old.theFourthSeason) +
                    parseInt(printingPlanTicket.theFourthSeason);
                  map.set(printingPlanTicket.ticketId, old);
                } else {
                  map.set(printingPlanTicket.ticketId, printingPlanTicket);
                }
              }
              for (var value of map.values()) {
                this.subordinateTableData.push(value)
              }
            }
          );
        }
      });
    },
    /**
     * 根据印制计划列表查询所有票据
     */
    listPrintingPlanTicket(printingPlanList) {
      return new Promise(async (resolve, reject) => {
        let printingPlanTicketList = [];
        for (let i = 0; i < printingPlanList.length; i++) {
          const printingPlan = printingPlanList[i];
          if (printingPlan.id) {
            await listByPrintingPlanId(printingPlan.id).then((res) => {
              if (res && res.body && res.body.data) {
                printingPlanTicketList = printingPlanTicketList.concat(
                  res.body.data
                );
              }
            });
          }
        }
        resolve(printingPlanTicketList);
      });
    },
  },
};
</script>
<style>
</style>
