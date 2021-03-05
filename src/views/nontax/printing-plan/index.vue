<!-- 本级印制计划维护 -->
<template>
  <div>
    <hyd-billboard sign="未到上报时间"></hyd-billboard>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      isProvinceUnit: true,
      limitDate: undefined,
      tableKey: 0,
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
          sortable: "false",
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
  created() {},
  methods: {
    setLimitDate() {},
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

</style>
