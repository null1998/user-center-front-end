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
      :data="dialogData"
      :tableData="dialogTableData"
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
    />
  </div>
</template>

<script>
import printingOrderDialog from "./printing-order-dialog.vue";
export default {
  components: { printingOrderDialog },
  name: "",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "orderNumber",
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
          prop: "printUnitId",
          label: "印刷单位",
        },
        {
          prop: "warehouseId",
          label: "仓库",
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
    };
  },
  methods: {
    handleEdit(index, row) {},
    handleDelete(index, row) {},
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "印制订单-新增";
    },
    dialogClose() {
      this.dialogVisible = false;
      this.dialogData = {};
      this.dialogTableData = [];
    },
  },
};
</script>
<style>
</style>
