<!-- 下级印制计划审核对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      :before-close="close"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data">{{ title }}</i>
        <i class="el-icon-circle-close" style="float: right" @click="close"
          >退出</i
        >
        <i
          class="el-icon-s-release"
          style="float: right"
          @click="handleCheck(false)"
          >审核退回</i
        >
           
        <i
          class="el-icon-s-check"
          style="float: right"
          @click="handleCheck(true)"
          >审核通过</i
        >
         
      </div>
      <hyd-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :loading="tableLoading"
      />
    </el-dialog>
  </div>
</template>

<script>
import { check } from "@/api/nontax/printing-plan/printing-plan-index";
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    data: { type: Object, required: true },
    tableData: { type: Array },
    title:{type:String}
  },
  data() {
    return {
      tableKey: 0,
      tableColumns:[
        {
          prop: "ticketName",
          label: "财政票据名称",
        },
        {
          prop: "theFirstSeason",
          label: "一季度",
        },
        {
          prop: "theSecondSeason",
          label: "二季度",
        },
        {
          prop: "theThirdSeason",
          label: "三季度",
        },
        {
          prop: "theFourthSeason",
          label: "四季度",
        },
      ],
      tableLoading:false,
      myData:this.data
    };
  },
  watch:{
    data(val){
      this.myData = val
    }
  },
  methods: {
    handleCheck(result) {
      this.myData.status = result ? 2 : 3
      check(this.myData).then(res=>{
        if (res&&res.body) {
          this.close()
        }
      })
    },
  },
};
</script>
<style>
</style>
