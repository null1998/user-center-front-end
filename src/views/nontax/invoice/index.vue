<!-- 开票管理 -->
<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-card class="box-card" style="width: 980px; height: 680px">
          <el-row>
            <hyd-editable-table
              :height="580"
              :tableKey="tableKey"
              :tableData="tableData"
              :tableColumns="tableColumns"
              :loading="tableLoading"
              @handleSave="handleSave"
              @handleDelete="handleDelete"
            />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-row><div id="main" :style="{ width: '350px', height: '350px' }"></div></el-row>
        <el-row><div id="price" :style="{ width: '350px', height: '350px' }"></div></el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  save,
  deleteById,
  commonQuery,
  getById,
  analysisTicketNumber,
  analysisTicketPrice,
} from "@/api/nontax/invoice/invoice-index";
import { listByZoneId as listTicket } from "@/api/basedata/ticket";
export default {
  components: {},
  name: "",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumns: [
        {
          prop: "ticketId",
          label: "财政票据名称",
          type: "select",
          options: [],
          optionLabel: "name",
          optionValue: "id",
          width: "240",
        },
        {
          prop: "price",
          label: "金额",
          type: "input",
        },
        {
          prop: "invoicePeople",
          label: "开票人",
          type: "input",
        },
        {
          prop: "ticketNumber",
          label: "票号",
          type: "show",
        },
        {
          prop: "invoiceDateShow",
          label: "开票日期",
          type: "show",
        },
      ],
      tableLoading: false,
      invoicePieData: [],
      invoicePiePriceData: [],
      option: {
        
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "开票数量",
            type: "pie",
            radius: ["20%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "10",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      myChart: {},
      priceChart:{},
      priceOption: {
        
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "开票金额",
            type: "pie",
            radius: ["20%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "10",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    invoicePieData(val) {
      let tmpList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        const tmp = { name: element.ticketName, value: element.number };
        tmpList.push(tmp);
      }
      this.option.series[0].data = tmpList;
      this.myChart.setOption(this.option);
    },
    invoicePiePriceData(val) {
      let tmpList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        const tmp = { name: element.ticketName, value: element.price };
        tmpList.push(tmp);
      }
      
      this.priceOption.series[0].data = tmpList;
      this.priceChart.setOption(this.priceOption);
    },
  },
  mounted() {
    var chartDom = document.getElementById("main");
    var priceDom = document.getElementById("price");
    this.myChart = echarts.init(chartDom);
    this.priceChart = echarts.init(priceDom);
    this.getTableData();
    this.listTicket();
  },
  methods: {
    getTableData() {
      this.tableLoading = true;
      commonQuery({ unitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            if (element.invoiceDate) {
              element.invoiceDateShow =
                element.invoiceDate.year +
                "-" +
                element.invoiceDate.monthValue +
                "-" +
                (element.invoiceDate.dayOfMonth + 1);
            }
          }
          this.tableLoading = false;
        }
      });
      analysisTicketNumber(this.$store.getters.unitId).then((res) => {
        if (res && res.body && res.body.data) {
          this.invoicePieData = res.body.data;
        }
      });
      analysisTicketPrice(this.$store.getters.unitId).then((res) => {
        if (res && res.body && res.body.data) {
          this.invoicePiePriceData = res.body.data;
        }
      });
    },
    /**
     * 查询本省的所有票据
     */
    listTicket() {
      listTicket(this.$store.getters.provinceZoneId).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableColumns[0].options = res.body.data;
        }
      });
    },
    handleSave(index, row) {
      if (row.id) {
        return;
      }
      // 数据不合法，返回
      if (!this.dataValid(row)) {
        this.getTableData();
        return;
      }
      row.unitId = this.$store.getters.unitId;
      row.invoiceDate = new Date();
      row.userId = this.$store.getters.id;
      row.status = 0;
      save(row).then((res) => {
        if (res && res.body && res.body.data) {
          this.success();
          this.getTableData();
        }
      });
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
    dataValid(row) {
      if (row && row.ticketId && row.price && row.invoicePeople) {
        return /(^[1-9]+\d*$)|(^0$)/.test(row.price);
      }
      return false;
    },
  },
};
</script>
<style>
</style>
