<!-- 票号分配 -->
<template>
  <div>
    <el-button type="danger" size="mini" @click="deleteAll()" :disabled="deleteButtonDisable" >批量删除</el-button>
    <hyd-editable-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleSave="handleSave"
      @handleDelete="handleDelete"
      @handleSelectionChange="handleSelect"
    />
  </div>
</template>

<script>
import {
  commonQuery,
  update,
  deleteById,
  save,
} from "@/api/nontax/ticket-product-record/ticket-product-record-index";
import { commonQuery as commonQueryTicket } from "@/api/basedata/ticket";
import { commonQuery as commonQueryPrintOrder } from "@/api/nontax/printing-order/printing-order-index";
export default {
  name: "ticket-product-record",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "printOrderNumber",
          label: "印制订单号",
          type: "select",
          options:[],
          optionLabel:"orderNumber",
          optionValue:"orderNumber"
        },
        {
          prop: "ticketId",
          label: "财政票据名称",
          type: "select",
          options:[],
          optionLabel: "name",
          optionValue: "id",
        },
        {
          prop:"number",
          label: "数量",
          type:"input"
        },
        {
          prop: "startNumber",
          label: "起始号",
          type: "show",
        },
        {
          prop: "endNumber",
          label: "终止号",
          type: "show",
        },
        
      ],
      tableLoading: false,
      array:[],
      deleteButtonDisable:false
    };
  },
  watch: {},
  activated() {
    //this.getTableData()
  },
  created() {
    this.listAllTicket()
    this.listPrintOrder()
    this.getTableData();
  },
  methods: {
    /**
     * 简单使用下，不应该这样批量删除
     */
    async deleteAll(){
      this.deleteButtonDisable = true
      for (let index = 0; index < this.array.length; index++) {
        const row = this.array[index];
        if (row.id) {
          await this.helper(row)
        }
      }
      this.getTableData()
      this.success()
      this.deleteButtonDisable = false
    },
    async helper(row){
      await deleteById(row.id)
    },
    handleSelect(rows){
      this.array = rows
    },
    /**
     * 查询所有票据
     */
    listAllTicket() {
      commonQueryTicket({}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[1].options = res.body.data
        }
      })
    },
    /**
     * 查询该印刷厂的所有未完工印刷订单
     */
    listPrintOrder() {
      commonQueryPrintOrder({printUnitId:this.$store.getters.unitId,status:1}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[0].options = res.body.data
        }
      })
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({printUnitId:this.$store.getters.unitId}).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data;
          this.tableLoading = false;
        }
      });
    },
    handleSave(index, row) {
      if (this.dataValid(row)) {
        row.printUnitId = this.$store.getters.unitId
        if (row.id) {
          update(row).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.getTableData();
            }
          });
        } else {

          save(row).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.getTableData();
            }
          });
        }
      } else {
        this.getTableData();
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
    dataValid(row) {
      if(row&&row.printOrderNumber&&row.ticketId&&row.number) {
        return /^[1-9][0-9]*$/.test(row.number)
      }
      return false
    }
  },
};
</script>
<style>
</style>
