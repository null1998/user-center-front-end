<!-- 印刷厂订单进度 -->
<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-card class="box-card" style="width: 980px; height: 680px">
          <el-row>
            <hyd-table
              :height="600"
              :tableKey="tableKey"
              :tableData="tableData"
              :tableColumns="tableColumons"
              :loading="tableLoading"
              @handleEdit="handleEdit"
            />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div id="main" :style="{ width: '350px', height: '350px' }"></div>
      </el-col>
    </el-row>
    <order-progress-dialog
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
import orderProgressDialog from "./order-progress-dialog.vue";
import {
  commonQuery,
  getById,
} from "@/api/nontax/printing-order/printing-order-index";
import { listByPrintingOrderId as getDialogTableData } from "@/api/nontax/printing-order/printing-order-ticket";
export default {
  components: { orderProgressDialog },
  name: "order-progress",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "orderNumber",
          label: "印制单号",
          width: "170",
        },
        {
          prop: "unitName",
          label: "收货单位",
          width: "100",
        },
        {
          prop: "warehouseName",
          label: "收货仓库",
          width: "150",
        },
        {
          prop: "startShow",
          label: "下单日期",
          width: "130",
        },
        {
          prop: "endShow",
          label: "完工日期",
          width: "130",
        },
        {
          prop: "status",
          label: "订单状态",
          width: "100",
        },
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "",
      dialogData: {},
      dialogTableData: [],
      statusMap: ["待下单", "已下单", "已完工", "已入库"],
      option: {
        title: {
          text: "近一周订单数量",
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      },
      myChart: {},
    };
  },
  created() {
    this.getTableData();
  },
  mounted() {
    var chartDom = document.getElementById("main");
    this.myChart = echarts.init(chartDom);
    this.option && this.myChart.setOption(this.option);
  },
  methods: {
    getTableData() {
      this.tableLoading = true;
      commonQuery({ printUnitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let i = 0; i < this.tableData.length; i++) {
            let element = this.tableData[i];
            element["status"] = this.statusMap[element["status"]];
            if (element.start) {
              element.startShow =
                element.start.year +
                "-" +
                element.start.monthValue +
                "-" +
                element.start.dayOfMonth;
            }
            if (element.end) {
              element.endShow =
                element.end.year +
                "-" +
                element.end.monthValue +
                "-" +
                element.end.dayOfMonth;
            }
          }
          this.tableLoading = false;
        }
      });
    },
    handleEdit(index, row) {
      if (row && row.id) {
        getById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.dialogData = res.body.data;
            getDialogTableData(this.dialogData.id).then((resp) => {
              if (resp && resp.body && resp.body.data) {
                this.dialogTableData = resp.body.data;
                this.dialogVisible = true;
                this.dialogTitle = "订单进度";
              }
            });
          }
        });
      }
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
