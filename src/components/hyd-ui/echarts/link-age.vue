<!--  -->
<template>
  <div>
    <div id="myChart" :style="{ width: '500px', height: '500px' }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    }
  },
  mounted(){
    this.myChart = echarts.init(document.getElementById("myChart"));
  },
  watch: {
    data(val) {
      if (this.myChart && val && val != {}) {
        this.option.dataset.source = val
        for (let i = 1; i < val.length; i++) {
          this.option.series.push({
            type: "line",
            smooth: true,
            seriesLayoutBy: "row",
            emphasis: { focus: "series" },
          })
        }
        this.myChart.setOption(this.option);
      }
    },
  },
  methods:{
  },
  data() {
    return {
      myChart:undefined,
      option: {
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: false,
        },
        dataset: {
          source: [
            
          ],
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "25%" },
        series: [],
      },
    };
  },
};
</script>
<style>
</style>
