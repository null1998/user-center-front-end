<!-- 本级印制计划对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="90%"
      :show-close="false"
      :before-close="close"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data" style="font-family: 'PingFang SC'">{{
          title
        }}</i>
        <i class="el-icon-circle-close" style="float: right" @click="close"
          >退出</i
        >
        <i
          v-if="data.status == 0 || data.status == 3"
          class="el-icon-circle-check"
          style="float: right"
          @click="handleSaveDialog"
          >保存</i
        >
      </div>
      <hyd-editable-table
        :tableKey="tableKey"
        :tableData="myTableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        :showButton="data.status == 0 || data.status == 3"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="上年用票数" name="lastYear">
          <hyd-table
            :tableKey="lastYearTableKey"
            :tableData="lastYearTableData"
            :tableColumns="tableColumons"
            :loading="lastYearTableLoading"
          />
        </el-tab-pane>
        <el-tab-pane label="下级上报汇总参考" name="subordinate">
          <el-button type="primary" size="mini" v-if="data.status == 0 || data.status == 3" @click="importData()">一键导入</el-button>
          <hyd-table
            :tableKey="subordinateTableKey"
            :tableData="subordinateTableData"
            :tableColumns="subordinateTableColumns"
            :loading="subordinateTableLoading"
            @handleSelectionChange="handleSelect"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { commonQuery } from "@/api/basedata/ticket";
import { listProvinceZone, getById } from "@/api/basedata/zone";
import {
  update,
  listByParentUnitIdAndStatusAndYear,
} from "@/api/nontax/printing-plan/printing-plan-index";
import {
  update as updatePrintingPlanTicket,
  listByPrintingPlanId,
  save as savePrintingPlanTicket,
  deleteById as deletePrintingPlanTicket,
} from "@/api/nontax/printing-plan/printing-plan-ticket";
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    type: { type: String },
    data: { type: Object, required: true },
    tableData: { type: Array },
  },
  data() {
    return {
      tableKey: 0,
      tableColumons: [
        {
          prop: "ticketId",
          label: "财政票据名称",
          type: "select",
          options: [],
          optionLabel: "name",
          optionValue: "id",
          placeholder: "请选择票据",
        },
        {
          prop: "theFirstSeason",
          label: "一季度",
          type: "input",
        },
        {
          prop: "theSecondSeason",
          label: "二季度",
          type: "input",
        },
        {
          prop: "theThirdSeason",
          label: "三季度",
          type: "input",
        },
        {
          prop: "theFourthSeason",
          label: "四季度",
          type: "input",
        },
      ],
      tableLoading: false,
      activeName: "lastYear",
      lastYearTableKey: 0,
      lastYearTableData: [],
      lastYearTableLoading: false,
      subordinateTableKey: 0,
      subordinateTableColumns: [
        {
          prop: "ticketName",
          label: "财政票据名称",
        },
        {
          prop: "theFirstSeason",
          label: "一季度",
        },
        {
          prop: "theSecondSeason",
          label: "二季度",
        },
        {
          prop: "theThirdSeason",
          label: "三季度",
        },
        {
          prop: "theFourthSeason",
          label: "四季度",
        },
      ],
      subordinateTableData: [],
      subordinateTableLoading: false,
      ticketList: [],
      myTableData: this.tableData,
      array:[]
    };
  },
  watch: {
    tableData(val) {
      this.myTableData = val;
    },
  },
  created() {
    let params = {};
    params.zoneId = this.$store.getters.provinceZoneId;
    params.year = new Date().getFullYear() + 1;
    // 查询明年本省所有票据
    commonQuery(params).then((res) => {
      if (res && res.body && res.body.data) {
        this.tableColumons[0].options = res.body.data;
      }
    });
    this.listSubordinatePrintingPlanTicket(this.$store.getters.unitId);
  },
  methods: {
    importData(){
      new Promise(() => {
        for (let index = 0; index < this.array.length; index++) {
          const row = {...this.array[index]};
          row.id = undefined;
          this.handleSave(undefined, row);
        }
      }).then(()=>{
        this.getTableData()
      });
    },
    handleSelect(rows){
      this.array = rows
    },
    handleSave(index, row) {
      // 数据不合法，返回
      if (!this.dataValid(row)) {
        this.error()
        this.getTableData()
        return;
      }
      
      this.data.person = this.$store.getters.nickname;
      if (row.id) {
        updatePrintingPlanTicket(row).then((res) => {
          if (res && res.body) {
            this.success();
            this.getTableData();
          }
        });
      } else {
        row.printingPlanId = this.data.id;

        savePrintingPlanTicket(row).then((res) => {
          if (res && res.body) {
            this.success();
            this.getTableData();
          }
        });
      }
      
    },
    handleDelete(index, row) {
      if ((this.data.status === 0 || this.data.status === 3) && row.id) {
        deletePrintingPlanTicket(row.id).then((res) => {
          if (res && res.body) {
            this.success();
            this.getTableData();
          }
        });
      }
    },
    handleSaveDialog() {
      update(this.data).then((res) => {
        if (res && res.body && res.body.data) {
          this.$notify({
            title: "success",
            message: "操作成功",
            type: "success",
            duration: 2000,
          });
          this.close();
        }
      });
    },
    getTableData() {
      listByPrintingPlanId(this.data.id).then((res) => {
        if (res && res.body) {
          this.myTableData = res.body.data;
        }
      });
    },
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
                this.subordinateTableData.push(value);
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
    success() {
      this.$notify({
        title: "success",
        message: "操作成功",
        type: "success",
        duration: 2000,
      });
    },
    error() {
      this.$notify({
        title: "error",
        message: "数据格式错误！",
        type: "error",
        duration: 2000,
      });
    },
    dataValid(row) {
      
      if (!row || !row.ticketId) {
        return false;
      }
      if (!row.theFirstSeason||row.theFirstSeason==='') {
        row.theFirstSeason = 0
      }
      if (!row.theSecondSeason||row.theSecondSeason==='') {
        row.theSecondSeason = 0
      }
      if (!row.theThirdSeason||row.theThirdSeason==='') {
        row.theThirdSeason = 0
      }
      if (!row.theFourthSeason||row.theFourthSeason==='') {
        row.theFourthSeason = 0
      }
      var result1 = /^[0-9]+$/.test(row.theFirstSeason)
      var result2 = /^[0-9]+$/.test(row.theSecondSeason)
      var result3 = /^[0-9]+$/.test(row.theThirdSeason)
      var result4 = /^[0-9]+$/.test(row.theFourthSeason)
      return result1&&result2&&result3&&result4
    }
  },
};
</script>
<style>
</style>
