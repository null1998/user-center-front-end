import table from './table.vue'

const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
  }
}
// 导出组件
export default hydui