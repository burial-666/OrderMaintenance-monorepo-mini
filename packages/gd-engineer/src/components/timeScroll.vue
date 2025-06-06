<script setup>
import { ref, onMounted, nextTick, defineEmits } from "vue";

const hourItemsDom = ref([]);
const minuteItemsDom = ref([]);
const selectedHour = ref(4);
const selectedMinute = ref(2);
const hourScrollContainer = ref(null);
const minuteScrollContainer = ref(null);

const emit = defineEmits(["sendTime", "cancel"]);

// 生成小时和分钟数据
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
// const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const minutes = ["00"];
// 在数组前后添加空字符串用于滚动效果
const Hours = ["", "", ...hours, "", ""];
const Minutes = ["", "", ...minutes, "", ""];

const layout = (type) => {
  const items = type === "hour" ? hourItemsDom.value : minuteItemsDom.value;
  const selected = type === "hour" ? selectedHour.value : selectedMinute.value;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dis = Math.abs(i - selected);

    if (dis === 0) {
      item.classList.add("selected");
      item.style.opacity = 1;
    } else {
      item.classList.remove("selected");
      item.style.opacity = 0.2; // 统一设置未选中项的透明度
    }
  }
};

const handleScroll = (type) => {
  const container =
    type === "hour" ? hourScrollContainer.value : minuteScrollContainer.value;
  const items = type === "hour" ? hourItemsDom.value : minuteItemsDom.value;

  if (container && items.length > 0) {
    const itemHeight = items[0].offsetHeight;
    const index = Math.round(container.scrollTop / itemHeight) + 2;
    if (type === "hour") selectedHour.value = index;
    else selectedMinute.value = index;
    layout(type);
  }
};

const emitTime = () => {
  const time = `${Hours[selectedHour.value]}:${Minutes[selectedMinute.value]}`;
  emit("sendTime", time);
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
    hourItemsDom.value = document.querySelectorAll(".hour-item");
    minuteItemsDom.value = document.querySelectorAll(".minute-item");

    initializeScroll(hourScrollContainer, selectedHour.value);
    initializeScroll(minuteScrollContainer, selectedMinute.value);

    layout("hour");
    layout("minute");
  });
});
</script>

<template>
  <div class="scroll-container">
    <div class="header">
      <div class="cancel" @click="cancel">取消</div>
      <div class="title">选择时间</div>
      <div class="confirm" @click="emitTime">确认</div>
    </div>
    <div class="scroll-container-view">
      <div class="select-item-container"></div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('hour')"
        ref="hourScrollContainer"
      >
        <div
          v-for="(item, index) in Hours"
          :key="`hour-${index}`"
          class="time-item hour-item"
        >
          {{ item }}{{ item ? "点" : "" }}
        </div>
      </div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('minute')"
        ref="minuteScrollContainer"
      >
        <div
          v-for="(item, index) in Minutes"
          :key="`minute-${index}`"
          class="time-item minute-item"
        >
          {{ item }}{{ item ? "分" : "" }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  width: 100%;
  background-color: white;
  border-radius: 16rem 16rem 0 0;
  padding: 32rem 24rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rem;
}

.cancel {
  color: rgba(153, 153, 153, 1);
  font-size: 32rem;
}

.title {
  font-size: 34rem;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 500;
}

.confirm {
  color: rgba(0, 82, 217, 1);
  font-size: 32rem;
}

.scroll-container-view {
  width: 100%;
  height: 400rem;
  position: relative;
  display: flex;
  justify-content: center;
}

.select-item-container {
  background-color: rgba(245, 245, 245, 1);
  top: 160rem;
  position: absolute;
  width: 100%;
  height: 80rem;
  z-index: 1;
  pointer-events: none;
}

.time-item {
  text-align: center;
  height: 80rem;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  font-size: 34rem;
  color: rgba(0, 0, 0, 0.9);
  transition: opacity 0.2s; /* 添加过渡效果 */
}

.scroll-container-items {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  z-index: 2;
  height: 400rem;
  position: relative;
  flex: 1;
  scroll-behavior: smooth;
}

.scroll-container-items::-webkit-scrollbar {
  display: none;
}

/* 未选中的时间项样式 */
.time-item:not(.selected) {
  opacity: 0.2;
  color: rgba(0, 0, 0, 0.9);
}

/* 选中项的样式 */
.time-item.selected {
  opacity: 1;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 500;
}
</style>
