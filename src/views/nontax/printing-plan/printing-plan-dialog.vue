<!-- 本级印制计划对话框 -->
<template>
  <div>
    <el-dialog :visible.sync="visible" :before-close="close" :title="title" width="60%">
      <hyd-editable-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop:"ticketId",
          label:"票据名称",
          type:"select",
          options:[
            {
              label:"票据11111111111",
              value:"123"
            }
          ],
          placeholder:"请选择票据"
        },
        {
          prop:"theFirstSeason",
          label:"第一季度",
          type:"input"
        },
        {
          prop:"theSecondSeason",
          label:"第二季度",
          type:"input"
        },
        {
          prop:"theThirdSeason",
          label:"第三季度",
          type:"input"
        },
        {
          prop:"theFourthSeason",
          label:"第四季度",
          type:"input"
        }
      ],
      tableLoading: false,
    };
  },
  methods: {
    handleSave(index,row) {
      console.log(index+row)
      console.log(this.tableData)
    },
    handleDelete(index,row) {
      console.log(index+row)
      console.log()
    },
  },
};
</script>
<style>
</style>
