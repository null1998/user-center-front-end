<!-- 印制计划上报设置对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="35%"
      :show-close="false"
      :before-close="close"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data" style="font-family: 'PingFang SC'">{{ title }}</i>
        <i class="el-icon-circle-close" style="float: right;" @click="close">退出</i>
        <i class="el-icon-circle-check" style="float: right;" @click="handle">保存</i>    
      </div>
      <el-form
        ref="myform"
        :model="data"
        :rules="rules"
        label-width="110px"
        label-position="right"
      >
        <el-form-item prop="dateRange" label="上报日期范围">
          <el-date-picker
            v-model="data.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { save, update } from "@/api/nontax/printing-plan/limit-date";
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    type: { type: String },
    dataId: { type: String },
  },
  data() {
    return {
      data: {
        year: undefined,
        dateRange: [],
        unitId: undefined,
      },
      rules: {
        //year: [{ required: true, message: "请选择年度", trigger: "change" }],
        dateRange: [
          { required: true, message: "请选择上报日期", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.data.unitId = this.$store.getters.unitId;
  },
  methods: {
    handle() {
      this.$refs["myform"].validate((valid) => {
        if (valid) {
          var dto = {};
          dto.year = new Date().getFullYear() + 1
          dto.startDate = this.data.dateRange[0];
          dto.endDate = this.data.dateRange[1];
          dto.unitId = this.data.unitId;
          if (this.type === "create") {
            save(dto).then((res) => {
              if (this.notify(res)) {
                this.close();
              }
            });
          } else if (this.type === "update") {
            dto.id = this.dataId;
            update(dto).then((res) => {
              if (this.notify(res)) {
                this.close();
              }
            });
          }
        }
      });
    },
    notify(res) {
      if (res && res.body && res.body.data) {
        this.$notify({
          title: "success",
          message: "操作成功",
          type: "success",
          duration: 2000,
        });
        return true;
      } else {
        this.$notify({
          title: "error",
          message: "操作失败",
          type: "error",
          duration: 2000,
        });
        return false;
      }
    },
  },
};
</script>
<style>
</style>
