<!-- 票据出库记录 -->
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
     <ticket-out-record-dialog
       :dialogData='dialogData'
       :dialogTableData='dialogTableData'
       :visible='dialogVisible'
       :close='dialogClose'
       :title='dialogTitle'
     />
   </div>
</template>

<script>
import ticketOutRecordDialog from './ticket-out-record-dialog'
import { save,deleteById,commonQuery,getById } from '@/api/nontax/ticket-out-record/ticket-out-record-index'
import { commonQuery as getDialogTableData} from '@/api/nontax/ticket-out-record/ticket-out-record-ticket'
export default {
  components: {ticketOutRecordDialog},
  name: '',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'orderNumber',
         label:'出库单号'
       },
       {
         prop:'targetOrderNumber',
         label:'目标单号'
       },
       {
         prop:'targetUnitName',
         label:'目标单位'
       },
       {
         prop:'outType',
         label:'出库类型'
       },
       {
         prop:'outDate',
         label:'出库日期'
       }
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
  activated() {
    //this.getTableData()
  },
  created(){
    this.getTableData()
  },
  methods:{
    getTableData(){
      this.tableLoading=true
      commonQuery({unitId:this.$store.getters.unitId}).then((res) => {
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
            getDialogTableData({ticketOutRecordId:this.dialogData.id}).then(resp=>{
              if (resp && resp.body && resp.body.data) {
                this.dialogTableData = resp.body.data
                this.dialogVisible = true
                this.dialogTitle = '票据出库记录'
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
