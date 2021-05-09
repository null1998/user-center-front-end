<!-- 票据出库记录 -->
<template>
  <div>
    <el-row>
      <el-col :span="17">
        <el-card class="box-card" style="width: 920px; height: 680px">
          <search-page
            ref="searchPage"
            :searchConfig="searchConfig"
            :searchBaseModel="searchBaseModel"
            :handleSearch="commonQuery"
            @showSearchData="showSearchData"
          >
          <el-row>
            <hyd-table
              :height="490"
              :tableKey="tableKey"
              :tableData="tableData"
              :tableColumns="tableColumons"
              :loading="tableLoading"
              @handleView="handleView"
            />
          </el-row>
          </search-page>
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
      searchConfig: [
        {
          prop: "targetUnitName",
          label: "目标单位",
          type: "input",
        },
        {
          prop: "outType",
          label: "出库方式",
          type: "select",
          options: [
            {
              label: "印制出库",
              value: "印制出库",
            },
            {
              label: "申领出库",
              value: "申领出库",
            }
          ],
        },
      ],
      searchBaseModel: { unitId: this.$store.getters.unitId },
    };
  },
  watch: {},
  activated() {
    //this.getTableData()
  },
  created() {
    
  },
  mounted() {
    this.getTableData();
    var chartDom = document.getElementById("main");
    this.myChart = echarts.init(chartDom);
  },
  methods: {
    showSearchData(data) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.outDate) {
          element.outDateShow = element.outDate.year + '-' + element.outDate.monthValue + '-' + (element.outDate.dayOfMonth)
        }
      }
      this.tableData = data;
    },
    commonQuery(searchModel) {
      return commonQuery(searchModel);
    },
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
      this.$refs['searchPage'].searchBtnClick()
      this.getLineChart()
      this.tableLoading = false;
    },
    handleView(index, row) {
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
