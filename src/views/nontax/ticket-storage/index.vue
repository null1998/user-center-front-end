<!-- 票据库存 -->
<template>
  <div>
    <hyd-editable-table
       :tableKey='tableKey'
       :tableData='tableData'
       :tableColumns='tableColumons'
       :loading='tableLoading'
       @handleSave='handleSave'
       @handleDelete='handleDelete'
     />
   </div>
</template>

<script>
import { save as saveRow,deleteById,update as updateRow,commonQuery} from '@/api/nontax/ticket-storage/ticket-storage-index'
export default {
  name: 'ticket-storage',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'warehouseId',
         label:'仓库名',
         type:'select',
         options:[],
         optionLabel:"name",
         optionValue:"id"
       },
       {
         prop:'ticketId',
         label:'财政票据名称',
         type:'select',
         options:[],
         optionLabel:"name",
         optionValue:"id"
       },
       {
         prop:'startNumber',
         label:'起始号',
         type:'input'
       },
       {
         prop:'endNumber',
         label:'终止号',
         type:'input'
       },
       {
         prop:'userName',
         label:'操作人员',
         type:'show'
       },
       {
         prop:'operateDate',
         label:'操作日期',
         type:'show'
       },
     ],
     tableLoading: false,
    }
  },
  created(){
    
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
   handleSave(index,row) {
     if(!this.dataValid(row)) {
       this.getTableData()
       return
     }
     if (!row.id) {
     //row.xxId = this.data.id
       saveRow(row).then((res) => {
         if (res && res.body && res.body.data) {
           this.success();
           this.getTableData()
         }
       })
     }else{
       updateRow(row).then((res) => {
         if (res && res.body && res.body.data) {
           this.success();
           this.getTableData()
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
   dataValid(row) {
     return false
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
