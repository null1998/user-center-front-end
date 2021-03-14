<!-- 票据管理 -->
<template>
  <div>
    <hyd-editable-table
    :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleSave="handleSave"
        @handleDelete="handleDelete">

    </hyd-editable-table>
  </div>
</template>

<script>
import { listProvinceZone } from "@/api/basedata/zone";
import { listByCategoryName } from "@/api/basedata/dictionary";
import { listAll as listTicket } from "@/api/basedata/ticket";
import { pinyin } from "@/utils/pinyin";
export default {
  name: '',
  data () {
    return {
      tableKey: 0,
      tableData:[],
      tableColumons: [
        {
          prop: "name",
          label: "名称",
          type:'show'
        },
        {
          prop: "code",
          label: "编码",
          type:'show'
        },
        {
          prop: "mnemonic",
          label: "助记码",
          type:'show'
        },
        {
          prop: "zoneId",
          label: "地区",
          type: "select",
          options: [],
          placeholder: "请选择地区",
        },
        {
          prop: "dictionaryId",
          label: "类别",
          type: "select",
          options: [],
          placeholder: "请选择类别",
        },
        {
          prop: "year",
          label: "年度",
          type: "input",
        },
        {
          prop: "price",
          label: "价格",
          type: "input",
        },
      ],
      tableLoading: false,
    }
  },
  created(){
    this.getProvinceZone()
    this.getTicketDictionary({'categoryName':'票据分类'})
    this.getTableData()
  },
  methods:{
    handleSave(){

    },
    handleDelete(){

    },
    getTableData(){
      this.tableLoading = true
      listTicket().then(res=>{
        if (res&&res.body&&res.body.data) {
          this.tableData = res.body.data
        }
      }).finally(()=>{
        this.tableLoading = false;
      })
    },
    /**
     * 查询省级行政区划
     */
    getProvinceZone(){
      listProvinceZone().then(res=>{
        if (res&&res.body&&res.body.data) {
          var zoneList = res.body.data
          for (let i = 0; i < zoneList.length; i++) {
            const zone = zoneList[i];
            const option = {}
            option.value = zone.id
            option.label = zone.name
            this.tableColumons[3].options.push({...option})
          }
        }
      })
    },
    /**
     * 获取票据类别
     */
    getTicketDictionary(params){
      listByCategoryName(params).then(res=>{
        if (res&&res.body&&res.body.data) {
          var dictionList = res.body.data
          for (let i = 0; i < dictionList.length; i++) {
            const dictionary = dictionList[i];
            const option = {}
            option.value = dictionary.id
            option.label = dictionary.remark
            this.tableColumons[4].options.push({...option})
          }
        }
      })
    }
  }
}

</script>
<style>
</style>
