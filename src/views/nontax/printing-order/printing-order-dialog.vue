<!-- 省级财政印制订单对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :show-close="false"
      :before-close="close"
      width="65%"
    >
      <div slot="title" class="header-title">
        <i class="el-icon-s-data" style="font-family: 'PingFang SC'">{{
          title
        }}</i>
        <i class="el-icon-circle-close" style="float: right" @click="close"
          >退出</i
        >
        <i
          v-if="data.status === 0"
          class="el-icon-shopping-cart-1"
          style="float: right"
          @click="handleSaveDialog"
          >下单</i
        >
      </div>
      <el-form
        ref="data"
        :model="data"
        label-width="80px"
        :rules="data.status === 0 ? rule : {}"
        inline
      >
        <el-form-item label="印刷厂" prop="printUnitId">
          <el-select
            v-if="data.status === 0"
            v-model="data.printUnitId"
            placeholder="请选择印刷厂"
            filterable
            clearable
          >
            <el-option
              v-for="option in printUnitList"
              :label="option.name"
              :value="option.id"
              :key="option.id"
            ></el-option>
          </el-select>
          <div v-else>{{ data.printUnitName }}</div>
        </el-form-item>
        <el-form-item label="收货仓库" prop="warehouseId">
          <el-select
            v-if="data.status === 0"
            v-model="data.warehouseId"
            placeholder="请选择收货仓库"
            filterable
            clearable
          >
            <el-option
              v-for="option in warehousetList"
              :label="option.name"
              :value="option.id"
              :key="option.id"
            ></el-option>
          </el-select>
          <div v-else>{{ data.warehouseName }}</div>
        </el-form-item>
        <el-form-item label="收货日期" prop="end">
          <el-date-picker
            v-if="data.status === 0"
            type="date"
            placeholder="选择收获日期"
            v-model="data.end"
            value-format="yyyy年MM月dd日"
          ></el-date-picker>
          <div v-else>{{ data.end }}</div>
        </el-form-item>
      </el-form>
      <hyd-editable-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :loading="tableLoading"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
      <el-row>
      <div style="float: right">
        <div class="example">
          ￥<countTo :startVal="0" :endVal="amount" :duration="2000"></countTo>
        </div>
      </div>
      </el-row>
      <el-tabs v-model="active" type="border-card" v-if="data.status === 0">
        <el-tab-pane label="下级需求汇总参考" name="subordinate">
          <hyd-table
            :tableKey="subordinateTableKey"
            :tableData="subordinateTableData"
            :tableColumns="subordinateTableColumns"
            :loading="subordinateTableLoading"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import { listByPrintingPlanId } from "@/api/nontax/printing-plan/printing-plan-ticket";
import { listByParentUnitIdAndStatusAndYear } from "@/api/nontax/printing-plan/printing-plan-index";
import { commonQuery } from "@/api/basedata/unit";
import { listByUnitId } from "@/api/basedata/warehouse";
import { listByCategoryName } from "@/api/basedata/dictionary";
import { commonQuery as listTicket } from "@/api/basedata/ticket";
import { update } from "@/api/nontax/printing-order/printing-order-index";
import {
  save,
  update as updateTicket,
  listByPrintingOrderId,
  deleteById,
} from "@/api/nontax/printing-order/printing-order-ticket";
export default {
  components: { countTo },
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    type: { type: String },
    dialogData: { type: Object, required: true },
    dialogTableData: { type: Array },
    dialogAmount: { type: Number },
    clearValidate: { type: Boolean },
  },
  data() {
    return {
      data: {},
      rule: {
        printUnitId: [
          { required: true, message: "请选择印刷厂", trigger: "change" },
        ],
        warehouseId: [
          { required: true, message: "请选择收货仓库", trigger: "change" },
        ],
        end: [
          {
            type: "string",
            required: true,
            message: "请选择收货日期",
            trigger: "change",
          },
        ],
      },
      form: {},
      printUnitList: [],
      warehousetList: [],
      tableKey: 0,
      tableData: [],
      tableColumns: [
        {
          prop: "ticketId",
          label: "财政票据名称",
          type: "select",
          options: [],
          optionLabel: "name",
          optionValue: "id",
          placeholder: "请选择票据",
        },
        {
          prop: "number",
          label: "需求数量",
          type: "input",
        },
        {
          prop: "price",
          label: "单价",
          type: "show",
        },
      ],
      tableLoading: false,
      subordinateTableKey: 0,
      subordinateTableData: [],
      subordinateTableColumns: [
        {
          prop: "ticketName",
          label: "票据名称",
        },
        {
          prop: "number",
          label: "需求数量",
        },
      ],
      subordinateTableLoading: false,
      active: "subordinate",
      amount: 0,
    };
  },
  created() {
    this.listTicket();
    this.listPrintUnit();
    this.listMyWarehouseList();
    this.listSubordinatePrintingPlanTicket();
  },
  watch: {
    dialogData(val) {
      this.data = val;
    },
    dialogTableData(val) {
      this.tableData = val;
    },
    dialogAmount(val) {
      this.amount = val;
    },
    clearValidate(val) {
      if (val) {
        this.$nextTick(function () {
          this.$refs["data"].clearValidate();
        });
      }
    },
  },
  methods: {
    handleSaveDialog() {
      this.$refs["data"].validate((valid) => {
        if (valid) {
          let now = new Date();
          this.data.start =
            now.getFullYear() +
            "年" +
            parseInt(now.getMonth() + 1) +
            "月" +
            now.getDate() +
            "日";
          this.data.status = 1;
          update(this.data).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.close();
            }
          });
        }
      });
    },
    handleSave(index, row) {
      // 数据不合法，返回
      if (!this.dataValid(row)) {
        this.getTableData();
        return;
      }
      if (this.data.status === 0 && row) {
        if (!row.id) {
          row.printingOrderId = this.data.id;
          save(row).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.getTableData();
            }
          });
        } else {
          updateTicket(row).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.getTableData();
            }
          });
        }
      }
    },
    handleDelete(index, row) {
      if (this.data.status === 0 && row && row.id) {
        deleteById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.success();
            this.getTableData();
          }
        });
      }
    },
    /**
     * 获取印制订单表格数据
     */
    getTableData() {
      listByPrintingOrderId(this.data.id).then((resp) => {
        if (resp && resp.body && resp.body.data) {
          this.tableData = resp.body.data;
          // 计算总价
          this.amount = 0;
          for (let i = 0; i < this.tableData.length; i++) {
            const row = this.tableData[i];
            this.amount += row.price * row.number;
          }
        }
      });
    },
    /**
     * 查询本省的所有票据
     */
    listTicket() {
      let params = {};
      params.zoneId = this.$store.getters.provinceZoneId;
      params.year = new Date().getFullYear() + 1;
      listTicket(params).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableColumns[0].options = res.body.data;
        }
      });
    },
    /**
     * 查询本地区印刷厂
     */
    listPrintUnit() {
      let p = {};
      p.categoryName = "单位分类";
      listByCategoryName(p).then((res) => {
        if (res && res.body && res.body.data) {
          for (let i = 0; i < res.body.data.length; i++) {
            const dictionary = res.body.data[i];
            if (dictionary.remark === "印刷单位") {
              let params = {};
              params.dictionaryId = dictionary.id;
              params.zoneId = this.$store.getters.zoneId;
              commonQuery(params).then((resp) => {
                if (resp && resp.body && resp.body.data) {
                  this.printUnitList = resp.body.data;
                }
              });
            }
          }
        }
      });
    },
    listMyWarehouseList() {
      listByUnitId(this.$store.getters.unitId).then((res) => {
        if (res && res.body && res.body.data) {
          this.warehousetList = res.body.data;
        }
      });
    },
    /**
     * 查询所有下级单位下年的审核通过的印制计划票据
     */
    listSubordinatePrintingPlanTicket() {
      const params = {};
      params.parentUnitId = this.$store.getters.unitId;
      params.printingPlanStatus = 2;
      params.year = new Date().getFullYear() + 1;
      // 查询下级单位下年的审核通过的印制计划
      listByParentUnitIdAndStatusAndYear(params).then((res) => {
        if (res && res.body && res.body.data) {
          // 查询其中的所有票据
          this.listPrintingPlanTicket(res.body.data).then(
            (printingPlanTicketList) => {
              var map = new Map();
              for (let i = 0; i < printingPlanTicketList.length; i++) {
                const printingPlanTicket = { ...printingPlanTicketList[i] };
                if (map.get(printingPlanTicket.ticketId)) {
                  let old = map.get(printingPlanTicket.ticketId);
                  old.theFirstSeason =
                    parseInt(old.theFirstSeason) +
                    parseInt(printingPlanTicket.theFirstSeason);
                  old.theSecondSeason =
                    parseInt(old.theSecondSeason) +
                    parseInt(printingPlanTicket.theSecondSeason);
                  old.theThirdSeason =
                    parseInt(old.theThirdSeason) +
                    parseInt(printingPlanTicket.theThirdSeason);
                  old.theFourthSeason =
                    parseInt(old.theFourthSeason) +
                    parseInt(printingPlanTicket.theFourthSeason);
                  map.set(printingPlanTicket.ticketId, old);
                } else {
                  map.set(printingPlanTicket.ticketId, printingPlanTicket);
                }
              }
              for (var value of map.values()) {
                var tmp = {};
                tmp.ticketId = value.ticketId;
                tmp.ticketName = value.ticketName;
                tmp.number =
                  parseInt(value.theFirstSeason) +
                  parseInt(value.theSecondSeason) +
                  parseInt(value.theThirdSeason) +
                  parseInt(value.theFourthSeason);
                this.subordinateTableData.push(tmp);
              }
            }
          );
        }
      });
    },
    /**
     * 根据印制计划列表查询所有票据
     */
    listPrintingPlanTicket(printingPlanList) {
      return new Promise(async (resolve, reject) => {
        let printingPlanTicketList = [];
        for (let i = 0; i < printingPlanList.length; i++) {
          const printingPlan = printingPlanList[i];
          if (printingPlan.id) {
            await listByPrintingPlanId(printingPlan.id).then((res) => {
              if (res && res.body && res.body.data) {
                printingPlanTicketList = printingPlanTicketList.concat(
                  res.body.data
                );
              }
            });
          }
        }
        resolve(printingPlanTicketList);
      });
    },
    success() {
      this.$notify({
        title: "success",
        message: "操作成功",
        type: "success",
        duration: 2000,
      });
    },
    dataValid(row) {
      if (row && row.ticketId && row.number) {
        return /^[0-9]+$/.test(row.number);
      }
      return false;
    },
  },
};
</script>
<style scoped>
.example {
  color: #f6416c;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-size: 30px;
  font-weight: 500;
}
</style>
