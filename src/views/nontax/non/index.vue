<!--  -->
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
     <dialog
       :dialogData='dialogData'
       :dialogTableData='dialogTableData'
       :visible='dialogVisible'
       :close='dialogClose'
       :title='dialogTitle'
     />
   </div>
</template>

<script>
import Dialog from ''
import { save,deleteById,commonQuery,getById } from ''
import { commonQuery as getDialogTableData} from ''
export default {
  components: {},
  name: '',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'',
         label:''
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
     commonQuery({}).then((res) => {
       if (res && res.body && res.body.data) {
         this.tableData = res.body.data
         this.tableLoading=false
       }
     })
   },
   handleEdit(index,row) {
     if(row&&row.id){
       getById(row.id).then((res)=>{
         if(res&&res.body&&res.body.data){
           this.dialogData = res.body.data
           getDialogTableData(this.dialogData.id).then(resp=>{
             if (resp && resp.body && resp.body.data) {
               this.dialogTableData = resp.body.data
               this.dialogVisible = true
               this.dialogTitle = ''
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
     save({unitId:this.store.getters.unitId}).then(res=>{
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
     this.notify({
     title: 'success',
     message: '操作成功',
     type: 'success',
     duration: 2000,
     })
    },
   error() {
     this.notify({
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
