import table from './table.vue'
import form from './form.vue'
import button from './button.vue'
import billboard from './billboard'
const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
    Vue.component('hyd-form', form)
    Vue.component('hyd-button', button)
    Vue.component('hyd-billboard', billboard)
  }
}
// 导出组件
export default hydui