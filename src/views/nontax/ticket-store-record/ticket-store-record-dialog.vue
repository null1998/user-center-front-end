<!--  -->
<template>
  <div>
    <el-dialog
      :visible.sync='visible'
      :show-close='false'
      :before-close='close'
    >
    <div slot='title' class='header-title'>
      <i class='el-icon-s-data'>{{
        title
      }}</i>
      <i class='el-icon-circle-close' style='float: right' @click='close'
        >退出</i>
      <i
        class='el-icon-circle-check'
        style='float: right'
        @click='handleSaveDialog'
        >保存</i
      >
    </div>
     <hyd-editable-table
       :tableKey='tableKey'
       :tableData='tableData'
       :tableColumns='tableColumons'
       :loading='tableLoading'
       @handleSave='handleSave'
       @handleDelete='handleDelete'
     />
    </el-dialog>
   </div>
</template>

<script>
import { update } from "@/api/nontax/ticket-store-record/ticket-store-record-index";
import { save as saveRow,deleteById,update as updateRow,commonQuery} from "@/api/nontax/ticket-store-record/ticket-store-record-ticket";
export default {
  name: 'ticket-store-record-dialog',
  props:{
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: '' },
    dialogData: { type: Object, required: true },
    dialogTableData: { type: Array },
  },
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'',
         label:''
       }
     ],
     tableLoading: false,
    }
  },
  watch:{
    dialogData(val) {
      this.data = val
    },
    dialogTableData(val) {
      this.tableData = val
    },
  },
  created(){
    
  },
  methods:{
   getTableData(){
     this.tableLoading=true
     commonQuery({ticketStoreRecordId:this.data.id}).then((res) => {
       if (res && res.body && res.body.data) {
         this.tableData = res.body.data
         this.tableLoading=false
       }
     })
   },
   handleSaveDialog() {
     update(this.data).then(res=>{
       if (res&&res.body&&res.body.data) {
         this.success()
         this.close()
       }
     })
   },
   handleSave(index,row) {
     if(!this.dataValid(row)) {
       this.getTableData()
       return
     }
     if (!row.id) {
       row.ticketStoreRecordId = this.data.id
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
