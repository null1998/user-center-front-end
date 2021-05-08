<!-- 票号分配 -->
<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-card class="box-card" style="width: 980px; height: 680px">
          <el-row>
            <el-button
              v-if="false"
              type="danger"
              size="mini"
              @click="deleteAll()"
              :disabled="deleteButtonDisable"
              >批量删除</el-button
            >
            <hyd-table
              :height="580"
              :tableKey="tableKey"
              :tableData="tableData"
              :tableColumns="tableColumons"
              :loading="tableLoading"
              @handleSelectionChange="handleSelect"
            />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div id="main" :style="{ width: '350px', height: '900px' }"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  commonQuery,
  update,
  deleteById,
  save,
  sum
} from "@/api/nontax/ticket-product-record/ticket-product-record-index";
import { commonQuery as commonQueryTicket } from "@/api/basedata/ticket";
import { commonQuery as commonQueryPrintOrder } from "@/api/nontax/printing-order/printing-order-index";
export default {
  name: "ticket-product-record",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "printOrderNumber",
          label: "印制订单号",
          width: "170",
        },
        {
          prop: "ticketName",
          label: "财政票据名称",
          width: "260",
        },
        {
          prop: "number",
          label: "数量",
          width: "100",
        },
        {
          prop: "startNumber",
          label: "起始号",
          width: "100",
        },
        {
          prop: "endNumber",
          label: "终止号",
          width: "100",
        },
        {
          prop: "createdDateShow",
          label: "分配日期"
        }
      ],
      tableLoading: false,
      array: [],
      deleteButtonDisable: false,
      option: {
        title: {
          text: "",
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
            name: "生产记录",
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
      myChart:{},
      sumData:[]
    };
  },
  watch: {
    sumData(val) {
      this.option.series[0].data = []
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        let e = {value:parseInt(element.number),name:element.ticketName}
        this.option.series[0].data.push(e)
      }
      this.myChart.setOption(this.option)
    }
  },
  activated() {
    //this.getTableData()
  },
  created() {
    // this.listAllTicket();
    // this.listPrintOrder();
    this.getTableData();
  },
  mounted() {
    var chartDom = document.getElementById("main");
    this.myChart = echarts.init(chartDom);
    this.option && this.myChart.setOption(this.option);
  },
  methods: {

    /**
     * 简单使用下，不应该这样批量删除
     */
    async deleteAll() {
      this.deleteButtonDisable = true;
      for (let index = 0; index < this.array.length; index++) {
        const row = this.array[index];
        if (row.id) {
          await this.helper(row);
        }
      }
      this.getTableData();
      this.success();
      this.deleteButtonDisable = false;
    },
    async helper(row) {
      await deleteById(row.id);
    },
    handleSelect(rows) {
      this.array = rows;
    },
    /**
     * 查询所有票据
     */
    listAllTicket() {
      commonQueryTicket({}).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableColumons[1].options = res.body.data;
        }
      });
    },
    /**
     * 查询该印刷厂的所有未完工印刷订单
     */
    listPrintOrder() {
      commonQueryPrintOrder({
        printUnitId: this.$store.getters.unitId,
        status: 1,
      }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableColumons[0].options = res.body.data;
        }
      });
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({ printUnitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            if (element.createdDate) {
              element.createdDateShow = element.createdDate.year+'-'
              +element.createdDate.monthValue+'-'
              +(element.createdDate.dayOfMonth+1)
            }
          }
          this.tableLoading = false;
        }
      });
      sum({ printUnitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.sumData = res.body.data;
        }
      })
    },
    handleSave(index, row) {
      if (this.dataValid(row)) {
        row.printUnitId = this.$store.getters.unitId;
        if (row.id) {
          update(row).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.getTableData();
            }
          });
        } else {
          save(row).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.getTableData();
            }
          });
        }
      } else {
        this.getTableData();
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
      if (row && row.printOrderNumber && row.ticketId && row.number) {
        return /^[1-9][0-9]*$/.test(row.number);
      }
      return false;
    },
  },
};
</script>
<style>
</style>
