<!-- 印刷厂订单进度 -->
<template>
  <div>
    <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      :handleEdit="handleEdit"
    />
  </div>
</template>

<script>
import {
  commonQuery,
  getById,
} from "@/api/nontax/printing-order/printing-order-index";
export default {
  name: '',
  data () {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "ordernumber",
          label: "单号",
        },
        {
          prop:"warehouseName",
          label:"收货仓库"
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
      statusMap: ["待付款", "已付款","部分完工","全部完工","已发货","已入库"],
    }
  },
  created() {
    this.getTableData();
  },
  methods:{
    getTableData() {
      commonQuery({ printUnitId: this.$store.getters.unitId }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i]["status"] = this.statusMap[
              this.tableData[i]["status"]
            ];
          }
        }
      });
    },
    handleEdit(index,view) {

    }
  }
}

</script>
<style>
</style>
