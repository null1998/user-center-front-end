<!-- 票据申领管理 -->
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

    <ticketClaimDialog
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
import ticketClaimDialog from "./ticket-claim-dialog.vue";
import {
  save,
  deleteById,
  commonQuery,
  getById,
} from "@/api/nontax/ticket-claim/ticket-claim-index";
import { commonQuery as getDialogTableData } from "@/api/nontax/ticket-claim/ticket-claim-ticket";
export default {
  components: { ticketClaimDialog },
  name: "ticket-claim",
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
          prop: "targetUnitName",
          label: "目标单位",
          width: "150",
        },
        {
          prop: "date",
          label: "申领日期",
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
      dialogTableData: [],
      statusMap: ["待下单", "已下单", "已发货", "已退回", "已入库"],
      payStatusMap: ["待下单", "待付款", "已付款"],
      option: {
        title: {
          text: "申领订单状态",
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
            data: [],
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
      myChart: {},
    };
  },
  watch: {
    tableData(val) {
      this.option.series[0].data = [];
      let map = new Map();
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        if (map.get(element.status)) {
          map.set(element.status, map.get(element.status) + 1);
        } else {
          map.set(element.status, 1);
        }
      }
      for (let key of map.keys()) {
        let e = { value: parseInt(map.get(key)), name: key };
        this.option.series[0].data.push(e);
      }
      this.myChart.setOption(this.option);
    },
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
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            element.status = this.statusMap[element.status];
            element.payStatus = this.payStatusMap[element.payStatus];
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

            getDialogTableData({ ticketClaimId: this.dialogData.id }).then(
              (resp) => {
                if (resp && resp.body && resp.body.data) {
                  this.dialogTableData = resp.body.data;
                  this.dialogVisible = true;
                  this.dialogTitle = "票据申领";
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
      save({
        unitId: this.$store.getters.unitId,
        userId: this.$store.getters.id,
        status: 0,
        payStatus: 0,
      }).then((res) => {
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
