import table from './table.vue'
import form from './form.vue'
import button from './button.vue'
const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
    Vue.component('hyd-form', form)
    Vue.component('hyd-button',button)
  }
}
// 导出组件
export default hydui