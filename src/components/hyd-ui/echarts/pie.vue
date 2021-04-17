<!-- 饼图 -->
<template>
  <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "",
  props:{
    name:{type:String,default:''},
    data:{type:Array,default:function(){return []}},
    text:{type:String,default:''},
    subText:{type:String,default:''},
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("myChart"));
    this.option.title.text = this.text
    this.option.title.subText = this.subText
    this.option.series[0].name = this.name
  },
  watch: {
    data(val) {
      if (this.myChart && val) {
        this.option.series[0].data = val;
        this.myChart.setOption(this.option);
        debugger
      }
    },
  },
  data() {
    return {
      option: {
        title: {
            text: '',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '50%',
                data: [
                    
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    };
  },
};
</script>
<style>
</style>
