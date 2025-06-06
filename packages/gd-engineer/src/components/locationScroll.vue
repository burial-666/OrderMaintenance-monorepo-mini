<script setup>
import { ref, onMounted, nextTick, defineEmits } from "vue";

const frontItemsDom = ref([]);
const backItemsDom = ref([]);
const selectedFront = ref(4);
const selectedBack = ref(4);
const frontScrollContainer = ref(null);
const backScrollContainer = ref(null);

const emit = defineEmits(["sendLocation", "cancel"]);

// 前排和后排的数据
const Front = ["", "", "C1", "C2", "C3", "C4", "C5", "", ""];
const Back = [
  "",
  "",
  "357",
  "358",
  "359",
  "360",
  "361",
  "362",
  "364",
  "365",
  "367",
  "426",
  "427",
  "428",
  "429",
  "431",
  "441",
  "457",
  "458",
  "459",
  "460",
  "461",
  "462",
  "466",
  "468",
  "558",
  "559",
  "560",
  "561",
  "",
  "",
];

const layout = (type) => {
  const opacityStep = 0.4;
  const items = type === "front" ? frontItemsDom.value : backItemsDom.value;
  const selected = type === "front" ? selectedFront.value : selectedBack.value;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dis = Math.abs(i - selected);
    item.style.opacity = opacityStep ** dis;
  }
};

const handleScroll = (type) => {
  const container =
    type === "front" ? frontScrollContainer.value : backScrollContainer.value;
  const items = type === "front" ? frontItemsDom.value : backItemsDom.value;

  if (container && items.length > 0) {
    const itemHeight = items[0].offsetHeight;
    const index = Math.round(container.scrollTop / itemHeight) + 2;
    if (type === "front") selectedFront.value = index;
    else selectedBack.value = index;
    layout(type);
  }
};

const emitLocation = () => {
  const location = `${Front[selectedFront.value]}-${Back[selectedBack.value]}`;
  emit("sendLocation", location);
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
    frontItemsDom.value = document.querySelectorAll(".front-item");
    backItemsDom.value = document.querySelectorAll(".back-item");

    initializeScroll(frontScrollContainer, selectedFront.value);
    initializeScroll(backScrollContainer, selectedBack.value);

    layout("front");
    layout("back");
  });
});
</script>

<template>
  <div class="scroll-container">
    <div class="header">
      <div class="cancel" @click="cancel">取消</div>
      <div class="title">选择位置</div>
      <div class="confirm" @click="emitLocation">确定</div>
    </div>
    <div class="scroll-container-view">
      <div class="select-item-container"></div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('front')"
        ref="frontScrollContainer"
      >
        <div
          v-for="(item, index) in Front"
          :key="`front-${index}`"
          class="location-item front-item"
        >
          {{ item }}
        </div>
      </div>
      <div
        class="scroll-container-items"
        @scroll="handleScroll('back')"
        ref="backScrollContainer"
      >
        <div
          v-for="(item, index) in Back"
          :key="`back-${index}`"
          class="location-item back-item"
        >
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rem;
}

.cancel {
  color: #999999;
  font-size: 28rem;
}

.title {
  font-size: 36rem;
  color: rgba(0, 0, 0, 0.9);
}

.confirm {
  color: rgba(0, 82, 217, 1);
  font-size: 28rem;
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
  pointer-events: none;
}

.location-item {
  text-align: center;
  border-radius: 20rem;
  height: 80rem;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  font-size: 32rem;
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
</style>
