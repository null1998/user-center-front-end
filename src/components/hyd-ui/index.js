import table from './table.vue'
import form from './form.vue'
import button from './button.vue'
import billboard from './billboard'
import editableTable from './editable-table.vue'
import mallki from './TextHoverEffect/Mallki.vue'
import nightingGaleRole from './echarts/nighting-gale-role.vue'

const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
    Vue.component('hyd-form', form)
    Vue.component('hyd-button', button)
    Vue.component('hyd-billboard', billboard)
    Vue.component('hyd-editable-table', editableTable)
    Vue.component('mallki', mallki)
    Vue.component('nighting-gale-role', nightingGaleRole)
  }
}
// 导出组件
export default hydui
