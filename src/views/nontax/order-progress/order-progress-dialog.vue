<!--  -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      :before-close="close"
    >
      <div slot="title" class="header-title">
        <strong>{{ title }}</strong>
        <div style="float: right">
          <el-tooltip content="分配票号" placement="bottom" effect="light">
            <el-button
              :disabled="this.data.status != 1"
              type="primary"
              icon="el-icon-document"
              size="mini"
              @click="generate()"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="完工登记" placement="bottom" effect="light">
            <el-button
              :disabled="this.data.status != 1"
              type="info"
              icon="el-icon-edit"
              size="mini"
              @click="handleSaveDialog"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="返回主页" placement="bottom" effect="light">
            <el-button
              type="danger"
              icon="el-icon-right"
              size="mini"
              @click="close"
            ></el-button>
          </el-tooltip>
        </div>
      </div>

      <hyd-table
        :height="350"
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleSelectionChange="handleSelect"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  listByPrintingOrderId as commonQuery,
  update as updatePrintOrderTicket,
} from "@/api/nontax/printing-order/printing-order-ticket";
import { update } from "@/api/nontax/printing-order/printing-order-index";
import { getDate } from "@/utils/date";
import {
  save as saveProductRecord,
  getById as getProductRecord,
} from "@/api/nontax/ticket-product-record/ticket-product-record-index";
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
          width: "260",
        },
        {
          prop: "price",
          label: "单价",
          width: "50",
        },
        {
          prop: "number",
          label: "数量",
        },
        {
          prop: "startNumber",
          label: "起始号",
        },
        {
          prop: "endNumber",
          label: "终止号",
        },
      ],
      tableLoading: false,
      array: [],
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
    /**
     * 不要这样在前端循环和异步，下次直接把列表传到后端
     */
    async generate() {
      if (this.array.length == 0) {
        this.$message.info("请勾选票据")
      }
      for (let index = 0; index < this.array.length; index++) {
        const row = { ...this.array[index] };
        if (!row.startNumber&&!row.endNumber) {
          let dto = {
          printUnitId: this.$store.getters.unitId,
          ticketId: row.ticketId,
          number: row.number,
          printOrderNumber: this.data.orderNumber,
          createdDate: new Date(),
        };
        await this.helper(dto, row);
        }
      }

      //this.success()
    },
    handleSelect(rows) {
      this.array = rows;
    },
    async helper(dto, row) {
      saveProductRecord(dto).then((res) => {
        // 票号分配
        if (res && res.body && res.body.data) {
          getProductRecord(res.body.data).then((resp) => {
            // 得到生成的票号
            if (resp && resp.body && resp.body.data) {
              row.startNumber = resp.body.data.startNumber;
              row.endNumber = resp.body.data.endNumber;
              console.log(row);
              // 给印制订单附上票号
              updatePrintOrderTicket({ ...row }).then(() => {
                this.getTableData();
              });
            }
          });
        }
      });
    },
    getTableData() {
      commonQuery(this.data.id).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
        }
      });
    },
    handleSaveDialog() {
      for (let index = 0; index < this.tableData.length; index++) {
        const row = this.tableData[index];
        if (!row.startNumber || !row.endNumber) {
          this.$message.info("存在待分配票号的票据，无法进行完工登记")
          return
        }
      }
      this.data.status = 2;
      this.data.end = new Date();
      this.data.start = undefined
      update(this.data).then((res) => {
        if (res && res.body && res.body.data) {
          this.success();
          this.close();
        }
      });
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

