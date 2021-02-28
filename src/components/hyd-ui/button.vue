<!-- 通用按钮 -->
<template>
  <el-button @click="handleButton" :size="size" :type="buttonType" :icon="icon">
    {{buttonName}}
  </el-button>
</template>

<script>
export default {
  name: '',
  props:{
    buttonName:{type:String},
    size:{type:String,default:"mini"},
    buttonType:{type:String},
    icon:{type:String},
  },
  data () {
    return {
      loading:false
    }
  },
  methods:{
    handleButton() {
      this.loading=true
      this.$emit('handleButton')
      this.loading=false
    }
  }
}

</script>
<style>
</style>
