<!-- 结算管理 -->
<template>
  <div>
     <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleEdit"
    />
     <payment-dialog
       :dialogData='dialogData'
       :visible='dialogVisible'
       :close='dialogClose'
       :title='dialogTitle'
     />
   </div>
</template>

<script>
import paymentDialog from './payment-dialog'
import { commonQuery,getById } from '@/api/nontax/payment/payment'
export default {
  components: {paymentDialog},
  name: 'payment',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'orderNumber',
         label: '结算单号'
       },
       {
         prop:'status',
         label:'结算状态'
       },   
       {
         prop:'orderType',
         label:'业务类型'
       }, 
       {
         prop:'sourceOrderNumber',
         label:'业务单号'
       },
       {
         prop:'srcUnitName',
         label:'付款单位'
       },
       {
         prop:'desUnitName',
         label:'收款单位'
       },    
       {
         prop:'date',
         label:'下单日期'
       },
       {
         prop:'totalPrice',
         label:'金额'
       },
       {
         prop:'payDate',
         label:'结算日期'
       },
       {
         prop:'payType',
         label:'支付方式'
       },
       
     ],
     tableLoading: false,
     dialogVisible: false,
     dialogTitle: '',
     dialogData: {},
     dialogTableData: [],
     statusMap:['待付款','已付款']
    }
  },
  watch:{

  },
  activated() {
    this.getTableData()
  },
  created(){
    this.getTableData()
  },
  methods:{
    getTableData(){
      this.tableLoading=true
      commonQuery({srcUnitId:this.$store.getters.unitId}).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data
          for (let index = 0; index < this.tableData.length; index++) {
            const element = this.tableData[index];
            element['status'] = this.statusMap[element['status']]
          }
          this.tableLoading=false
        }
      })
    },
    handleEdit(index,row) {
      if(row&&row.id){
        getById(row.id).then((res)=>{
          if(res&&res.body&&res.body.data){
            this.dialogData = res.body.data
            this.dialogVisible = true
            this.dialogTitle = '支付结算'
          }
        })
      }

    },
    dialogClose() {
      this.getTableData()
      this.dialogVisible = false
      this.dialogData = {}
    },
    success() {
      this.$notify({
      title: 'success',
      message: '操作成功',
      type: 'success',
      duration: 2000,
      })
    },
    error() {
      this.$notify({
      title: 'error',
      message: '操作失败',
      type: 'error',
      duration: 2000,
      })
    },
  }
}

</script>
<style>
</style>
