<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
let chart = null;

const initChart = () => {
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(chartRef.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e6e6e6',
      borderWidth: 1,
      textStyle: {
        color: '#666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.name),
      axisTick: {
        alignWithLabel: true,
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#e6e6e6'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        interval: 0,
        rotate: 30,
        align: 'right',
        margin: 8
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitNumber: 4,
      max: function(value) {
        return Math.ceil(value.max) + 1;
      },
      min: 0,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e6e6e6'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: function(value) {
          return value.toFixed(0);
        }
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: '30%',
        data: props.data.map(item => item.value),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#1790ff'
            }, {
              offset: 1,
              color: '#1356eb'
            }]
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: false
        }
      }
    ]
  };
  chart.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => {
    chart && chart.resize();
  });
});

watch(() => props.data, () => {
  initChart();
}, { deep: true });
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<style scoped></style>
