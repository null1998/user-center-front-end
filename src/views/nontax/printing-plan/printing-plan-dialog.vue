<!-- 本级印制计划对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
      :title="title"
      width="60%"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data"></i>  
        {{title}}          
      </div>
      <el-form v-model="data">
        <el-form-item label="年度">
          <el-select v-model="data.year" style="width: 100px">
            <el-option
              :label="currentYear"
              :value="currentYear"
              :key="currentYear"
            ></el-option>
            <el-option
              :label="currentYear + 1"
              :value="currentYear + 1"
              :key="currentYear + 1"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <hyd-editable-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTab">
        <el-tab-pane label="上年用票数" name="lastYear">
          <hyd-table
            :tableKey="lastYearTableKey"
            :tableData="lastYearTableData"
            :tableColumns="tableColumons"
            :loading="lastYearTableLoading"
          />
        </el-tab-pane>
        <el-tab-pane label="下级上报汇总数" name="subordinate">
          <hyd-table
            :tableKey="subordinateTableKey"
            :tableData="subordinateTableData"
            :tableColumns="tableColumons"
            :loading="subordinateTableLoading"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="handleSaveDialog"
          >保存</el-button
        >
      </span>
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
    type: { type: String },
    data: { type: Object, required: true },
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "ticketId",
          label: "票据名称",
          type: "select",
          options: [
            {
              label: "票据11111111111",
              value: "123",
            },
          ],
          placeholder: "请选择票据",
        },
        {
          prop: "theFirstSeason",
          label: "第一季度",
          type: "input",
        },
        {
          prop: "theSecondSeason",
          label: "第二季度",
          type: "input",
        },
        {
          prop: "theThirdSeason",
          label: "第三季度",
          type: "input",
        },
        {
          prop: "theFourthSeason",
          label: "第四季度",
          type: "input",
        },
      ],
      tableLoading: false,
      activeName: "lastYear",
      lastYearTableKey: 0,
      lastYearTableData: [],
      lastYearTableLoading: false,
      subordinateTableKey: 0,
      subordinateTableData: [],
      subordinateTableLoading: false,
    };
  },
  created() {
    this.currentYear = new Date().getFullYear();
    this.data.year = this.currentYear;
  },
  methods: {
    handleSave(index, row) {
      if (type === "update") {
      }
    },
    handleDelete(index, row) {
      if (type === "update") {
      }
    },
    handleTab(tab, event) {},
    handleSaveDialog() {},
  },
};
</script>
<style>
</style>
