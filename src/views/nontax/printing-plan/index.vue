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
      :data="dialogData"
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
      :type="dialogType"
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
      editCfg: [
        {
          type: "button",
          name: "新增",
          icon: "el-icon-plus",
          handleName: "handleCreate",
        },
      ],
      dialogData:{},
      dialogVisible: false,
      dialogTitle: "",
      dialogType:""
    };
  },
  created() {},
  methods: {
    dialogClose() {
      this.dialogVisible = false
    },
    handleCreate() {
      this.dialogVisible = true;
      this.dialogTitle = "印制计划-新增"
      this.dialogType = "create"
    },
    handleEdit(index, row) {
      //this.dialogData = 
      this.dialogVisible = true;
      this.dialogTitle = "印制计划-编辑"
      this.dialogType = "update"
    },
    handleDelete(index, row) {
      console.log(row);
    },
  },
};
</script>
<style>
</style>
