import table from './table.vue'
import form from './form.vue'
import button from './button.vue'
import billboard from './billboard'
import editableTable from './editable-table.vue'
import mallki from './TextHoverEffect/Mallki.vue'
import nightingGaleRole from './echarts/nighting-gale-role.vue'
import linkAge from './echarts/link-age.vue'
import annulurPie from './echarts/annulur-pie.vue'
import pie from './echarts/pie.vue'
import searchPage from './search-page.vue'

const hydui = {
  install: function(Vue) {
    Vue.component('hyd-table', table)
    Vue.component('hyd-form', form)
    Vue.component('hyd-button', button)
    Vue.component('hyd-billboard', billboard)
    Vue.component('hyd-editable-table', editableTable)
    Vue.component('mallki', mallki)
    Vue.component('nighting-gale-role', nightingGaleRole)
    Vue.component('link-age', linkAge)
    Vue.component('annulur-pie', annulurPie)
    Vue.component('pie', pie)
    Vue.component('search-page', searchPage)
  }
}
// 导出组件
export default hydui
