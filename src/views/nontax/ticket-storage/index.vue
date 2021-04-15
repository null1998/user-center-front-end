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
     <div v-if="ngrData">
      <nighting-gale-role :data="ngrData" :show="ngrData.length > 0"/>
     </div>
   </div>
</template>

<script>
import { save as saveRow,deleteById,update as updateRow,commonQuery} from '@/api/nontax/ticket-storage/ticket-storage-index'
import { getDate } from "@/utils/date";
import { commonQuery as commonQueryWarehouse } from "@/api/basedata/warehouse";
import { commonQuery as commonQueryTicket } from "@/api/basedata/ticket";
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
         prop:'number',
         label:'数量',
         type:'show'
       },
       {
         prop:'operateDate',
         label:'操作日期',
         type:'show'
       },
     ],
     tableLoading: false,
     ngrData:[],
    }
  },
  activated(){
    //this.getTableData()
  },
  created(){
    this.getTableData()
    this.getWarehouseList()
    this.getTicketList()
  },
  methods:{
    getNgrData(array){
      let map = new Map()
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (!map.get(element.ticketName)) {
          map.set(element.ticketName,element.number)
        } else {
          map.set(element.ticketName,parseInt(element.number)+parseInt(map.get(element.ticketName)))
        }
      }
      this.ngrData = []
      for (var key of map.keys()) {
        this.ngrData.push({value:Number.parseInt(map.get(key)),name:key})
      }
    },
    getWarehouseList(){
      commonQueryWarehouse({unitId:this.$store.getters.unitId}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[0].options = res.body.data
        }
      })
    },
    getTicketList() {
      commonQueryTicket({zoneId:this.$store.getters.provinceZoneId}).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableColumons[1].options = res.body.data
        }
      })
    },
   getTableData(){
     this.tableLoading=true
     commonQuery({unitId:this.$store.getters.unitId}).then((res) => {
       if (res && res.body && res.body.data) {
         this.tableData = res.body.data
         this.getNgrData(this.tableData)
         this.tableLoading=false
       }
     })
   },
   handleSave(index,row) {
     if(!this.dataValid(row)) {
       this.getTableData()
       return
     }
     row.unitId = this.$store.getters.unitId
     row.userId = this.$store.getters.id
     row.operateDate = getDate()
     if (!row.id) {
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
           this.ngrData = []
           this.success()
           this.getTableData()
         }
       })
     }
   },
   dataValid(row) {
     if (row&&row.ticketId&&row.warehouseId&&row.startNumber&&row.endNumber) {
       let s = /^[0-9]{10}$/
       return s.test(row.startNumber)&&s.test(row.endNumber)&&row.startNumber<=row.endNumber
     }
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
