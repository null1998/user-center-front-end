<!-- 下级票据申领审核票据 -->
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
          <el-tooltip content="确认出库" placement="bottom" effect="light">
            <el-button
              :disabled="this.data.status != 1"
              type="success"
              icon="el-icon-circle-check"
              size="mini"
              @click="handleCheck(true)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="申领退回" placement="bottom" effect="light">
            <el-button
              :disabled="this.data.status != 1"
              type="danger"
              icon="el-icon-s-release"
              size="mini"
              @click="handleCheck(false)"
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
      <hyd-table
        :tableKey="tableKey"
        :tableData="tableData"
        :tableColumns="tableColumons"
        :loading="tableLoading"
      />
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="库存票据参考" name="storageTicket">
          <hyd-table
            :tableKey="storageTableKey"
            :tableData="storageTableData"
            :tableColumns="storageTableColumons"
            :loading="storageTableLoading"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { update, autoOut } from "@/api/nontax/ticket-claim/ticket-claim-index";
import { commonQuery as commonQueryStorage } from "@/api/nontax/ticket-storage/ticket-storage-index";
export default {
  name: "",
  props: {
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: "" },
    dialogData: { type: Object, required: true },
    dialogTableData: { type: Array },
  },
  data() {
    return {
      data: {},
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "ticketName",
          label: "财政票据名称",
          width: "240",
        },
        {
          prop: "number",
          label: "数量",
        },
        {
          prop: "startNumber",
          label: "起始号",
        },
        {
          prop: "endNumber",
          label: "终止号",
        },
      ],
      tableLoading: false,
      activeName: "storageTicket",
      storageTableKey: 0,
      storageTableData: [],
      storageTableColumons: [
        {
          prop: "ticketName",
          label: "财政票据名称",
          width: "240",
        },
        {
          prop: "number",
          label: "库存",
        },
        {
          prop: "status",
          label: "状态",
        },
      ],
      storageTableLoading: false,
      storageEnough: true,
      autoOutList: [],
    };
  },
  watch: {
    dialogData(val) {
      this.data = val;
    },
    dialogTableData(val) {
      this.tableData = val;
      this.storageEnough = true;
      this.getTicketStorage();
    },
  },
  created() {},
  methods: {
    getTicketStorage() {
      this.storageTableData = [];
      this.autoOutList = [];
      // 申领单票据列表
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        let autoOut = {
          ticketClaimTicketId: element.id,
          needNumber: element.number,
          ticketId: element.ticketId,
          operateDate: new Date(),
          userId: this.$store.getters.id,
          targetOrderNumber: this.data.orderNumber,
          unitId: this.data.targetUnitId,
          targetUnitId: this.data.unitId,
          outType: "申领出库",
          outDate: new Date(),
        };
        commonQueryStorage({
          unitId: this.$store.getters.unitId,
          ticketId: element.ticketId,
        }).then((res) => {
          // 得到该票据所有票段，按number升序
          if (res && res.body && res.body.data) {
            let storage = {
              ticketClaimId: this.data.id,
              ticketClaimTicketId: element.id,
              needNumber: element.number,
              ticketName: element.ticketName,
              number: 0,
            };
            for (let i = 0; i < res.body.data.length; i++) {
              const e = res.body.data[i];
              // 找到最小的满足要求的号段
              if (parseInt(e.number) >= element.number) {
                storage.number = parseInt(e.number);
                storage.status = "库存充足";
                (storage.storeId = e.id), (autoOut.storeId = e.id);
                break;
              }
            }
            // 没找到合适号段
            if (storage.number == 0) {
              storage.status = "库存不足";
              this.storageEnough = false;
            }
            this.storageTableData.push(storage);
            this.autoOutList.push(autoOut);
          }
        });
      }
    },
    handleCheck(result) {
      if (result) {
        // 准备出库
        if (this.storageEnough) {
          // 库存充足
          this.data.status = 2;
        } else {
          // 库存不足，提示并返回
          this.$notify({
            title: "error",
            message: "库存不足",
            type: "error",
            duration: 2000,
          });
          return;
        }
      } else {
        // 审核退回
        this.data.status = 3;
      }
      this.data.claimDate = undefined
      update(this.data).then((res) => {
        if (res && res.body && res.body.data) {
          if (this.data.status == 2) {
            
            // 自动出库
            autoOut(this.autoOutList);
          }
          this.success();
          this.close();
        }
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
    error() {
      this.$notify({
        title: "error",
        message: "操作失败",
        type: "error",
        duration: 2000,
      });
    },
  },
};
</script>
<style>
</style>
