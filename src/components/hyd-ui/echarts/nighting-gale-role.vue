<!-- 南丁格尔玫瑰图 -->
<template>
  <div>
    <div id="myChart" :style="{ width: '400px', height: '400px' }"></div>
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
    },
  },
  data() {
    return {
      myChart: {},
      option: {
        legend: {
          top: "bottom",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: [20, 100],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("myChart"));
  },
  watch: {
    data(val) {
      if (this.myChart && val) {
        this.option.series[0].data = val;
        this.myChart.setOption(this.option);
      }
    },
  },
};
</script>
<style>
</style>
