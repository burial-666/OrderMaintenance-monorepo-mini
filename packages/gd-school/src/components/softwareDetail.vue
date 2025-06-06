<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { getSoftwareDetailApi } from "../api/work.js";
const detailData = ref({});
const getSoftwareDetail = async (id) => {
  const res = await getSoftwareDetailApi(id);
  detailData.value = res.data;
};
const router = useRouter();
const route = useRoute();
onMounted(() => {
  const id = route.query.id;
  getSoftwareDetail(id);
});
</script>
<template>
  <div class="top-navbar">
    <img
      src="../static/back.svg"
      style="width: 16rem; height: 26rem"
      @click="() => router.back()"
    />
    <div class="navbar-title">软件安装申请详细详情</div>
  </div>
  <div class="frame">
    <div class="container" style="margin-bottom: 40rem">
      <div class="item">
        <div class="text-left">教师姓名</div>
        <div class="text-right">{{ detailData.teacherName }}</div>
      </div>
      <div class="item">
        <div class="text-left">教师工号</div>
        <div class="text-right">{{ detailData.teacherNumber }}</div>
      </div>
      <div class="item">
        <div class="text-left">联系电话</div>
        <div class="text-right">{{ detailData.contactPhone }}</div>
      </div>
      <div class="item">
        <div class="text-left">学院部门</div>
        <div class="text-right">{{ detailData.department }}</div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div class="text-left">课程名称</div>
        <div class="text-right">
          {{ detailData.courseName }}
        </div>
      </div>
      <div class="item">
        <div class="text-left">所安装房间名称</div>
        <div class="text-right">{{ detailData.classroomName }}</div>
      </div>
      <div class="item">
        <div class="text-left">安装机数</div>
        <div class="text-right">{{ detailData.installCount }}</div>
      </div>
      <div class="item">
        <div class="text-left">软件名称及版本</div>
        <div class="text-right">{{ detailData.softwareVersion }}</div>
      </div>
      <div class="item">
        <div class="text-left">软件用途</div>
        <div class="text-right">{{ detailData.description }}</div>
      </div>
      <div class="item">
        <div class="text-left">申请人</div>
        <div class="text-right">{{ detailData.applicant }}</div>
      </div>
      <div class="item">
        <div class="text-left">更新时间</div>
        <div class="text-right">
          {{ new Date(detailData.updatedAt).toLocaleString() }}
        </div>
      </div>
    </div>
    <div class="button-container">
      <div
        class="button-item"
        style="background-color: #1356eb; color: #fff"
        v-if="detailData.status === 1"
      >
        已获批
      </div>
      <div
        class="button-item"
        style="background-color: #b6b6b6; color: #fff"
        v-if="detailData.status === 2"
      >
        未获批
      </div>
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
.frame {
  width: 100%;
  min-height: calc(100vh - 92rem);
  padding: 24rem 32rem;
  background-color: #f5f5f5;
  position: relative;
}
.engineers {
  width: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
.container {
  width: 100%;
  background-color: #fff;
  border-radius: 16rem;
  display: flex;
  flex-direction: column;
  gap: 24rem;
  padding: 24rem 32rem;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.select-circle {
  width: 40rem;
  height: 40rem;
  border: 3rem solid #999999;
  border-radius: 50%;
}
.select-circle-active {
  background-color: #1356eb;
  position: relative; /* 添加定位属性 */
  border: 0.01px solid #1356eb;
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
.text-left {
  font-size: 28rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.text-right {
  font-size: 28rem;
  font-weight: 400;
  color: rgba(37, 37, 37, 1);
  max-width: 400rem;
  text-align: left;
}
.picture-item {
  margin-left: auto;
}
.picture-container-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 340rem;
  gap: 24rem;
}
.picture-container {
  width: 152rem;
  height: 152rem;
}
.picture-container img {
  width: 100%;
  height: 100%;
  border-radius: 16rem;
  object-fit: cover;
}
.order-container {
  display: flex;
  flex-direction: column;
  gap: 24rem;
}
.order-container-item {
  display: flex;
  margin-left: 80rem;
  gap: 24rem;
}
.order-left {
  display: flex;
  flex-direction: column;
  gap: 12rem;
  align-items: center;
}
.circle {
  width: 16rem;
  height: 16rem;
  border-radius: 50%;
  background-color: #fff;
  border: 2rem solid #1356eb;
  flex: 0 0 auto;
}
.line {
  width: 1px;
  height: 100%;
  background-color: #1356eb;
}
.order-right {
  display: flex;
  flex-direction: column;
  gap: 12rem;
  align-items: flex-start;
}
.order-status {
  text-align: left;
  font-size: 28rem;
  font-weight: 400;
}
.order-time {
  text-align: left;
  font-size: 20rem;
  font-weight: 400;
  color: rgba(153, 1);
}
.button-container {
  margin-top: 64rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rem;
}
.button-item {
  width: 100%;
  height: 96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16rem;
  cursor: pointer;
}
.confirm {
  width: 100%;
}
.status-circle {
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
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
input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 4rem;
  left: 4rem;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  transition: 0.3s;
  background: #fff;
}

input[type="checkbox"]:checked::before {
  left: 44rem;
}
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-container {
  max-width: 90%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
