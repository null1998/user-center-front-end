import table from './table.vue'
import form from './form.vue'
const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
    Vue.component('hyd-form', form)
  }
}
// 导出组件
export default hydui