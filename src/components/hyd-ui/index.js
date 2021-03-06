import table from './table.vue'
import form from './form.vue'
import button from './button.vue'
import billboard from './billboard'
import editableTable from './editable-table.vue'
const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
    Vue.component('hyd-form', form)
    Vue.component('hyd-button', button)
    Vue.component('hyd-billboard', billboard)
    Vue.component('hyd-editable-table',editableTable)
  }
}
// 导出组件
export default hydui