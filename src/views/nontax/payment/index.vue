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
      @handlePay="handlePay"
      @handleSelectionChange="handleSelect"
    />
     
   </div>
</template>

<script>
import { commonQuery,getById,deleteAll,update } from '@/api/nontax/payment/payment'
export default {
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
         width: "250",
       },
       {
         prop:'desUnitName',
         label:'收款单位',
         width: "200",
       },  
         
       {
         prop:'orderDateShow',
         label:'下单日期',
         width: "170",
       },
       
       {
         prop:'payDateShow',
         label:'结算日期',
         width: "170",
       },
       {
         prop:'totalPrice',
         label:'金额'
       },
     ],
     tableLoading: false,
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
            if (element.orderDate) {
            element.orderDateShow = element.orderDate.year + '-' + element.orderDate.monthValue + '-' + (element.orderDate.dayOfMonth)

            }
            if (element.payDate) {
            element.payDateShow = element.payDate.year + '-' + element.payDate.monthValue + '-' + (element.payDate.dayOfMonth
            )
            }
          }
          this.tableLoading=false
        }
      })
    },
    handlePay(index,row) {
      if(row&&row.id&&row.status == '待付款'){
        row.status = 1
        row.payDate = new Date()
        row.orderDate = undefined
        row.orderDateShow = undefined
        update(row).then(res=>{
          this.success()
          this.getTableData()
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
