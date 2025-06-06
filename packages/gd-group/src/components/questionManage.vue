<script setup>
import { ref, onMounted } from "vue";
import {
  getquestionsListApi,
  deletequestionApi,
  createquestionApi,
} from "../api/work.js";
import { useRouter, useRoute } from "vue-router";
import useLoginStore from "../store/login.js";
const groupid = useLoginStore().group_id;
const questionsList = ref([]);
const questionContent = ref("");
const isoverlay = ref(false);
const group_name = ref("");
const activeIndex = ref(0);
const message = ref("");
const selectdeQuestion = ref(0);
const route = useRoute();
const router = useRouter();
const getQuestionsList = async () => {
  const res = await getquestionsListApi(1, 10, groupid);
  questionsList.value = res.data.data;
  if (!questionsList.value) {
    return;
  }
  group_name.value = res.data.data[0].group_name;
};
const deleteQuestion = async (id) => {
  if (questionsList.value.length <= 1) {
    showPopup("至少要保留一个问题");
    return;
  }
  await deletequestionApi(id);
  showPopup("删除成功");
  getQuestionsList();
};
const createQuestion = async () => {
  if (!questionsList.value) {
    let data = {
      content: questionContent.value,
      group_id: groupid,
    };
    await createquestionApi(data);
    getQuestionsList();
    questionContent.value = "";
    return;
  }
  if (questionsList.value.length >= 5) {
    showPopup("最多只能创建5个问题");
    return;
  }
  let data = {
    content: questionContent.value,
    group_id: groupid,
  };
  await createquestionApi(data);
  getQuestionsList();
  questionContent.value = "";
};
const ismove = ref(false);
onMounted(() => {
  getQuestionsList();
});
const showPopup = (val) => {
  message.value = val;
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
};
</script>
<template>
  <div class="top-navbar">
    <img
      src="../static/back.svg"
      style="width: 16rem; height: 26rem"
      @click="() => router.back()"
    />
    <div class="navbar-title">问题管理</div>
  </div>
  <div class="questionManage">
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div
      style="
        font-size: 48rem;
        font-weight: 700;
        color: rgba(37, 37, 37, 1);
        margin-bottom: 36rem;
      "
    >
      {{ group_name }}
    </div>
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
    <div class="popup" v-if="isoverlay">
      <div style="width: 100%" v-if="activeIndex === 0">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          添加问题描述
        </div>
        <div style="padding: 16rem; position: relative">
          <textarea
            style="
              resize: none;
              width: 88%;
              height: 232rem;
              outline: none;
              padding: 16rem;
              border-radius: 12rem;
              background: rgba(245, 245, 245, 1);
              border: none;
              font-size: 24rem;
            "
            maxlength="20"
            placeholder="请输入"
            v-model="questionContent"
          ></textarea>
          <span
            style="
              font-size: 24rem;
              color: rgba(153, 1);
              margin-left: auto;
              position: absolute;
              right: 96rem;
              bottom: 30rem;
            "
            >{{ questionContent.length }} / 20</span
          >
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
              {
                showPopup('创建成功'), createQuestion(), (isoverlay = false);
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
      <div style="width: 100%" v-if="activeIndex === 1">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          你确定要删除该问题吗？
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
              {
                deleteQuestion(selectdeQuestion), (isoverlay = false);
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
    <div class="question-container">
      <div
        class="question-container-item"
        v-for="(item, index) in questionsList"
        :key="index"
      >
        <div>{{ item.content }}</div>
        <img
          src="../static/Remove circle.svg"
          style="
            width: 48rem;
            height: 48rem;
            position: absolute;
            top: 50%;
            right: 5%;
            transform: translate(0, -50%);
            cursor: pointer;
          "
          v-if="ismove"
          @click="
            () => {
              (selectdeQuestion = item.ID), (activeIndex = 1), (isoverlay = true);
            }
          "
        />
      </div>
      <div
        class="add-question-container-item"
        @click="
          () => {
            (activeIndex = 0), (isoverlay = true);
          }
        "
      ></div>
    </div>
    <div
      style="
        width: 90%;
        height: 96rem;
        border-radius: 12rem;
        background: rgba(19, 86, 235, 1);
        position: fixed;
        bottom: 32rem;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        font-size: 32rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      @click="ismove = !ismove"
    >
      {{ ismove ? "取消编辑" : "编辑" }}
    </div>
  </div>
</template>

<style scoped>
.top-navbar {
  background-color: #fff;
  height: 92rem;
  display: flex;
  align-items: center;
  padding: 0 32rem;
  position: relative;
}
.navbar-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 36rem;
}
.questionManage {
  width: 100%;
  min-height: calc(100vh - 92rem);
  padding: 36rem 48rem;
  background-color: #f5f5f5;
  position: relative;
}
.question-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32rem;
  max-height: 70%;
  overflow-y: auto;
}
.question-container-item {
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  height: 80rem;
  border-radius: 64rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 32rem;
  font-weight: 700;
  padding: 16rem 32rem;
  color: rgba(65, 65, 65, 1);
  position: relative;
}
.add-question-container-item {
  width: 100%;
  flex: 0 0 auto;
  background: rgba(217, 217, 217, 1);
  height: 80rem;
  border-radius: 64rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 32rem;
  font-weight: 700;
  padding: 16rem 32rem;
  color: rgba(65, 65, 65, 1);
  position: relative;
}
.add-question-container-item::before {
  content: "+";
  font-size: 48rem;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.message {
  position: fixed;
  width: 240rem;
  height: 220rem;
  background: rgba(0, 0, 0, 0.8);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24rem;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s;
}
.show {
  visibility: visible;
  opacity: 1;
}
</style>
