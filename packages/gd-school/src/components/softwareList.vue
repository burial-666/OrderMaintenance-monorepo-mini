<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getSoftwareApi } from "../api/work.js";
import useLoginStore from "../store/login.js";
const router = useRouter();
const route = useRoute();
//分页查询
const page = ref(1);
const pageSize = ref(10);
const sofeList = ref([]);
const tempSofeList = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const getSofeList = async (reset = false) => {
  if (loading.value || (!hasMore.value && !reset)) return;

  if (reset) {
    page.value = 1;
    sofeList.value = [];
    hasMore.value = true;
  }
  loading.value = true;
  const user_name_or_contact_phone = useLoginStore().name;
  const res = await getSoftwareApi(
    page.value,
    pageSize.value,
    user_name_or_contact_phone
  );
  if (res.data.data.length > 0) {
    if (activeIndex.value === 0) {
      tempSofeList.value = res.data.data.filter((item) => item.status === 1);
    } else if (activeIndex.value === 1) {
      tempSofeList.value = res.data.data.filter((item) => item.status === 2);
    }
    sofeList.value = [...sofeList.value, ...tempSofeList.value];
    page.value++;
  } else {
    hasMore.value = false;
  }
  loading.value = false;
};
//省略字符串
const truncateText = (text, maxlength) => {
  if (text.length > maxlength) {
    return text.substring(0, maxlength) + "...";
  }
  return text;
};
//获取不同状态的工单列表
const activeIndex = ref(0);
const JudgeStatusAndChange = (index) => {
  if (activeIndex.value === index) return;
  activeIndex.value = index;
};
//滚动加载
const handleScroll = (event) => {
  const container = event.target;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollThreshold = container.scrollHeight - 100; // 提前100像素触发加载

  if (scrollPosition >= scrollThreshold && !loading.value && hasMore.value) {
    getSofeList();
  }
};
const loadingText = computed(() => {
  if (loading.value) return "加载中...";
  if (!hasMore.value) return "没有更多数据了";
  return "";
});
onMounted(() => {
  getSofeList(true);
});
watch(
  () => activeIndex.value,
  () => {
    getSofeList(true);
  }
);
const gotoDetail = (id) => {
  router.push(`/softwareDetail?id=${id}`);
};
//添加复制到剪贴板的方法
const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
  showPopup("复制成功");
  // 这里可以添加复制成功的提示
};
</script>
<template>
  <div class="top-navbar">
    <img
      src="../static/back.svg"
      style="width: 16rem; height: 26rem"
      @click="() => router.back()"
    />
    <div class="navbar-title">我的软件安装申请</div>
  </div>
  <div class="frame">
    <div class="label">
      <div
        class="label-item"
        :class="{ 'label-item-active': activeIndex === 0 }"
        @click="JudgeStatusAndChange(0)"
      >
        已获批
      </div>
      <div
        class="label-item"
        :class="{ 'label-item-active': activeIndex === 1 }"
        @click="JudgeStatusAndChange(1)"
      >
        未获批
      </div>
    </div>
    <div class="list-container" @scroll="handleScroll">
      <div class="list-item" v-for="item in sofeList" :key="item.ID">
        <div class="line1">
          <div class="line1-left" style="font-weight: 700; color: rgba(65, 65, 65, 1)">
            <span style="font-size: 28rem">所属学院：</span>
            <span style="font-size: 28rem">{{ item.department }}</span>
          </div>
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div class="line2">
          <div
            style="
              font-size: 28rem;
              color: rgba(65, 65, 65, 1);
              font-weight: 700;
              text-align: left;
            "
          >
            {{ truncateText(item.softwareVersion, 15) }}
          </div>
          <div
            style="
              font-size: 24rem;
              font-weight: 400;
              text-align: left;
              color: rgba(153, 153, 153, 1);
              margin-bottom: 32rem;
            "
          >
            {{ item.createdAt }}
          </div>
          <div style="display: flex; width: 100%; margin-bottom: 16rem">
            <div
              style="color: rgba(153, 153, 153, 1); font-size: 24rem; font-weight: 400"
            >
              教师姓名
            </div>
            <div
              style="
                color: rgba(65, 65, 65, 1);
                font-size: 24rem;
                font-weight: 400;
                margin-left: 32rem;
              "
            >
              {{ item.teacherName }}
            </div>
          </div>
          <div
            style="display: flex; width: 100%; align-items: center; margin-bottom: 16rem"
          >
            <div
              style="color: rgba(153, 153, 153, 1); font-size: 24rem; font-weight: 400"
            >
              联系方式
            </div>
            <div
              style="
                color: rgba(65, 65, 65, 1);
                font-size: 24rem;
                font-weight: 400;
                margin-left: 32rem;
              "
            >
              {{ item.contactPhone }}
            </div>
            <img
              src="../static/Content copy.svg"
              style="width: 24rem; height: 24rem; margin-left: 32rem; cursor: pointer"
              @click="copyToClipboard(item.contactPhone)"
              v-if="item.contactPhone"
            />
          </div>
          <div style="display: flex; width: 100%; align-items: center">
            <div
              style="color: rgba(153, 153, 153, 1); font-size: 24rem; font-weight: 400"
            >
              更新时间
            </div>
            <div
              style="
                color: rgba(65, 65, 65, 1);
                font-size: 24rem;
                font-weight: 400;
                margin-left: 32rem;
              "
            >
              {{ item.updatedAt }}
            </div>
          </div>
          <div
            style="
              margin-left: auto;
              width: 128rem;
              height: 44rem;
              font-size: 24rem;
              font-weight: 400;
              color: #fff;
              border-radius: 32rem;
              background-color: #1856eb;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            "
            @click="gotoDetail(item.id)"
          >
            查看详细
          </div>
        </div>
      </div>
      <div v-if="loadingText" class="loading-text">{{ loadingText }}</div>
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
  padding: 24rem 32rem;
  background-color: #f5f5f5;
  min-height: calc(100vh - 92rem);
  height: calc(100vh - 112rem);
  overflow-y: hidden;
}
.search {
  width: 100%;
  height: 80rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rem;
}
.search-container {
  width: 544rem;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 36rem;
}
input::placeholder {
  font-size: 30rem;
}
.filter {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12rem;
}
.label {
  width: 100%;
  height: 96rem;
  background-color: #fff;
  border-radius: 16rem;
  display: flex;
}
.label-item {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36rem;
  color: rgba(65, 65, 65, 1);
  cursor: pointer;
  border-radius: 16rem;
}
.label-item-active {
  background-color: #1356eb;
  color: #fff;
}
.list-container {
  width: 100%;
  display: flex;
  gap: 32rem;
  margin-top: 32rem;
  height: calc(100vh - 280rem);
  flex-direction: column;
  overflow: auto;
}
.list-item {
  height: 412rem;
  width: 100%;
  background-color: #fff;
  border-radius: 16rem;
  flex: 0 0 auto;
}
.line1 {
  width: 100%;
  height: 80rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rem;
}
.line1-right {
  display: flex;
  align-items: center;
  gap: 16rem;
}
.circle {
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
}
.line2 {
  width: 100%;
  padding: 24rem 32rem;
}
.loading-text {
  text-align: center;
  padding: 20rem 0;
  font-size: 28rem;
  color: #999;
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
.scroll {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 516rem;
  background-color: #fff;
  border-radius: 24rem 24rem 0 0;
  z-index: 1002;
  box-shadow: 0px -4rem 8rem rgba(0, 0, 0, 0.25);
  animation: fadein 0.5s ease-in-out;
}
.Scroll-leave {
  animation: fadeout 0.5s ease-in-out;
}
@keyframes fadein {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes fadeout {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
.popup {
  position: fixed;
  width: 80%;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  border-radius: 24rem;
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
