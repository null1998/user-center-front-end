<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="jump('/nontax/order/printing-order')" v-if="province">印制订单</el-button>
    <el-button type="primary" @click="jump('/nontax/order/ticket-claim')" v-if="city || area">申领订单</el-button>
    <el-button type="primary" @click="jump('/nontax/storage/ticket-store-record')" v-if="province || city || area">入库记录</el-button>
    <el-button type="primary" @click="jump('/nontax/storage/ticket-store-record')" v-if="province || city || area">出库记录</el-button>
    <el-button type="primary" @click="jump('/nontax/storage/ticket-storage')" v-if="province || city || area">库存查看</el-button>
    <el-button type="primary" @click="jump('/nontax/invoice/index')" v-if="province || city || area">开票管理</el-button>
    <el-button type="primary" @click="jump('/nontax/payment/index')" v-if="province || city || area">工本费用</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ]),
    province() {
      return this.$store.getters.unitLevel == 2
    },
    city() {
      return this.$store.getters.unitLevel == 3
    },
    area() {
      return this.$store.getters.unitLevel == 4
    }
  },
  data(){
    return {
      ticketStorage:[{value:10,name:'abc'}],
    }
  },
  methods:{
    jump(path) {
      this.$router.push({path:path})
    }
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
