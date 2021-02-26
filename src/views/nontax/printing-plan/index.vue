<!-- 印制计划 -->
<template>
  <div>
    <hyd-form :editCfg="editCfg" :editData="editData" inline size="medium"></hyd-form>
    <hyd-table
      :tableKey="tableKey"
      :tableData="printingPlanList"
      :tableColumns="printingPlanTableColumons"
      :loading="loading"
      :handleRowClassName="handleRowClassName"
      @handleSelectionChange="handleSelectionChange"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></hyd-table>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      tableKey: 0,
      printingPlanList: [
        {
          orderNumber: "10000000000",
          year: "1",
          unitName: "1",
          person: "1",
          tel: "1",
          email: "100000000",
        },
        {
          orderNumber: "1",
          year: "1000000000",
          unitName: "1",
          person: "1",
          tel: "100000000",
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
          sortable: "true",
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
      editCfg: [
        {
          prop: "name",
          label: "用户名",
          type: "input",
        },
        {
          prop: "status",
          label: "状态",
          type: "select",
        },
        {
          prop: "zone",
          label: "地区",
          type: "select",
        },
      ],
      editData: {
        name: "",
        status: "",
        zone: "",
      },
    };
  },
  methods: {
    handleSelectionChange(rows) {
      console.log(rows);
    },
    handleEdit(index, row) {
      console.log(row);
    },
    handleDelete(index, row) {
      console.log(row);
    },
    handleRowClassName({ index, row }) {
      if (row.method === "GET") {
        return "success-row";
      }
    },
  },
};
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
