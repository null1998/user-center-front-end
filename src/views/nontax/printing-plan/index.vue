<!-- 印制计划 -->
<template>
  <hyd-table
    :tableKey="tableKey"
    :tableData="printingPlanList"
    :tableColumns="printingPlanTableColumons"
    :loading="loading"
    selector
    @handleSelectionChange="handleSelectionChange"
  ></hyd-table>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      tableKey: 0,
      printingPlanList: [
        {
          orderNumber: "1",
          year: "1",
          unitName: "1",
          person: "1",
          tel: "1",
          email: "1",
        },
      ],
      loading: false,
      printingPlanTableColumons: [
        {
          prop: "orderNumber",
          label: "单号",
        },
        {
          prop: "year",
          label: "年度",
          sortable: "true",
        },
        {
          prop: "unitName",
          label: "单位",
          sortable: "true"
        },
        {
          prop: "person",
          label: "联系人",
        },
        {
          prop: "tel",
          label: "联系电话",
        },
        {
          prop: "email",
          label: "邮箱",
        },
      ],
    };
  },
  methods:{
    handleSelectionChange(rows){
      console.log(rows)
    }
  }
};
</script>
<style>
</style>
