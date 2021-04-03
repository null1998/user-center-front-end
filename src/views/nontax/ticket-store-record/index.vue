<!-- 票据入库记录 -->
<template>
  <div>
     <hyd-table
       :tableKey='tableKey'
       :tableData='tableData'
       :tableColumns='tableColumons'
       :loading='tableLoading'
       @handleEdit='handleEdit'
       @handleDelete='handleDelete'
       @handleCreate='handleCreate'
     />
     <link-age :data="linkAgeData" :show="linkAgeData.length > 0" />
     <ticket-store-record-dialog
       :dialogData='dialogData'
       :dialogTableData='dialogTableData'
       :visible='dialogVisible'
       :close='dialogClose'
       :title='dialogTitle'
     />
   </div>
</template>

<script>
import ticketStoreRecordDialog from './ticket-store-record-dialog.vue'
import { save,deleteById,commonQuery,getById } from "@/api/nontax/ticket-store-record/ticket-store-record-index";
import { commonQuery as getDialogTableData,numberPerMonth} from "@/api/nontax/ticket-store-record/ticket-store-record-ticket";
export default {
  components: { ticketStoreRecordDialog },
  name: 'ticket-store-record',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'orderNumber',
         label:'入库单号'
       },
       {
         prop:'sourceOrderNumber',
         label:'来源单号'
       },
       {
         prop:'sourceUnitName',
         label:'来源单位'
       },
       {
         prop:'sourceWarehouseName',
         label:'来源仓库'
       },
       {
         prop:'theWay',
         label:'入库方式'
       },
       {
         prop:'storeDate',
         label:'入库日期'
       }
     ],
     tableLoading: false,
     dialogVisible: false,
     dialogTitle: '',
     dialogData: {},
     dialogTableData: [],
     linkAgeData:[]
    }
  },
  created(){
    this.getTableData()
    
  },
  methods:{
    getNumberPerMonth() {
      numberPerMonth(this.$store.getters.unitId).then(res=>{
        if (res && res.body && res.body.data) {
          let tmp = []
          let month = new Date().getMonth() + 1;
          let product = ['product']
          for (let index = 1; index <= month; index++) {
            product.push(index+'')
          }
          tmp.push(product)
          for (let index = 0; index < res.body.data.length; index++) {
            const record = res.body.data[index];
            let item = [record.ticketName]
            for (let i = 1; i <= month; i++) {
              item.push(!record.number[i]?0:parseInt(record.number[i])) 
            }
            tmp.push(item)
          }
          this.linkAgeData = []
          this.linkAgeData = tmp
        }
      })
    },
   getTableData(){
     this.tableLoading=true
     commonQuery({unitId:this.$store.getters.unitId}).then((res) => {
       this.linkAgeData.push({})
       if (res && res.body && res.body.data) {
         this.tableData = res.body.data
         this.tableLoading=false
         this.getNumberPerMonth()
       }
     })
   },
   handleEdit(index,row) {
     
     if(row&&row.id){
       commonQuery({id:row.id}).then((res)=>{
         if(res&&res.body&&res.body.data){
           this.dialogData = res.body.data[0]
           getDialogTableData({ticketStoreRecordId:this.dialogData.id}).then(resp=>{
             if (resp && resp.body && resp.body.data) {
               this.dialogTableData = resp.body.data
               this.dialogVisible = true
               this.dialogTitle = '票据入库编辑'
             }
           })
         }
       })
     }

   },
   handleDelete(index,row){
     if (row && row.id) {
       deleteById(row.id).then((res) => {
         if (res && res.body && res.body.data) {
           this.success()
           this.getTableData()
         }
       })
     }
   },
   handleCreate(){
     save({unitId:this.$store.getters.unitId}).then(res=>{
       if (res&&res.body&&res.body.data) {
         this.handleEdit(undefined,{id:res.body.data})
         this.success()
       }
     })
   },
   dialogClose() {
     this.getTableData()
     this.dialogVisible = false
     this.dialogData = {}
     this.dialogTableData = []
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
