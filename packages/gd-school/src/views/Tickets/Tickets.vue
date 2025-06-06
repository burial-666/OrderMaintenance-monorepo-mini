<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getquestionsListApi } from "../../api/work.js";
const router = useRouter();
const activeIndex = ref(1);
const route = useRoute();
const questionList = ref([]);
const isoverlay = ref(false);
const selectedQuestionsId = ref("");
const handleClick = (index) => {
  activeIndex.value = index;
  if (index === 1) {
    router.push("/Tickets/intelligent");
  } else if (index === 2) {
    router.push("/Tickets/myTickets");
  }
};
const check = () => {
  if (route.path === "/Tickets/intelligent") {
    activeIndex.value = 1;
  } else if (route.path === "/Tickets/myTickets") {
    activeIndex.value = 2;
  }
};
const updateOverlay = (value) => {
  isoverlay.value = value;
};
watch(
  route,
  (newRoute) => {
    check();
  },
  { immediate: true }
);
//获得问题列表数据
const selectedQuestions = ref([]);
const getquestionsListData = async () => {
  const res = await getquestionsListApi(1, 10);
  questionList.value = res.data.data;
  selectedQuestions.value = new Array(questionList.value.length).fill(false);
};
const showQuestionsData = async () => {
  const selectedQuestionsIds = questionList.value.filter(
    (question, index) => selectedQuestions.value[index]
  );
  selectedQuestionsId.value = selectedQuestionsIds[0];
};
onMounted(() => {
  getquestionsListData();
});
</script>
<template>
  <div class="frame" style="font-size: 36rem">
    <div class="overlay" v-if="isoverlay" @click="updateOverlay(false)"></div>
    <div class="popup" v-if="isoverlay">
      <div style="width: 100%">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 108rem;
          "
        >
          问题描述
        </div>
        <div style="padding: 36rem 48rem">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 60rem;
            "
            v-for="(item, index) in questionList"
          >
            <div style="font-size: 32rem; font-weight: 500">{{ item.content }}</div>
            <div style="display: flex; gap: 24rem; align-items: center">
              <div
                style="
                  background-color: #1356eb;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 48rem;
                  width: 102rem;
                  border-radius: 16rem;
                  cursor: pointer;
                  font-size: 24rem;
                "
                v-if="item.role_id === 1"
              >
                工程师
              </div>
              <label
                style="
                  display: block;
                  width: 40rem;
                  height: 40rem;
                  border-radius: 50%;
                  border: 1px solid #ccc;
                "
                :class="{ 'select-circle-active': selectedQuestions[index] }"
              >
                <input
                  type="checkbox"
                  style="display: none"
                  v-model="selectedQuestions[index]"
                />
              </label>
            </div>
          </div>
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="display: flex; cursor: pointer">
          <div
            style="
              width: 50%;
              height: 84rem;
              border-right: 1px solid #ccc;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #1356eb;
            "
            @click="
              () => {
                showQuestionsData(), updateOverlay(false);
              }
            "
          >
            确认
          </div>
          <div
            style="
              width: 50%;
              height: 84rem;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
    </div>
    <router-view :question="selectedQuestionsId" />
    <div class="nav">
      <div
        class="nav-item1"
        :class="{ 'item1-active': activeIndex === 1 }"
        @click="handleClick(1)"
      ></div>
      <div
        class="nav-item2"
        :class="{ 'item2-active': activeIndex === 2 }"
        @click="handleClick(2)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@import "./index.css";
.popup {
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  border-radius: 24rem;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.select-circle-active {
  background-color: #1356eb;
  position: relative; /* 添加定位属性 */
  border: 0.01px solid #1356eb;
}
input[type="checkbox"] {
  position: relative;
  width: 80rem;
  height: 40rem;
  -webkit-appearance: none;
  background: #c6c6c6;
  outline: none;
  border-radius: 40rem;
  transition: background 0.3s;
  cursor: pointer;
  margin-left: 16rem;
}

input[type="checkbox"]:checked {
  background: #3b82f6;
}
.select-circle-active::after {
  content: "✔";
  color: white;
  font-size: 25rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
