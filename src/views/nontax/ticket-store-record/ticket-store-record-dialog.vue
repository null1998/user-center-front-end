<!-- 票据入库记录对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      :before-close="close"
      width="80%"
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
      <el-form ref="data" v-model="data" :rules="rules" inline>
        <el-form-item label="来源单号" prop="sourceOrderNumber">
          <el-select
            v-model="data.sourceOrderNumber"
            placeholder="来源单号"
            filterable
            clearable
            size="mini"
            @change="change(data.sourceOrderNumber)"
          >
            <el-option
              v-for="option in orderList"
              :label="option.orderNumber"
              :value="option.orderNumber"
              :key="option.orderNumber"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源单位" prop="sourceUnitId">
          <div>{{data.sourceUnitName}}</div>
        </el-form-item>
        <el-form-item label="来源仓库" prop="sourceWarehouseId">
          <div>{{data.sourceWarehouseName}}</div>
        </el-form-item>
        <el-form-item label="入库方式" prop="dictionaryId">
          <div>{{data.theWay}}</div>
        </el-form-item>
      </el-form>
      <hyd-editable-table
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
import { update } from "@/api/nontax/ticket-store-record/ticket-store-record-index";
import {
  save as saveRow,
  deleteById,
  update as updateRow,
  commonQuery,
} from "@/api/nontax/ticket-store-record/ticket-store-record-ticket";
import { commonQuery as 
commonQueryUnit} from "@/api/basedata/unit";
import { commonQuery as commonQueryWarehouse } from "@/api/basedata/warehouse";
import { commonQuery as commonQueryPrintOrder } from "@/api/nontax/printing-order/printing-order-index";
import { listByCategoryName } from "@/api/basedata/dictionary";
import { commonQuery as commonQueryTicket } from "@/api/basedata/ticket";
import { getDate } from "@/utils/date";
export default {
  name: "ticket-store-record-dialog",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    dialogData: { type: Object, required: true },
    dialogTableData: { type: Array },
  },
  data() {
    return {
      data:{},
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "ticketId",
          label: "财政票据名称",
          type:"select",
          options:[],
          optionLabel:"name",
          optionValue:"id"
        },
        {
          prop: "startNumber",
          label: "起始号",
          type:"input"
        },
        {
          prop: "endNumber",
          label: "终止号",
          type:"input"
        },
        {
          prop: "number",
          label: "数量",
          type:"show"
        },
      ],
      tableLoading: false,
      unitList:[],
      warehouseList:[],
      orderList:[],
      dictionaryList:[],
      rules:{}
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
    this.getTheWayList()
    this.getPrintOrderList()
    this.getTicketList()
  },
  methods: {
    change(orderNumber){
      for (let i = 0; i < this.orderList.length; i++) {
        const element = this.orderList[i];
        if (orderNumber===element.orderNumber) {
          this.data.sourceUnitId = element.sourceUnitId
          this.data.sourceUnitName = element.sourceUnitName
          this.data.theWay = element.theWay
          this.data.dictionaryId = element.dictionaryId
        }
      }
    },
    getPrintOrderList() {
      commonQueryPrintOrder({unitId:this.$store.getters.unitId}).then(res=>{
        if (res&&res.body&&res.body.data) {
          for (let i = 0; i < res.body.data.length; i++) {
            const element = res.body.data[i];
            let e = {}
            e.orderNumber = element.orderNumber
            e.sourceUnitId = element.printUnitId
            e.sourceUnitName = element.printUnitName
            e.theWay = '印制入库'
            e.dictionaryId = '1374388453206261760'
            this.orderList.push({...e})
          }
        }
      })
    },
    getTheWayList() {
      listByCategoryName({categoryName:"票据入库方式分类"}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.dictionaryList = res.body.data
        }
      })
    },
    getTicketList() {
      commonQueryTicket({zoneId:this.$store.getters.provinceZoneId}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[0].options = res.body.data
        }
      })
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({ ticketStoreRecordId: this.data.id }).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          this.tableLoading = false;
        }
      });
    },
    handleSaveDialog() {
      this.data.unitId = this.$store.getters.unitId
      this.data.storeDate = getDate()
      update(this.data).then((res) => {
        if (res && res.body && res.body.data) {
          this.success();
          this.close();
        }
      });
    },
    handleSave(index, row) {
      if (!this.dataValid(row)) {
        this.getTableData();
        return;
      }
      if (!row.id) {
        row.ticketStoreRecordId = this.data.id;
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
