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
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      top: 5,
      left: "center",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        fontSize: 12,
        color: "#666",
      },
      itemGap: 15,
      formatter: function (name) {
        return name;
      },
      data: props.data.map((item) => ({
        name: item.name,
        icon: "circle",
      })),
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      padding: [0, 0, 0, 0],
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "65%"],
        center: ["50%", "65%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
          disabled: true,
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: "#fff",
        },
        data: props.data,
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
