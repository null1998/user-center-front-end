<!-- 结算管理 -->
<template>
  <div>
     <hyd-table
       :tableKey='tableKey'
       :tableData='tableData'
       :tableColumns='tableColumons'
       :loading='tableLoading'
       @handleView='handleView'
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
         prop:'payType',
         label:'支付方式'
       },
       {
         prop:'orderNumber',
         label:'支付单号'
       },
       {
         prop:'sourceOrderNumber',
         label:'业务单号'
       },
       {
         prop:'srcUnitId',
         label:'付款单位'
       },
       {
         prop:'desUnitId',
         label:'收款单位'
       },
       {
         prop:'orderType',
         label:'业务类型'
       },
       {
         prop:'totalPrice',
         label:'金额'
       },
       {
         prop:'date',
         label:'下单日期'
       },
       {
         prop:'payDate',
         label:'结算日期'
       },
       {
         prop:'status',
         label:'结算状态'
       },
     ],
     tableLoading: false,
     dialogVisible: false,
     dialogTitle: '',
     dialogData: {},
     dialogTableData: [],
    }
  },
  watch:{

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
          this.tableLoading=false
        }
      })
    },
    handleView(index,row) {
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
