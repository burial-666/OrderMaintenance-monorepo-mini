<script setup>
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
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
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#e6e6e6",
      borderWidth: 1,
      textStyle: {
        color: "#666",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "8%",
      top: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: props.data.map((item) => item.date),
      axisLine: {
        lineStyle: {
          color: "#e6e6e6",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#666",
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#e6e6e6",
        },
      },
      axisLabel: {
        color: "#666",
        fontSize: 12,
      },
    },
    series: [
      {
        type: "line",
        data: props.data.map((item) => item.value),
        smooth: false,
        symbolSize: 6,
        symbol: "circle",
        itemStyle: {
          color: "#1356eb",
          borderWidth: 2,
          borderColor: "#fff",
        },
        lineStyle: {
          color: "#1356eb",
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(19, 86, 235, 0.2)",
            },
            {
              offset: 1,
              color: "rgba(19, 86, 235, 0.05)",
            },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: "#1356eb",
            borderWidth: 3,
          },
        },
      },
    ],
  };
  chart.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    chart && chart.resize();
  });
});

watch(
  () => props.data,
  () => {
    initChart();
  },
  { deep: true }
);
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<style scoped></style>
