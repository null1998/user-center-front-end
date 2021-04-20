<!-- 票据库存 -->
<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-card class="box-card" style="width: 980px; height: 680px">
          <el-button
            type="danger"
            size="mini"
            @click="handleDeleteAll()"
            icon="el-icon-delete"
          />
          <el-row>
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
  save as saveRow,
  deleteById,
  update as updateRow,
  commonQuery,
  deleteAll,
  sum,
} from "@/api/nontax/ticket-storage/ticket-storage-index";
import { getDate } from "@/utils/date";
import { commonQuery as commonQueryWarehouse } from "@/api/basedata/warehouse";
import { commonQuery as commonQueryTicket } from "@/api/basedata/ticket";
export default {
  name: "ticket-storage",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "warehouseName",
          label: "仓库名",

          width: "160",
        },
        {
          prop: "ticketName",
          label: "财政票据名称",

          width: "230",
        },
        {
          prop: "startNumber",
          label: "起始号",
          type: "input",
        },
        {
          prop: "endNumber",
          label: "终止号",
          type: "input",
        },
        {
          prop: "operateDateShow",
          label: "操作日期",
          type: "show",
        },
      ],
      tableLoading: false,
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
            name: "票据种类",
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
      selectList: [],
      deleteAllBtnLoading: false,
    };
  },
  activated() {
    //this.getTableData()
  },
  created() {
    this.getTableData();
    this.getWarehouseList();
    this.getTicketList();
  },
  mounted() {
    var chartDom = document.getElementById("main");
    this.myChart = echarts.init(chartDom);
  },
  methods: {
    getSum() {
      sum(this.$store.getters.unitId).then((res) => {
        if (res && res.body && res.body.data) {
          this.option.series[0].data = [];
          for (let index = 0; index < res.body.data.length; index++) {
            const element = res.body.data[index];
            let e = {
              value: parseInt(element.number),
              name: element.ticketName,
            };
            this.option.series[0].data.push(e);
          }
          this.myChart.setOption(this.option);
        }
      });
    },
    getWarehouseList() {
      commonQueryWarehouse({ unitId: this.$store.getters.unitId }).then(
        (res) => {
          if (res && res.body && res.body.data) {
            this.tableColumons[0].options = res.body.data;
          }
        }
      );
    },
    getTicketList() {
      commonQueryTicket({ zoneId: this.$store.getters.provinceZoneId }).then(
        (res) => {
          if (res && res.body && res.body.data) {
            this.tableColumons[1].options = res.body.data;
          }
        }
      );
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({ unitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            if (element.operateDate) {
              element.operateDateShow =
                element.operateDate.year +
                "-" +
                element.operateDate.monthValue +
                "-" +
                element.operateDate.dayOfMonth;
            }
          }
          this.getSum()
          this.tableLoading = false;
        }
      });
    },
    handleSave(index, row) {
      if (!this.dataValid(row)) {
        this.getTableData();
        return;
      }
      row.unitId = this.$store.getters.unitId;
      row.userId = this.$store.getters.id;
      row.operateDate = new Date();
      if (!row.id) {
        saveRow(row).then((res) => {
          if (res && res.body && res.body.data) {
            this.success();
            this.getTableData();
          }
        });
      } else {
        updateRow(row).then((res) => {
          if (res && res.body && res.body.data) {
            this.success();
            this.getTableData();
          }
        });
      }
    },
    handleDelete(index, row) {
      if (row && row.id) {
        deleteById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.ngrData = [];
            this.success();
            this.getTableData();
          }
        });
      }
    },
    handleSelect(val) {
      this.selectList = val;
    },
    handleDeleteAll() {
      this.deleteAllBtnLoading = true;
      let dtoList = [];
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index];
        dtoList.push(element.id);
      }
      deleteAll(dtoList)
        .then((res) => {
          this.deleteAllBtnLoading = false;
          this.success();
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
          this.deleteAllBtnLoading = false;
        });
    },
    dataValid(row) {
      if (
        row &&
        row.ticketId &&
        row.warehouseId &&
        row.startNumber &&
        row.endNumber
      ) {
        let s = /^[0-9]{10}$/;
        return (
          s.test(row.startNumber) &&
          s.test(row.endNumber) &&
          row.startNumber <= row.endNumber
        );
      }
      return false;
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
