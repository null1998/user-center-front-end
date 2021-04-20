<!-- 票据出库记录 -->
<template>
  <div>
    <el-row>
      <el-col :span="17">
        <el-card class="box-card" style="width: 920px; height: 680px">
          <el-row>
            <hyd-table
              :height="580"
              :tableKey="tableKey"
              :tableData="tableData"
              :tableColumns="tableColumons"
              :loading="tableLoading"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
              @handleCreate="handleCreate"
            />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="7">
        <div id="main" :style="{ width: '400px', height: '350px' }"></div>
      </el-col>
    </el-row>
    <ticket-out-record-dialog
      :dialogData="dialogData"
      :dialogTableData="dialogTableData"
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
    />
  </div>
</template>

<script>
import * as echarts from "echarts";
import ticketOutRecordDialog from "./ticket-out-record-dialog";
import {
  save,
  deleteById,
  commonQuery,
  getById,
  recent
} from "@/api/nontax/ticket-out-record/ticket-out-record-index";
import { commonQuery as getDialogTableData } from "@/api/nontax/ticket-out-record/ticket-out-record-ticket";
export default {
  components: { ticketOutRecordDialog },
  name: "",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "targetOrderNumber",
          label: "目标单号",
          width: "200",
        },
        {
          prop: "targetUnitName",
          label: "目标单位",
        },
        {
          prop: "outType",
          label: "出库方式",
        },
        {
          prop: "outDateShow",
          label: "出库日期",
        },
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "",
      dialogData: {},
      dialogTableData: [],
      option: {
        title: {
          text: '近一周出库记录'
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
          },
        ],
      },
      myChart: {},
    };
  },
  watch: {},
  activated() {
    //this.getTableData()
  },
  created() {
    this.getTableData();
  },
   mounted() {
    var chartDom = document.getElementById("main");
    this.myChart = echarts.init(chartDom);
  },
  methods: {
    getLineChart() {
      recent(this.$store.getters.unitId).then(res=>{
        if (res && res.body && res.body.data) {
          this.option.series[0].data = res.body.data.numbers
          this.option.xAxis.data = res.body.data.duration
          this.myChart.setOption(this.option);
        }
      })
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({ unitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            if (element.outDate) {
              element.outDateShow = element.outDate.year + '-' + element.outDate.monthValue + '-' + element.outDate.dayOfMonth
            }
          }
          this.getLineChart()
          this.tableLoading = false;
        }
      });
    },
    handleEdit(index, row) {
      if (row && row.id) {
        getById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.dialogData = res.body.data;
            getDialogTableData({ ticketOutRecordId: this.dialogData.id }).then(
              (resp) => {
                if (resp && resp.body && resp.body.data) {
                  this.dialogTableData = resp.body.data;
                  this.dialogVisible = true;
                  this.dialogTitle = "票据出库记录";
                }
              }
            );
          }
        });
      }
    },
    handleDelete(index, row) {
      if (row && row.id) {
        deleteById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.success();
            this.getTableData();
          }
        });
      }
    },
    handleCreate() {
      save({ unitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.success();
          this.handleEdit(undefined, { id: res.body.data });
        }
      });
    },
    dialogClose() {
      this.getTableData();
      this.dialogVisible = false;
      this.dialogData = {};
      this.dialogTableData = [];
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
        message: "操作失败",
        type: "error",
        duration: 2000,
      });
    },
  },
};
</script>
<style>
</style>
