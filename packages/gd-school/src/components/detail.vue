<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getWorkDetailApi,
  deleteWorkApi,
  getWorkLogsListApi,
  getPhoneAndNameApi,
} from "../api/work.js";
const route = useRoute();
const router = useRouter();
const workid = route.query.id;
//获取工单信息
const detailData = ref({});
const getWorkDetailData = async () => {
  const res = await getWorkDetailApi(workid);
  detailData.value = res.data;
};
//撤销工单
const deleteWorkData = async () => {
  const res = await deleteWorkApi(workid);
};
//获取工单日志记录
const workLogsList = ref([]);
const getWorkLogsListData = async () => {
  const res = await getWorkLogsListApi(workid);
  workLogsList.value = res.data;
};
//获得工单负责人姓名和电话
const getPhoneAndNameData = async () => {
  if (detailData.value.status === 0 || detailData.value.status === 1) {
    return;
  }
  const res = await getPhoneAndNameApi(workid);
  Object.assign(detailData.value, res.data);
};
//预览图片
const previewImage = ref(null);
const showPreview = ref(false);
const openPreview = (image) => {
  previewImage.value = image;
  showPreview.value = true;
};
const closePreview = () => {
  showPreview.value = false;
};
//弹窗
const isoverlay = ref(false);
const message = ref("");
const showPopup = (val) => {
  message.value = val;
  isoverlay.value = false;
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");

  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
  setTimeout(() => {
    router.push("/Tickets/myTickets");
  }, 1400);
};
onMounted(async () => {
  getWorkLogsListData();
  await getWorkDetailData();
  getPhoneAndNameData();
});
</script>
<template>
  <div class="top-navbar">
    <img
      src="../static/back.svg"
      style="width: 16rem; height: 26rem"
      @click="() => router.back()"
    />
    <div class="navbar-title">工单详情</div>
  </div>
  <div class="frame">
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div class="popup" v-if="isoverlay">
      <div style="width: 100%"></div>
      <div
        style="
          width: 100%;
          height: 108rem;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        你确定要删除工单吗？
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
              showPopup('删除成功'), deleteWorkData();
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
    <div class="container" style="margin-bottom: 40rem">
      <div class="item">
        <div class="text-left">工单编号</div>
        <div class="text-right">{{ detailData.order_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">工单状态</div>
        <div class="text-right" style="display: flex; align-items: center; gap: 16rem">
          <div
            class="status-circle"
            v-if="detailData.status === 0"
            style="background-color: #faad0f"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 1"
            style="background-color: #ff4d50"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 2"
            style="background-color: #1790ff"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 3"
            style="background-color: #1356eb"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 4"
            style="background-color: #fa800f"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 5"
            style="background-color: #53c31a"
          ></div>
          <span v-if="detailData.status === 0">待分配</span>
          <span v-else-if="detailData.status === 1">待接单</span>
          <span v-else-if="detailData.status === 2">已接单</span>
          <span v-else-if="detailData.status === 3">已到达</span>
          <span v-else-if="detailData.status === 4">挂单中</span>
          <span v-else-if="detailData.status === 5">已完成</span>
        </div>
      </div>
      <div class="item">
        <div class="text-left">问题描述</div>
        <div class="text-right">{{ detailData.problem_content }}</div>
      </div>
      <div class="item">
        <div class="text-left">所属组别</div>
        <div class="text-right">{{ detailData.group_name }}</div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div class="text-left">问题详细</div>
        <div class="text-right">
          {{ detailData.details }}
        </div>
      </div>
      <div class="picture-item">
        <div class="picture-container-wrap">
          <div class="picture-container" v-for="img in detailData.photos">
            <img :src="img.url" @click="openPreview(img.url)" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="text-left">提交人</div>
        <div class="text-right">{{ detailData.name }}</div>
      </div>
      <div class="item">
        <div class="text-left">联系方式</div>
        <div class="text-right">{{ detailData.phone_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">地点</div>
        <div class="text-right">{{ detailData.location }}</div>
      </div>
      <div class="item">
        <div class="text-left">提交时间</div>
        <div class="text-right">
          {{ new Date(detailData.CreatedAt).toLocaleString() }}
        </div>
      </div>
    </div>
    <div class="container">
      <div class="item" v-if="detailData.status !== 0 && detailData.status !== 1">
        <div class="text-left">工程师</div>
        <div class="text-right">{{ detailData.engineer_name }}</div>
      </div>
      <div class="item" v-if="detailData.status !== 0 && detailData.status !== 1">
        <div class="text-left">联系方式</div>
        <div class="text-right">{{ detailData.engineer_phone_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">进度</div>
      </div>
      <div class="order-container">
        <div class="order-container-item" v-for="(item, index) in workLogsList">
          <div class="order-left">
            <div class="circle" v-if="index !== workLogsList.length - 1"></div>
            <div
              class="circle"
              style="background-color: #1356eb; margin-top: 28rem"
              v-if="index === workLogsList.length - 1"
            ></div>
            <div class="line" v-if="index !== workLogsList.length - 1"></div>
          </div>
          <div class="order-right">
            <div class="order-status">
              {{ item.work_order_status_log.operation }}
            </div>
            <div
              class="picture-container-wrap"
              style="justify-content: flex-start"
              v-if="item.photos.length > 0"
            >
              <div class="picture-container" v-for="img in item.photos" :key="img.id">
                <img :src="img.url" @click="openPreview(img.url)" />
              </div>
            </div>
            <div class="order-time">{{ item.work_order_status_log.change_time }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      style="
        margin: 32rem 0;
        width: cacl(100% - 64rem);
        height: 96rem;
        background: rgba(19, 86, 235, 1);
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12rem;
        cursor: pointer;
      "
      @click="isoverlay = true"
      v-if="detailData.status !== 5"
    >
      撤回
    </div>
    <div v-if="showPreview" class="preview-overlay" @click="closePreview">
      <div class="preview-container">
        <img :src="previewImage" class="preview-image" />
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
.text-right > span {
  font-size: 28rem;
  font-weight: 400;
  color: rgba(37, 37, 37, 1);
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
  flex: 0 0 auto;
  border-radius: 50%;
  background-color: #fff;
  border: 2rem solid #1356eb;
}
.line {
  width: 1px;
  height: 100%;
  background-color: #1356eb;
}
.status-circle {
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
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
</style>
