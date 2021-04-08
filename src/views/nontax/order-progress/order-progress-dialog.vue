<!--  -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      :before-close="close"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data">{{ title }}</i>
        <i class="el-icon-circle-close" style="float: right" @click="close"
          >退出</i
        >
        <i
          class="el-icon-circle-check"
          style="float: right"
          @click="handleSaveDialog"
          >保存</i
        >
      </div>
      <el-form :model="data" label-width="80px" inline>
        <el-form-item label="收货仓库">{{ data.warehouseName }}</el-form-item>
        <el-form-item label="收货日期">{{ data.end }}</el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="status" size="mini" placeholder="">
            <el-option
              v-for="option in statusList"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <hyd-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
      />
    </el-dialog>
  </div>
</template>

<script>
import { listByPrintingOrderId as commonQuery } from "@/api/nontax/printing-order/printing-order-ticket";
import { update } from "@/api/nontax/printing-order/printing-order-index";
import { getDate } from '@/utils/date';
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    dialogData: { type: Object, required: true },
    dialogTableData: { type: Array },
  },
  data() {
    return {
      data: {},
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "ticketName",
          label: "财政票据名称",
        },
        {
          prop: "price",
          label: "单价",
        },
        {
          prop: "number",
          label: "数量",
        },
      ],
      tableLoading: false,
      statusList: [
        {
          label: "已完工",
          value: "2",
        }
      ],
      status:""
    };
  },
  watch: {
    dialogData(val) {
      this.data = val;
    },
    dialogTableData(val) {
      this.tableData = val;
    },
  },
  created() {},
  methods: {
    getTableData() {
      commonQuery(this.data.id).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
        }
      });
    },
    handleSaveDialog() {
      this.data.status = this.status
      this.data.end = getDate()
      update(this.data).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.success()
          this.close()
        }
      })
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

