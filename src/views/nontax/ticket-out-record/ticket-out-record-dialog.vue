<!-- 票据出库票据 -->
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
          <el-tooltip content="保存提交" placement="bottom" effect="light">
            <el-button
              type="success"
              icon="el-icon-document"
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
      <el-form ref="data" :model="data" :rules="rules" inline>
        <el-form-item label="目标单号" prop="targetOrderNumber">
          <el-select
            v-model="data.targetOrderNumber"
            placeholder="目标单号"
            filterable
            clearable
            size="mini"
            @change="change(data.targetOrderNumber)"
          >
            <el-option
              v-for="option in orderList"
              :label="option.orderNumber"
              :value="option.orderNumber"
              :key="option.orderNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标单位" prop="targetUnitName">
          <strong><u>{{ data.targetUnitName }}</u></strong>
        </el-form-item>
        <el-form-item label="出库方式" prop="outType">
          <strong><u>{{ data.outType }}</u></strong>
        </el-form-item>
      </el-form>
      <hyd-editable-table
        :height="350"
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
    </el-dialog>
  </div>
</template>

<script>
import { update } from "@/api/nontax/ticket-out-record/ticket-out-record-index";
import {
  save as saveRow,
  deleteById,
  update as updateRow,
  commonQuery,
} from "@/api/nontax/ticket-out-record/ticket-out-record-ticket";
import { listByZoneId as commonQueryTicket } from "@/api/basedata/ticket";
import { commonQuery as commonQueryTicketClaim } from "@/api/nontax/ticket-claim/ticket-claim-index";
import { getDate } from "@/utils/date";
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
          prop: "ticketId",
          label: "财政票据名称",
          type: "select",
          options: [],
          optionLabel: "name",
          optionValue: "id",
          width: "240",
        },
        {
          prop: "startNumber",
          label: "起始号",
          type: "input",
          width:"100"
        },
        {
          prop: "endNumber",
          label: "终止号",
          type: "input",
          width:"100"
        }
      ],
      tableLoading: false,
      rules: {
        targetOrderNumber: [
          { required: true, message: "请选择目标单位", trigger: "change" },
        ],
      },
      orderList: [],
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
  created() {
    this.getTicketList();
    this.getTicketClaimOrderList();
  },
  methods: {
    getTicketClaimOrderList() {
      commonQueryTicketClaim({ targetUnitId: this.$store.getters.unitId }).then(
        (res) => {
          if (res && res.body && res.body.data) {
            for (let index = 0; index < res.body.data.length; index++) {
              const element = res.body.data[index];
              let e = {};
              e.orderNumber = element.orderNumber;
              e.targetUnitId = element.unitId;
              e.targetUnitName = element.unitName;
              e.outType = "申领出库";
              this.orderList.push({ ...e });
            }
          }
        }
      );
    },
    getTicketList() {
      commonQueryTicket(this.$store.getters.provinceZoneId ).then(
        (res) => {
          if (res && res.body && res.body.data) {
            this.tableColumons[0].options = res.body.data;
          }
        }
      );
    },
    change(targetOrderNumber) {
      for (let i = 0; i < this.orderList.length; i++) {
        const element = this.orderList[i];
        if (targetOrderNumber === element.orderNumber) {
          this.data.targetUnitId = element.targetUnitId;
          this.data.targetUnitName = element.targetUnitName;
          this.data.outType = element.outType;
        }
      }
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({ ticketOutRecordId: this.data.id }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          this.tableLoading = false;
        }
      });
    },
    handleSaveDialog() {
      this.$refs["data"].validate((valid) => {
        if (valid) {
          this.data.outDate = new Date()
          update(this.data).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.close();
            }
          });
        }
      });
    },
    handleSave(index, row) {
      if (!this.dataValid(row)) {
        this.getTableData();
        return;
      }
      if (!row.id) {
        row.ticketOutRecordId = this.data.id;
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
            this.success();
            this.getTableData();
          }
        });
      }
    },
    dataValid(row) {
      if (row&&row.ticketId&&row.startNumber&&row.endNumber) {
        let s = /^[0-9]{10}$/
        if (s.test(row.startNumber)&&s.test(row.endNumber)&&row.startNumber<=row.endNumber) {
          return true
        }
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
