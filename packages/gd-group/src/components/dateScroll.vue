<script setup>
import { ref, onMounted, nextTick, defineEmits } from "vue";

const yearitemsDom = ref([]);
const monthitemsDom = ref([]);
const dayitemsDom = ref([]);
const selectedYear = ref(4); // 默认选中2023年
const selectedMonth = ref(4); // 默认选中1月
const selectedDay = ref(4); // 默认选中1日
const yearScrollContainer = ref(null);
const monthScrollContainer = ref(null);
const dayScrollContainer = ref(null);

const emit = defineEmits(["sendDate", "cancel"]);

const years = [
  "",
  "",
  "2021年",
  "2022年",
  "2023年",
  "2024年",
  "2025年",
  "2026年",
  "2027年",
  "2028年",
  "2029年",
  "2030年",
  "",
  "",
];

const months = [
  "",
  "",
  "1月", // 加上"月"
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
  "",
  "",
];

const days = [
  "",
  "",
  "1日", // 加上"日"
  "2日",
  "3日",
  "4日",
  "5日",
  "6日",
  "7日",
  "8日",
  "9日",
  "10日",
  "11日",
  "12日",
  "13日",
  "14日",
  "15日",
  "16日",
  "17日",
  "18日",
  "19日",
  "20日",
  "21日",
  "22日",
  "23日",
  "24日",
  "25日",
  "26日",
  "27日",
  "28日",
  "29日",
  "30日",
  "31日",
  "",
  "",
];

const layout = (type) => {
  const opacityStep = 0.4;
  const items =
    type === "year"
      ? yearitemsDom.value
      : type === "month"
      ? monthitemsDom.value
      : dayitemsDom.value;
  const selected =
    type === "year"
      ? selectedYear.value
      : type === "month"
      ? selectedMonth.value
      : selectedDay.value;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dis = Math.abs(i - selected);
    item.style.opacity = opacityStep ** dis;
  }
};

const handleScroll = (type) => {
  const container =
    type === "year"
      ? yearScrollContainer.value
      : type === "month"
      ? monthScrollContainer.value
      : dayScrollContainer.value;
  const items =
    type === "year"
      ? yearitemsDom.value
      : type === "month"
      ? monthitemsDom.value
      : dayitemsDom.value;

  if (container && items.length > 0) {
    const itemHeight = items[0].offsetHeight;
    const index = Math.round(container.scrollTop / itemHeight) + 2;
    if (type === "year") selectedYear.value = index;
    else if (type === "month") selectedMonth.value = index;
    else selectedDay.value = index;
    layout(type);
  }
};

const emitDate = () => {
  const date = `${years[selectedYear.value]}-${months[selectedMonth.value]}-${
    days[selectedDay.value]
  }`;
  emit("sendDate", date);
};

const cancel = () => {
  emit("cancel", false);
};

const initializeScroll = (container, selectedIndex) => {
  if (container.value) {
    const itemHeight = container.value.children[0].offsetHeight;
    container.value.scrollTop = (selectedIndex - 2) * itemHeight;
  }
};

onMounted(() => {
  nextTick(() => {
    yearitemsDom.value = document.querySelectorAll(".year-item");
    monthitemsDom.value = document.querySelectorAll(".month-item");
    dayitemsDom.value = document.querySelectorAll(".day-item");

    initializeScroll(yearScrollContainer, selectedYear.value);
    initializeScroll(monthScrollContainer, selectedMonth.value);
    initializeScroll(dayScrollContainer, selectedDay.value);

    layout("year");
    layout("month");
    layout("day");
  });
});
</script>

<template>
  <div class="scroll-container">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rem;
      "
    >
      <div style="color: #999999; font-size: 28rem" @click="cancel">取消</div>
      <div style="font-size: 36rem; color: rgba(0, 0, 0, 0.9)">选择日期</div>
      <div style="color: rgba(0, 82, 217, 1); font-size: 28rem" @click="emitDate">
        确定
      </div>
    </div>
    <div class="scroll-container-view">
      <div class="select-item-container"></div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('year')"
        ref="yearScrollContainer"
      >
        <div v-for="(item, index) in years" :key="`year-${index}`" class="year-item">
          {{ item }}
        </div>
      </div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('month')"
        ref="monthScrollContainer"
      >
        <div v-for="(item, index) in months" :key="`month-${index}`" class="month-item">
          {{ item }}
        </div>
      </div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('day')"
        ref="dayScrollContainer"
      >
        <div v-for="(item, index) in days" :key="`day-${index}`" class="day-item">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  width: 100%;
  padding: 24rem;
  user-select: none;
}
.scroll-container-view {
  width: 100%;
  height: 400rem;
  position: relative;
  display: flex;
}
.select-item-container {
  background-color: #f3f3f3;
  top: 160rem;
  position: absolute;
  width: 100%;
  height: 80rem;
  border-radius: 20rem;
  z-index: 1;
  pointer-events: none; /* 防止干扰滚动 */
}
.year-item,
.month-item,
.day-item {
  text-align: center;
  border-radius: 20rem;
  height: 80rem;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  font-size: 32rem; /* 增大字体大小 */
}
.scroll-container-items {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  z-index: 2;
  height: 400rem;
  position: relative;
  flex: 1;
  scroll-behavior: smooth; /* 添加平滑滚动 */
}
.scroll-container-items::-webkit-scrollbar {
  display: none;
}
</style>
