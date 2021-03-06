<!-- 本级印制计划维护 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 新增按钮 -->
      <hyd-form
        @handleCreate="handleCreate"
        :editCfg="editCfg"
        inline
        size="medium"
      />
    </div>
    <printing-plan-dialog
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
    ></printing-plan-dialog>
    <hyd-billboard sign="未到上报时间"></hyd-billboard>
  </div>
</template>

<script>
import printingPlanDialog from './printing-plan-dialog.vue';
export default {
  components: { printingPlanDialog },
  name: "",
  data() {
    return {
      tableKey: 0,
      loading: false,
      editCfg: [
        {
          type: "button",
          name: "新增",
          icon: "el-icon-plus",
          handleName: "handleCreate",
        },
      ],
      dialogVisible: false,
      dialogTitle: "",
    };
  },
  created() {},
  methods: {
    dialogClose() {
      this.dialogVisible = false
    },
    handleCreate() {
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      console.log(row);
    },
    handleDelete(index, row) {
      console.log(row);
    },
  },
};
</script>
<style>
</style>
