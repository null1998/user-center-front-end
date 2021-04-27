<!-- 单位管理 -->
<template>
  <div>
      <search-page
      ref="searchPage"
      :searchBaseModel="searchBaseModel"
      :handleSearch="commonQuery"
      @showSearchData="showSearchData"
    >
     <hyd-table
       :height="580"
       :tableKey='tableKey'
       :tableData='tableData'
       :tableColumns='tableColumons'
       :loading='tableLoading'
     />
      </search-page>
   </div>
</template>

<script>
import {commonQuery} from '@/api/basedata/unit'
export default {
  components: {},
  name: '',
  data () {
    return {
     tableKey: 0,
     tableData: [],
     tableColumons: [
       {
         prop:'name',
         label:'单位名'
       },
       {
         prop:'code',
         label:'编码'
       },
       {
         prop:'mnemonic',
         label:'助记码'
       },
       {
         prop:'zoneName',
         label:'地区'
       },
       {
         prop:'parentUnitName',
         label:'上级单位名'
       },
     ],
     tableLoading: false,
     searchBaseModel:{}
    }
  },
  watch:{

  },
  mounted(){
    this.getTableData()
  },
  methods:{
    showSearchData(data) {
      this.tableData = data
    },
    commonQuery(searchModel) {
      return commonQuery(searchModel);
    },
    getTableData(){
      this.tableLoading=true
      this.$refs['searchPage'].searchBtnClick()
      this.tableLoading=false
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

