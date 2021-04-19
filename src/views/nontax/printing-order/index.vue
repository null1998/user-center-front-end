<!-- 印制订单 -->
<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-card class="box-card" style="width: 980px; height: 680px">
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
      <el-col :span="6">
        <div id="main" :style="{ width: '350px', height: '350px' }"></div>
      </el-col>
    </el-row>

    <printing-order-dialog
      :dialogData="dialogData"
      :dialogTableData="dialogTableData"
      :dialogAmount="dialogAmount"
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
      :clearValidate="dialogClearValidate"
    />
  </div>
</template>

<script>
import * as echarts from "echarts";
import printingOrderDialog from "./printing-order-dialog.vue";
import {
  save,
  commonQuery,
  deleteById,
  getById,
} from "@/api/nontax/printing-order/printing-order-index";
import { listByPrintingOrderId } from "@/api/nontax/printing-order/printing-order-ticket";
export default {
  components: { printingOrderDialog },
  name: "printing-order",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "orderNumber",
          label: "单号",
          width: "200",
        },
        {
          prop: "printUnitName",
          label: "印刷单位",
          width: "150",
        },
        {
          prop: "startShow",
          label: "下单日期",
          sortable: true,
          width: "150",
        },
        {
          prop: "status",
          label: "订单状态",
          width: "100",
        },
        {
          prop: "payStatus",
          label: "结算状态",
          width: "100",
        },
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "",
      dialogData: {},
      dialogAmount: undefined,
      dialogTableData: [],
      dialogClearValidate: false,
      statusMap: ["待下单", "已下单", "已完工", "已入库"],
      payStatusMap: ["待下单", "待付款", "已付款"],
      option: {
        title: {
          text: "印制订单状态",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "订单状态",
            type: "pie",
            radius: "50%",
            data: [
              
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      myChart:{}
    };
  },
  watch:{
    tableData(val){
      this.option.series[0].data = []
      let map = new Map()
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        if (map.get(element.status)) {
          map.set(element.status,map.get(element.status)+1)
        } else {
          map.set(element.status,1)
        }
      }
      for(let key of map.keys()) {
        let e = {value: parseInt(map.get(key)), name: key}
        this.option.series[0].data.push(e)
      }
      this.myChart.setOption(this.option)
    }
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
      commonQuery({ unitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let i = 0; i < this.tableData.length; i++) {
            let element = this.tableData[i]
            element["status"] = this.statusMap[
              element["status"]
            ];
            element["payStatus"] = this.payStatusMap[
              element["payStatus"]
            ];
            if (element.start) {
            element.startShow = element.start.year + '-' + element.start.monthValue + '-' + element.start.dayOfMonth

            }
            if (element.end) {
            element.endShow = element.end.year + '-' + element.end.monthValue + '-' + element.end.dayOfMonth
              
            }
          }
          this.tableLoading = false;
          
        }
      });
    },
    handleView(index, row) {
      this.dialogVisible = true;
      this.dialogTitle = "印制订单-查看";
    },
    handleEdit(index, row) {
      this.dialogClearValidate = false;
      if (row && row.id) {
        getById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.dialogData = res.body.data;
            this.dialogAmount = 0;
            listByPrintingOrderId(this.dialogData.id).then((resp) => {
              if (resp && resp.body && resp.body.data) {
                // 计算价格
                for (let i = 0; i < resp.body.data.length; i++) {
                  const row = resp.body.data[i];
                  this.dialogAmount += row.price * row.number;
                }
                this.dialogTableData = resp.body.data;
                this.dialogVisible = true;
                this.dialogTitle = "印制订单";
              }
            });
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
      this.dialogClearValidate = false;
      this.dialogData = {
        unitId: this.$store.getters.unitId,
        status: 0,
        payStatus: 0,
        person: this.$store.getters.nickname,
      };
      this.dialogAmount = 0;
      save(this.dialogData).then((res) => {
        if (res && res.body && res.body.data) {
          this.success();
          this.handleEdit(undefined,{id:res.body.data})
        }
      });
    },
    dialogClose() {
      this.getTableData();
      this.dialogClearValidate = true;
      this.dialogVisible = false;
      this.dialogData = {};
      this.dialogTableData = [];
      this.dialogAmount = undefined;
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
