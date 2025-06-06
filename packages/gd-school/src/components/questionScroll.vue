<script setup>
import { ref, onMounted, defineEmits, nextTick } from "vue";
import { getquestionsListApi } from "../api/work.js";

const itemsDom = ref([]);
const selectedQuestion = ref(2);
const emit = defineEmits(["sendQuestion", "cancel"]);
const scrollContainer = ref(null);

const emitQuestion = () => {
  if (items.value && items.value[selectedQuestion.value]) {
    const selectedItem = items.value[selectedQuestion.value];
    emit(
      "sendQuestion",
      selectedItem.group_id,
      selectedItem.ID,
      selectedItem.content,
      false
    );
  } else {
    console.error("没有选中有效的工程师");
  }
};

const layout = () => {
  const opacityStep = 0.4;
  for (let i = 0; i < itemsDom.value.length; i++) {
    const item = itemsDom.value[i];
    const dis = Math.abs(i - selectedQuestion.value);
    item.style.opacity = opacityStep ** dis;
  }
};

const items = ref([]);

const handleScroll = () => {
  if (scrollContainer.value && itemsDom.value.length > 0) {
    const itemHeight = itemsDom.value[0].offsetHeight;
    const index = Math.round(scrollContainer.value.scrollTop / itemHeight) + 2;
    selectedQuestion.value = index;
    layout();
  }
};

const getquestionsList = async () => {
  const res = await getquestionsListApi(1, 100);
  if (res && res.data && res.data.data) {
    items.value = [
      { content: "" },
      { content: "" },
      ...res.data.data,
      { content: "" },
      { content: "" },
    ];
    nextTick(() => {
      itemsDom.value = document.querySelectorAll(".item");
      layout();
    });
  } else {
    console.error("获取用户列表失败：无效的响应数据");
  }
};
const cancel = () => {
  emit("cancel", false);
};
onMounted(() => {
  getquestionsList();
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
      <div style="font-size: 36rem; color: rgba(0, 0, 0, 0.9)">选择问题类型</div>
      <div style="color: rgba(0, 82, 217, 1); font-size: 28rem" @click="emitQuestion">
        确定
      </div>
    </div>
    <div class="scroll-container-view">
      <div class="select-item-container"></div>
      <div class="scroll-container-items" @scroll="handleScroll" ref="scrollContainer">
        <div v-for="(item, index) in items" :key="index" class="item">
          {{ item.content }}
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
}
.select-item-container {
  background-color: #f3f3f3;
  top: 160rem;
  position: absolute;
  width: 100%;
  height: 80rem;
  border-radius: 20rem;
  z-index: 1;
}
.item {
  text-align: center;
  border-radius: 20rem;
  height: 80rem;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
.scroll-container-items {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  z-index: 2;
  height: 400rem;
  position: relative;
  scroll-behavior: smooth; /* 添加平滑滚动 */
}
.scroll-container-items::-webkit-scrollbar {
  display: none;
}
</style>
