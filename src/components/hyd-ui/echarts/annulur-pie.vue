<!-- 环形饼图 -->
<template>
  <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  props:{
    name:{type:String,default:''},
    data:{type:Array,default:function(){return []}}
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("myChart"));
    this.option.series[0].name = this.name
  },
  watch: {
    data(val) {
      if (this.myChart && val) {
        this.option.series[0].data = val;
        this.myChart.setOption(this.option);
      }
    },
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
            ],
          },
        ],
      },
    };
  },
};
</script>
<style>
</style>
