<!-- 通用table，动态创建列 -->
<template>
  <el-table
    :key="tableKey"
    :data="tableData"
    v-loading="loading"
    style="width: 100%"
    @selection-change="handleSelectionChange"
    border
    stripe
  >
    <el-table-column type="selection" width="55" v-if="this.selector?this.selector:false"> </el-table-column>
    <el-table-column label="ID" prop="id">
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :sortable="item.sortable ? item.sortable : false"
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "",
  props: {
    tableKey: { type: Number, required: true, default: "key" },
    tableData: { type: Array, required: true, default: [] },
    loading: { type: Boolean, required: true, default: false },
    tableColumns: { type: Array, required: true, default: [] },
    selector:{type: Boolean}
  },
  data() {
    return {};
  },
  methods:{
    handleSelectionChange(rows) { 
      this.$emit("handleSelectionChange", rows)
    }
  }
};
</script>
<style>
</style>
