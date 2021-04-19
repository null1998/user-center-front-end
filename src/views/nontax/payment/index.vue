<!-- 结算管理 -->
<template>
  <div>
      <el-button type="danger" size="mini" @click="handleDeleteAll()" icon="el-icon-delete"/>
     <hyd-table
     :height="580"
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleEdit"
      @handleSelectionChange="handleSelect"
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
import { commonQuery,getById,deleteAll } from '@/api/nontax/payment/payment'
export default {
  components: {paymentDialog},
  name: 'payment',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'status',
         label:'结算状态',
         width: "100",
       },   
       {
         prop:'orderType',
         label:'业务类型',
         width: "100",
       }, 
       {
         prop:'sourceOrderNumber',
         label:'业务单号',
         width: "200",
       },
       {
         prop:'desUnitName',
         label:'收款单位',
         width: "150",
       },    
       {
         prop:'date',
         label:'下单日期',
         width: "150",
       },
       {
         prop:'totalPrice',
         label:'金额'
       },
       {
         prop:'payDate',
         label:'结算日期',
         width: "150",
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
     statusMap:['待付款','已付款'],
     deleteAllBtnLoading: false,
     selectList:[]
    }
  },
  watch:{

  },
  activated() {
    //this.getTableData()
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
    handleSelect(val){
      this.selectList = val;
    },
    handleDeleteAll(){
      this.deleteAllBtnLoading = true
      let dtoList = []
      for (let index = 0; index < this.selectList.length; index++) {
        const element = this.selectList[index];
        dtoList.push(element.id)
      }
      deleteAll(dtoList).then(res=>{
        this.deleteAllBtnLoading = false;
        this.success()
        this.getTableData()
      }).catch((err)=>{
        console.log(err)
        this.deleteAllBtnLoading = false;
      })
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
