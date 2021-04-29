<!-- 下级票据申领审核 -->
<template>
  <div>
    <search-page
            ref="searchPage"
            :searchBaseModel="searchBaseModel"
            :handleSearch="commonQuery"
            @showSearchData="showSearchData"
          >
    <hyd-table
      :height="540"
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleEdit="handleEdit"
    />
    </search-page>
    <ticket-claim-review-dialog
      :dialogData="dialogData"
      :dialogTableData="dialogTableData"
      :visible="dialogVisible"
      :close="dialogClose"
      :title="dialogTitle"
    />
  </div>
</template>

<script>
import ticketClaimReviewDialog from "./ticket-claim-review-dialog.vue";
import {
  commonQuery,
  getById,
} from "@/api/nontax/ticket-claim/ticket-claim-index";
import { commonQuery as getDialogTableData } from "@/api/nontax/ticket-claim/ticket-claim-ticket";
export default {
  components: { ticketClaimReviewDialog},
  name: "ticket-claim-review",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "orderNumber",
          label: "单号",
        },
        {
          prop: "unitName",
          label: "申领单位",
        },
        {
          prop: "warehouseName",
          label: "收货仓库",
        },
        {
          prop:"status",
          label:"申领状态"
        },
        {
          prop: "claimDateShow",
          label: "申领日期",
        },
      ],
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: "",
      dialogData: {},
      dialogTableData: [],
      statusMap: ["待下单", "下级已下单", "本级已出库", "订单已退回", "下级已入库"],
      payStatusMap: ["待下单", "待付款", "已付款"],
      searchBaseModel: { targetUnitId: this.$store.getters.unitId }
    };
  },
  watch: {},
  mounted(){this.getTableData();},
  created() {
    
  },
  methods: {
    showSearchData(data) {
      for (let i = 0; i < data.length; i++) {i
        const element = data[i];
        element.status = this.statusMap[element.status]
        if (element.claimDate) {
          element.claimDateShow = element.claimDate.year + '-' + element.claimDate.monthValue + '-' + element.claimDate.dayOfMonth
        }
      }
      this.tableData = data;
    },
    commonQuery(searchModel) {
      return commonQuery(searchModel);
    },
    getTableData() {
      this.tableLoading = true;
      this.$refs['searchPage'].searchBtnClick()
      this.tableLoading = false;
    },
    handleEdit(index, row) {
      if (row && row.id) {
        getById(row.id).then((res) => {
          if (res && res.body && res.body.data) {
            this.dialogData = res.body.data;
            getDialogTableData({ ticketClaimId: this.dialogData.id }).then(
              (resp) => {
                if (resp && resp.body && resp.body.data) {
                  this.dialogTableData = resp.body.data;
                  this.dialogVisible = true;
                  this.dialogTitle = "票据申领管理";
                }
              }
            );
          }
        });
      }
    },
    dialogClose() {
      this.getTableData();
      this.dialogVisible = false;
      this.dialogData = {};
      this.dialogTableData = [];
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
