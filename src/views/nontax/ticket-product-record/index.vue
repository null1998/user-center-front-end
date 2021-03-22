<!-- 票据生产记录 -->
<template>
  <div>
    <hyd-editable-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleSave="handleSave"
      @handleDelete="handleDelete"
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
          prop: "orderNumber",
          label: "生产单号",
          type: "show",
        },
        {
          prop: "printOrderNumber",
          label: "印制订单号",
          type: "select",
          options:[],
          optionLabel:"ordernumber",
          optionValue:"ordernumber"
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
        {
          prop: "createdDate",
          label: "生产日期",
          type: "show",
        },
      ],
      tableLoading: false,
    };
  },
  watch: {},
  created() {
    this.listAllTicket()
    this.listPrintOrder()
    this.getTableData();
  },
  methods: {
    /**
     * 查询所有票据
     */
    listAllTicket() {
      commonQueryTicket({}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[2].options = res.body.data
        }
      })
    },
    /**
     * 查询该印刷厂的所有印刷订单
     */
    listPrintOrder() {
      commonQueryPrintOrder({printUnitId:this.$store.getters.unitId}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[1].options = res.body.data
        }
      })
    },
    getTableData() {
      this.tableLoading = true;
      commonQuery({}).then((res) => {
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
