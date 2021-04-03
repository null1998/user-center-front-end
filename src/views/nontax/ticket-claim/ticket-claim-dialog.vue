<!-- 票据申领对话框 -->
<template>
  <div>
    <el-dialog
      width="65%"
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
          v-if="data.status == 0"
          class="el-icon-circle-check"
          style="float: right"
          @click="handleSaveDialog"
          >保存</i
        >
      </div>
      <el-form ref="data" inline :rules="rule" :model="data">
        <el-form-item label="目标单位" prop="targetUnitId">
          <el-select v-model="data.targetUnitId" v-if="data.status == 0">
            <el-option
              v-for="item in superiorUnitList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <div v-else>{{data.targetUnitName}}</div>
        </el-form-item>
        <el-form-item label="收货仓库" prop="warehouseId">
          <el-select v-model="data.warehouseId" v-if="data.status == 0">
            <el-option
              v-for="item in warehouseList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <div v-else>{{data.warehouseName}}</div>
        </el-form-item>
      </el-form>
      <hyd-editable-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        :showButton="data.status == 0"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
    </el-dialog>
  </div>
</template>

<script>
import { update } from "@/api/nontax/ticket-claim/ticket-claim-index";
import {
  save as saveRow,
  deleteById,
  update as updateRow,
  commonQuery,
} from "@/api/nontax/ticket-claim/ticket-claim-ticket";
import { getSuperiorUnitList } from "@/api/basedata/unit";
import { commonQuery as commonQueryWarehouse } from "@/api/basedata/warehouse";
import { commonQuery as commonQueryTicket } from "@/api/basedata/ticket";
import { getDate } from "@/utils/date";
export default {
  name: "ticket-claim-ticket",
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
          placeholder: "请选择财政票据",
        },
        {
          prop: "number",
          label: "数量",
          type: "input",
        },
      ],
      tableLoading: false,
      rule: {
        targetUnitId: [
          { required: true, message: "请选择目标仓库", trigger: "change" },
        ],
        warehouseId: [
          { required: true, message: "请选择收货仓库", trigger: "change" },
        ],
      },
      superiorUnitList: [],
      warehouseList: [],
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
    this.getSuperiorUnit();
    this.getWarehouseList();
    this.getTableData();
    this.getTicketList();
  },
  methods: {
    getTicketList() {
      commonQueryTicket({ zoneId: this.$store.getters.provinceZoneId }).then(
        (res) => {
          if (res && res.body && res.body.data) {
            this.tableColumons[0].options = res.body.data;
          }
        }
      );
    },
    getSuperiorUnit() {
      getSuperiorUnitList(this.$store.getters.unitId).then((res) => {
        if (res && res.body && res.body.data) {
          this.superiorUnitList = res.body.data;
        }
      });
    },
    getWarehouseList() {
      commonQueryWarehouse({ unitId: this.$store.getters.unitId }).then(
        (res) => {
          if (res && res.body && res.body.data) {
            this.warehouseList = res.body.data;
          }
        }
      );
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({ ticketClaimId: this.data.id }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          this.tableLoading = false;
        }
      });
    },
    handleSaveDialog() {
      this.$refs["data"].validate((valid) => {
        if (valid) {
          this.data.date = getDate();
          this.data.status = 1;
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
        row.ticketClaimId = this.data.id;
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
      if (row && row.ticketId && row.number) {
        let s = /^[1-9]?[0-9]{0,9}$/;
        return s.test(row.number);
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
