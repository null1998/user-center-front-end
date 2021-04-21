<template>
  <div>
    <el-form :inline="true" :model="formModel">
      <el-form-item
        v-for="(item, index) in searchConfig"
        :key="index"
        :label="item.label"
      >
        <el-input
          @change="change()"
          v-if="item.type == 'input'"
          v-model="formModel[item.prop]"
          size="medium"
        />
        <el-select
          @change="change()"
          v-if="item.type == 'select'"
          v-model="formModel[item.prop]"
          size="medium"
          filterable
          clearable
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="searchBtnClick"
          size="medium"
          icon="el-icon-search"
        ></el-button>
      </el-form-item>
    </el-form>
    <slot></slot>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageModel.pageNum"
      :page-sizes="pageSizes"
      :page-size="pageModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageModel.total"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "search-page",
  props: {
    searchConfig: {
      type: Array,
      default: function () {
        return [];
      },
    },
    searchBaseModel: { type: Object },
    handleSearch: { type: Function },
    pageSizes: {
      type: Array,
      default: function () {
        return [10, 20, 50, 100];
      },
    },
  },
  computed: {
    requestModel() {
      return { ...this.formModel, ...this.pageModel };
    },
  },
  data() {
    return {
      formModel: {},
      pageModel: {
        pageNum: 1,
        pageSize: 10,
        total: 10,
      },
      requestModelChange: false,
      searchBtnLoading:false
    };
  },
  methods: {
    change(){
      this.requestModelChange = true
    },
    handleSizeChange(currentPageSize) {
      this.pageModel.pageSize = currentPageSize;
      this.requestModelChange = true;
      this.searchBtnClick();
    },
    handleCurrentChange(currentPageNum) {
      this.pageModel.pageNum = currentPageNum;
      this.searchBtnClick();
    },
    searchBtnClick() {
      this.searchBtnLoading = true
      if (this.requestModelChange) {
        this.pageModel.pageNum = 1;
      }
      this.handleSearch({ ...this.requestModel, ...this.searchBaseModel }).then(
        (res) => {
          if (res && res.body && res.body.data) {
            const { pageSize, pageNum, total } = res.body;
            // 设置分页信息
            const totalInt = Number.parseInt(total);
            // 计算最多多少页
            const maxPages =
              Number.parseInt(totalInt / pageSize) +
              (totalInt % pageSize !== 0 ? 1 : 0);
            // 实际页码，超出最大页数则为最大页数页码
            const actualPageNum = pageNum <= maxPages ? pageNum : maxPages;

            this.pageModel.pageSize = pageSize;
            this.pageModel.pageNum = this.requestModelChange
              ? 1
              : actualPageNum;
            this.pageModel.total = Number.parseInt(total);
            this.$emit("showSearchData", res.body.data);
          }
        }
      ).finally(() => {
        this.requestModelChange = false;
        this.searchBtnLoading = false
      });
    },
  },
};
</script>