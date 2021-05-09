<!-- 下级印制计划审核对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      :before-close="close"
    >
      <div slot="title" class="header-title">
        <strong>{{ title }}</strong>
        <div style="float: right">
          <el-tooltip content="审核通过" placement="bottom" effect="light">
            <el-button
              type="success"
              icon="el-icon-s-check"
              size="mini"
              @click="handleCheck(true)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="审核退回" placement="bottom" effect="light">
            <el-button
              type="warning"
              icon="el-icon-s-release"
              size="mini"
              @click="handleCheck(false)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="返回主页" placement="bottom" effect="light">
            <el-button
              type="danger"
              icon="el-icon-right"
              size="mini"
              @click="close"
            ></el-button>
          </el-tooltip>
        </div>
       
        
         
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
          width:"240"
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
