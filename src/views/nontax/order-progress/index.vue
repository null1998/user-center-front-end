<!-- 印刷厂订单进度 -->
<template>
  <div>
    <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleEdit"
    />
    <order-progress-dialog
       :dialogData='dialogData'
       :dialogTableData='dialogTableData'
       :visible='dialogVisible'
       :close='dialogClose'
       :title='dialogTitle'
     />
  </div>
</template>

<script>
import orderProgressDialog from './order-progress-dialog.vue'
import {
  commonQuery,
  getById,
} from "@/api/nontax/printing-order/printing-order-index";
import { listByPrintingOrderId as getDialogTableData } from "@/api/nontax/printing-order/printing-order-ticket";
export default {
  components:{orderProgressDialog},
  name: "order-progress",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "ordernumber",
          label: "单号",
        },
        {
          prop: "warehouseName",
          label: "收货仓库",
        },
        {
          prop: "start",
          label: "通知日期",
          sortable: true,
        },
        {
          prop: "end",
          label: "交货日期",
        },
        {
          prop: "status",
          label: "订单状态",
        },
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "",
      dialogData: {},
      dialogTableData: [],
      statusMap: [
        "待下单",
        "已下单",
        "已付款",
        "已完工",
        "已发货",
        "已入库",
      ],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.tableLoading = true
      commonQuery({ printUnitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i]["status"] = this.statusMap[
              this.tableData[i]["status"]
            ];
          }
          this.tableLoading = false
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
                this.dialogTitle = "订单进度-查看";
              }
            });
          }
        });
      }
    },
    dialogClose() {
     this.getTableData()
     this.dialogVisible = false
     this.dialogData = {}
     this.dialogTableData = []
   },
   success() {
     this.$notify({
     title: 'success',
     message: '操作成功',
     type: 'success',
     duration: 2000,
     })
    },
   error() {
     this.$notify({
     title: 'error',
     message: '操作失败',
     type: 'error',
     duration: 2000,
     })
    },
  },
};
</script>
<style>
</style>
