<!-- 票据申领管理 -->
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
     <!-- <div v-if="annulurPieData">
       <annulur-pie name='申领状态' :data='annulurPieData'/>
     </div> -->
     
     <ticketClaimDialog
       :dialogData='dialogData'
       :dialogTableData='dialogTableData'
       :visible='dialogVisible'
       :close='dialogClose'
       :title='dialogTitle'
     />
   </div>
</template>

<script>
import ticketClaimDialog from './ticket-claim-dialog.vue'
import { save,deleteById,commonQuery,getById } from '@/api/nontax/ticket-claim/ticket-claim-index'
import { commonQuery as getDialogTableData} from '@/api/nontax/ticket-claim/ticket-claim-ticket'
export default {
  components: {ticketClaimDialog},
  name: 'ticket-claim',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'orderNumber',
         label:'单号'
       },
       {
         prop:'targetUnitName',
         label:'目标单位'
       },
       {
         prop:'warehouseName',
         label:'收货仓库'
       },
       {
         prop:'date',
         label:'申领日期'
       },
       {
         prop:'status',
         label:'订单状态'
       },
       {
         prop:'payStatus',
         label:'结算状态'
       }
       
     ],
     tableLoading: false,
     dialogVisible: false,
     dialogTitle: '',
     dialogData: {},
     dialogTableData: [],
     statusMap:['待下单','已下单','已发货','已退回'],
     payStatusMap:['待下单','待付款','已付款'],
     annulurPieData:[]
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
     commonQuery({ unitId: this.$store.getters.unitId }).then((res) => {
       if (res && res.body && res.body.data) {
         this.tableData = res.body.data
         for (let index = 0; index < this.tableData.length; index++) {
           const element = this.tableData[index];
           element.status = this.statusMap[element.status]
           element.payStatus = this.payStatusMap[element.payStatus]
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
           
           getDialogTableData({ticketClaimId:this.dialogData.id}).then(resp=>{
             if (resp && resp.body && resp.body.data) {
               this.dialogTableData = resp.body.data
               this.dialogVisible = true
               this.dialogTitle = '票据申领'
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
     save({unitId:this.$store.getters.unitId,userId:this.$store.getters.id,status:0,payStatus:0}).then(res=>{
       if (res&&res.body&&res.body.data) {
         this.success()
         this.handleEdit(undefined,{id:res.body.data})
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
