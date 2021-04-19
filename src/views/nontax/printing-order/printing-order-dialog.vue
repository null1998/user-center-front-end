<!-- 省级财政印制订单对话框 -->
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
          <el-popover placement="bottom" width="500" trigger="click">
            <el-tooltip content="需求导入" placement="bottom" effect="light">
              <el-button
                type="success"
                size="mini"
                :disabled="data.status != 0"
                icon="el-icon-back"
                @click="importData()"
              />
            </el-tooltip>
            <hyd-table
              :tableKey="subordinateTableKey"
              :tableData="subordinateTableData"
              :tableColumns="subordinateTableColumns"
              :loading="subordinateTableLoading"
              @handleSelectionChange="handleSelect"
            />
            <el-tooltip
              slot="reference"
              content="汇总参考"
              placement="bottom"
              effect="light"
            >
              <el-button size="mini" type="primary" icon="el-icon-document" />
            </el-tooltip>
          </el-popover>
          <el-tooltip
            slot="reference"
            content="自动入库"
            placement="bottom"
            effect="light"
          >
            <el-button
              :disabled="this.data.status != 2"
              size="mini"
              type="success"
              icon="el-icon-document"
              @click="autoStore()"
            />
          </el-tooltip>
          <el-tooltip content="印制下单" placement="bottom" effect="light">
            <el-button
              :disabled="this.data.status != 0"
              type="info"
              icon="el-icon-shopping-cart-1"
              size="mini"
              @click="handleSaveDialog"
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
          <div v-else>
            <strong
              ><u>{{ data.printUnitName }}</u></strong
            >
          </div>
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
              v-for="option in warehouseList"
              :label="option.name"
              :value="option.id"
              :key="option.id"
            ></el-option>
          </el-select>
          <div v-else>
            <strong
              ><u>{{ data.warehouseName }}</u></strong
            >
          </div>
        </el-form-item>
      </el-form>
      <hyd-editable-table
        :height="350"
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :loading="tableLoading"
        :showButton="data.status === 0"
        @handleSave="handleSave"
        @handleDelete="handleDelete"
      />
      <el-row>
        <div style="float: right">
          <div class="example">
            ￥<countTo
              :startVal="0"
              :endVal="amount"
              :duration="2000"
            ></countTo>
          </div>
        </div>
      </el-row>
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
import { update,autoStore } from "@/api/nontax/printing-order/printing-order-index";
import {
  save,
  update as updateTicket,
  listByPrintingOrderId,
  deleteById,
} from "@/api/nontax/printing-order/printing-order-ticket";
import { save as savePayment } from "@/api/nontax/payment/payment";
import { getDate } from "@/utils/date";
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
      warehouseList: [],
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
          width: "240",
        },
        {
          prop: "number",
          label: "需求数量",
          type: "input",
          width:"100"
        },
        {
          prop: "price",
          label: "单价",
          type: "show",
          width: "50",
        },
        {
          prop: "startNumber",
          label: "起始号",
          type: "show",
        },
        {
          prop: "endNumber",
          label: "终止号",
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
          width: "260",
        },
        {
          prop: "number",
          label: "需求数量",
          width: "",
        },
      ],
      subordinateTableLoading: false,
      autoStoreList:[],
      amount: 0,
      array: [],
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
      this.autoStoreList = []
      this.amount = 0
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        let autoStore = {
          printingOrderId:this.data.id,
          needNumber:element.number,
          ticketId:element.ticketId,
          operateDate:getDate(),
          userId:this.$store.getters.id,
          warehouseId:this.warehouseList[0].id,
          startNumber:element.startNumber,
          endNumber:element.endNumber,
          sourceOrderNumber: this.data.orderNumber,
          unitId: this.data.unitId,
          sourceUnitId:this.data.printUnitId,
          storeType:'印制入库',
          storeDate:getDate()
        }
        this.autoStoreList.push(autoStore)
        this.amount += element.price * parseInt(element.number)
      }
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
    autoStore(){
      autoStore(this.autoStoreList).then(()=>{
        this.success()
        this.close()
      })
    },
    importData() {
      for (let index = 0; index < this.array.length; index++) {
        let row = { ...this.array[index] };
        this.helper(row);
      }
      this.getTableData();
      this.success();
    },
    async helper(row) {
      row.printingOrderId = this.data.id;
      save(row);
    },
    handleSelect(rows) {
      this.array = rows;
    },
    handleSaveDialog() {
      this.$refs["data"].validate((valid) => {
        if (valid) {
          this.data.start = new Date();
          this.data.status = 1;
          this.data.payStatus = 1;
          update(this.data).then((res) => {
            if (res && res.body && res.body.data) {
              this.success();
              this.close();
            }
          });
          let payment = {
            sourceOrderNumber: this.data.orderNumber,
            srcUnitId: this.data.unitId,
            desUnitId: this.data.printUnitId,
            orderType: "印制结算",
            totalPrice: this.amount,
            status: 0,
          };
          // 最好使用消息队列重试
          savePayment(payment);
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
      this.amount = 0;
      listByPrintingOrderId(this.data.id).then((resp) => {
        if (resp && resp.body && resp.body.data) {
          this.tableData = resp.body.data;
          // 计算总价
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
          this.warehouseList = res.body.data;
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
