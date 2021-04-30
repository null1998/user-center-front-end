<!-- 票据入库记录 -->
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
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
              @handleCreate="handleCreate"
            />
          </el-row>
          </search-page>
        </el-card>
      </el-col>
      <el-col :span="7">
        <div id="main" :style="{ width: '400px', height: '350px' }"></div>
      </el-col>
    </el-row>

    <ticket-store-record-dialog
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
import ticketStoreRecordDialog from "./ticket-store-record-dialog.vue";
import {
  save,
  deleteById,
  commonQuery,
  getById,
  recent
} from "@/api/nontax/ticket-store-record/ticket-store-record-index";
import {
  commonQuery as getDialogTableData,
  numberPerMonth,
} from "@/api/nontax/ticket-store-record/ticket-store-record-ticket";
export default {
  components: { ticketStoreRecordDialog },
  name: "ticket-store-record",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "sourceOrderNumber",
          label: "来源单号",
          width: "200",
        },
        {
          prop: "sourceUnitName",
          label: "来源单位",
        },
        {
          prop: "storeType",
          label: "入库方式",
          
        },
        {
          prop: "storeDateShow",
          label: "入库日期",
        },
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "",
      dialogData: {},
      dialogTableData: [],
      option: {
        title: {
          text: '近一周入库记录'
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
          prop: "sourceUnitName",
          label: "来源单位",
          type: "input",
        },
        {
          prop: "storeType",
          label: "入库方式",
          type: "select",
          options: [
            {
              label: "印制入库",
              value: "印制入库",
            },
            {
              label: "申领入库",
              value: "申领入库",
            },
          ],
        },
      ],
      searchBaseModel: { unitId: this.$store.getters.unitId },
    };
  },
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
        if (element.storeDate) {
          element.storeDateShow = element.storeDate.year + '-' + element.storeDate.monthValue + '-' + (element.storeDate.dayOfMonth+1)
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
    handleEdit(index, row) {
      if (row && row.id) {
        commonQuery({ id: row.id }).then((res) => {
          if (res && res.body && res.body.data) {
            this.dialogData = res.body.data[0];
            getDialogTableData({
              ticketStoreRecordId: this.dialogData.id,
            }).then((resp) => {
              if (resp && resp.body && resp.body.data) {
                this.dialogTableData = resp.body.data;
                this.dialogVisible = true;
                this.dialogTitle = "票据入库";
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
      save({ unitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.handleEdit(undefined, { id: res.body.data });
          this.success();
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
