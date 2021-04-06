<!-- 支付对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync='visible'
      :show-close='false'
      :before-close='close'
    >
    <div slot='title' class='header-title'>
      <i class='el-icon-s-data'>{{
        title
      }}</i>
      <i class='el-icon-circle-close' style='float: right' @click='close'
        >退出</i>
    </div>
    <div v-if="data.status == 0">

    </div>
    <div v-else>
      已付款
    </div>
    </el-dialog>
   </div>
</template>

<script>
import { update } from '@/api/nontax/payment/payment'
export default {
  name: '',
  props:{
    visible: { type: Boolean, required: true, default: false },
    close: { type: Function, required: true },
    title: { type: String, default: '' },
    dialogData: { type: Object, required: true },
  },
  data () {
    return {
     data:{},
    }
  },
  watch:{
    dialogData(val) {
      this.data = val
    },
  },
  created(){
    
  },
  methods:{
    handleSaveDialog() {
      update(this.data).then(res=>{
        if (res&&res.body&&res.body.data) {
          this.success()
          this.close()
        }
      })
    },
    success() {
      this.$notify({
      title: 'success',
      message: '操作成功',
      type: 'success',
      duration: 2000,
      })
    },
    error() {
      this.$notify({
      title: 'error',
      message: '操作失败',
      type: 'error',
      duration: 2000,
      })
    },
  }
}

</script>
<style>
</style>
