<!-- 南丁格尔玫瑰图 -->
<template>
  <div>
    <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  props:{
    data:{type:Array,default:[]},
  },
  data() {
    return {};
  },
  mounted() {
    let myChart = echarts.init(document.getElementById("myChart"));
    let option = {
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
          radius: [20,100],
          center: ["50%", "50%"],
          roseType: "area",
          itemStyle: {
            borderRadius: 8,
          },
          data: [ 
          ],
        },
      ],
    };
    option.series[0].data = this.data;
    myChart.setOption(option);
  },
};
</script>
<style>
</style>
