<!-- 本级印制计划对话框 -->
<template>
  <div>
    <el-dialog :visible.sync="visible" width="75%" :show-close="false">
      <div slot="title" class="header-title">
        <i class="el-icon-s-data" style="font-family: 'PingFang SC'">{{
          title
        }}</i>
        <i class="el-icon-circle-close" style="float: right" @click="close"
          >退出</i
        >
        <i
          class="el-icon-circle-check"
          style="float: right"
          @click="handleSaveDialog"
          >保存</i
        >
           
      </div>
      <el-form v-model="data">
        <el-form-item label="年度">
          <el-select v-model="year" style="width: 100px" size="mini">
            <el-option
              :label="currentYear"
              :value="currentYear"
              :key="currentYear"
            ></el-option>
            <el-option
              :label="currentYear + 1"
              :value="currentYear + 1"
              :key="currentYear + 1"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <hyd-editable-table
        :tableKey="tableKey"
        :tableData="myTableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
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
        <el-tab-pane label="下级上报汇总数" name="subordinate">
          <hyd-table
            :tableKey="subordinateTableKey"
            :tableData="subordinateTableData"
            :tableColumns="tableColumons"
            :loading="subordinateTableLoading"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { listAll } from "@/api/basedata/ticket";
import { update } from "@/api/nontax/printing-plan/printing-plan-index";
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
      subordinateTableData: [],
      subordinateTableLoading: false,
      ticketList: [],
      currentYear: new Date().getFullYear(),
      year: new Date().getFullYear(),
      myTableData: this.tableData,
    };
  },
  watch: {
    tableData(val) {
      this.myTableData = val;
    },
  },
  created() {
    listAll().then((res) => {
      if (res && res.body && res.body.data) {
        this.ticketList = res.body.data;
        for (let i = 0; i < this.ticketList.length; i++) {
          const ticket = this.ticketList[i];
          const option = {};
          option.label = ticket.name;
          option.value = ticket.id;
          this.tableColumons[0].options.push({ ...option });
        }
        console.log(this.tableColumons[0].options);
      }
    });
  },
  methods: {
    handleSave(index, row) {
      if (this.data.status === 0 || this.data.status === 3) {
        if (row.id) {
          updatePrintingPlanTicket(row).then((res) => {
            if (res && res.body) {
              this.listPrintingPlanTicket(this.data.id);
            }
          });
        } else {
          row.printingPlanId = this.data.id;
          savePrintingPlanTicket(row).then((res) => {
            if (res && res.body) {
              this.listPrintingPlanTicket(this.data.id);
            }
          });
        }
      }
    },
    handleDelete(index, row) {
      if ((this.data.status === 0 || this.data.status === 3) && row.id) {
        deletePrintingPlanTicket(row.id).then((res) => {
          if (res && res.body) {
            this.listPrintingPlanTicket(this.data.id);
          }
        });
      }
    },
    handleSaveDialog() {
      this.data.year = this.year;
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
    listPrintingPlanTicket(printingPlanId) {
      listByPrintingPlanId(printingPlanId).then((res) => {
        if (res && res.body) {
          this.myTableData = res.body.data;
        }
      });
    },
  },
};
</script>
<style>
</style>
