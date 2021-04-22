<!-- 开票管理 -->
<template>
  <div>
     <hyd-editable-table
       :tableKey='tableKey'
       :tableData='tableData'
       :tableColumns='tableColumons'
       :loading='tableLoading'
       @handleSave="handleSave"
       @handleDelete="handleDelete"
     />
   </div>
</template>

<script>
import { save,deleteById,commonQuery,getById } from '@/api/nontax/invoice/invoice-index'
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
      commonQuery({unitId:this.$store.getters.unitId}).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableData = res.body.data
          this.tableLoading=false
        }
      })
    },
    handleSave(){},
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
