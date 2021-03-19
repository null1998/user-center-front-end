<!-- 印制订单 -->
<template>
  <div>
    <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleCreate="handleCreate"
    >
    </hyd-table>
    <printing-order-dialog
      :dialogData="dialogData"
      :dialogTableData="dialogTableData"
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
      :clearValidate="dialogClearValidate"
    />
  </div>
</template>

<script>
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
  name: "",
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
      dialogClearValidate:false,
      statusMap: ["待付款", "已付款"],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      commonQuery({ unitId: this.$store.getters.unitId }).then((res) => {
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
    handleView(index, row) {
      this.dialogVisible = true;
      this.dialogTitle = "印制订单-查看";
    },
    handleEdit(index, row) {
      this.dialogClearValidate = false;
      if (row && row.id) {
        getById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.dialogData = res.body.data
            listByPrintingOrderId(this.dialogData.id).then(resp=>{
              if (resp&&resp.body&&resp.body.data) {
                this.dialogTableData = resp.body.data
                this.dialogVisible = true;
                this.dialogTitle = "印制订单-编辑";
              }
            })
            
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
        person: this.$store.getters.nickname,
      }
      save(this.dialogData).then((res) => {
        if (res && res.body && res.body.data) {
          this.success();
          this.dialogData.id = res.body.data;
          this.dialogVisible = true;
          this.dialogTitle = "印制订单-新增";
        }
      });
    },
    dialogClose() {
      this.getTableData();
      this.dialogClearValidate = true
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
