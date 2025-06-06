<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getWorkListApi } from "../api/work.js";
import useLoginStore from "../store/login.js";
import DateScroll from "./dateScroll.vue";
const router = useRouter();
const route = useRoute();
const description = route.query.description;
const isoverlay = ref(false);
const isScroll = ref(false);
const gotoDetail = (id) => {
  router.push(`/detail?id=${id}`);
};
const goToSearch = () => {
  router.push("/search");
};
//分页查询
const page = ref(1);
const pageSize = ref(10);
const workList = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const getWorkList = async (reset = false) => {
  if (loading.value || (!hasMore.value && !reset)) return;

  if (reset) {
    page.value = 1;
    workList.value = [];
    hasMore.value = true;
  }
  loading.value = true;
  const statusString = statusList.value.join(",");
  const user_id = useLoginStore().id;
  const res = await getWorkListApi(
    page.value,
    pageSize.value,
    statusString,
    user_id,
    "user",
    description,
    convertToISO(beginDate.value),
    convertToISO(endDate.value)
  );
  if (res.data.work_orders.length > 0) {
    workList.value = [...workList.value, ...res.data.work_orders];
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
const statusList = ref([0, 1, 2, 3, 4, 5]);
const JudgeStatusAndChange = (index) => {
  if (activeIndex.value === index) return;

  activeIndex.value = index;
  if (activeIndex.value === 0) {
    statusList.value = [0, 1, 2, 3, 4, 5];
  } else if (activeIndex.value === 1) {
    statusList.value = [0, 1, 2, 3, 4];
  } else if (activeIndex.value === 2) {
    statusList.value = [5];
  }
  getWorkList(true); // 重置并重新加载数据
};
const message = ref("");
const showPopup = (val) => {
  message.value = val;
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
};
//滚动加载
const handleScroll = (event) => {
  const container = event.target;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollThreshold = container.scrollHeight - 100; // 提前100像素触发加载

  if (scrollPosition >= scrollThreshold && !loading.value && hasMore.value) {
    getWorkList();
  }
};
const loadingText = computed(() => {
  if (loading.value) return "加载中...";
  if (!hasMore.value) return "没有更多数据了";
  return "";
});
onMounted(() => {
  getWorkList(true);
});
//获得日期
const dateIndex = ref(0);
const beginDate = ref(null);
const endDate = ref(null);
const getDate = (date, type) => {
  if (type === "begin") {
    beginDate.value = date; // 更新开始日期
  } else if (type === "end") {
    endDate.value = date; // 更新结束日期
  }
  isScroll.value = false;
};
const cancel = (val) => {
  isScroll.value = val;
};
function convertToISO(dateString) {
  // 确保 dateString 是字符串
  if (typeof dateString !== "string") {
    return null;
  }

  // 使用正则表达式提取年份、月份和日期
  const match = dateString.match(/(\d{4})年[-](\d{1,2})月[-](\d{1,2})日/);
  if (!match) return null;

  const [_, year, month, day] = match;

  // 创建日期对象，并格式化为 ISO 8601 字符串
  const date = new Date(year, month - 1, day); // 月份减1，因为JavaScript的月份从0开始
  return date.toISOString().split("T")[0] + "T00:00:00Z";
}
//添加复制到剪贴板的方法
const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
  showPopup("复制成功");
  // 这里可以添加复制成功的提示
};
</script>
<template>
  <div class="frame">
    <div
      class="overlay"
      v-if="isoverlay"
      @click="
        () => {
          (isoverlay = false), (isScroll = false);
        }
      "
    ></div>
    <div class="popup" v-if="isoverlay">
      <div style="width: 100%">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          根据起止时间查询
        </div>
        <div
          style="
            padding: 36rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            style="
              background-color: rgba(245, 245, 245, 1);
              width: 231rem;
              height: 96rem;
              margin-right: 16rem;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 16rem;
              cursor: pointer;
              font-size: 24rem;
              color: rgba(153, 153, 153, 1);
              margin-left: 16rem;
            "
            @click="
              () => {
                (dateIndex = 0), (isScroll = true);
              }
            "
          >
            {{ beginDate == null ? "请选择日期" : beginDate }}
          </div>
          <div
            style="
              border: 1px solid rgba(153, 153, 153, 1);
              width: 32rem;
              height: 2rem;
              margin-right: 16rem;
            "
          ></div>
          <div
            style="
              background-color: rgba(245, 245, 245, 1);
              width: 231rem;
              height: 96rem;
              margin-right: 16rem;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 16rem;
              cursor: pointer;
              font-size: 24rem;
              color: rgba(153, 153, 153, 1);
            "
            @click="
              () => {
                (dateIndex = 1), (isScroll = true);
              }
            "
          >
            {{ endDate == null ? "请选择日期" : endDate }}
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
                (isScroll = false), (isoverlay = false), getWorkList(true);
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
            @click="
              () => {
                (isScroll = false), (isoverlay = false);
              }
            "
          >
            取消
          </div>
        </div>
      </div>
    </div>
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div class="scroll" v-if="isScroll" :class="{ 'Scroll-leave': ScrollLeave }">
      <DateScroll
        @sendDate="(date) => getDate(date, 'begin')"
        @cancel="cancel"
        v-if="dateIndex === 0"
      />
      <DateScroll
        @sendDate="(date) => getDate(date, 'end')"
        @cancel="cancel"
        v-if="dateIndex === 1"
      />
    </div>
    <div class="search">
      <div class="search-container">
        <img
          src="../../src/static/search.svg"
          style="width: 36rem; height: 36rem; margin: 12rem"
        />
        <div
          style="
            font-size: 30rem;
            color: rgb(182, 182, 182);
            width: 374rem;
            text-align: left;
            font-weight: 400;
          "
          @click="goToSearch()"
          v-if="!description"
        >
          请输入问题描述
        </div>
        <div
          style="
            font-size: 30rem;
            color: #414141;
            width: 374rem;
            text-align: left;
            font-weight: 400;
          "
          @click="goToSearch()"
          v-else
        >
          {{ description }}
        </div>
        <div
          style="
            font-size: 24rem;
            width: 88rem;
            height: 48rem;
            background-color: #1356eb;
            border-radius: 32rem;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          "
        >
          搜索
        </div>
      </div>
      <div
        class="filter"
        @click="
          () => {
            isoverlay = true;
          }
        "
      >
        <img
          src="../../src/static/clock.svg"
          alt=""
          style="width: 48rem; height: 48rem"
        />
        <div style="font-size: 32rem">筛选</div>
      </div>
    </div>
    <div class="label">
      <div
        class="label-item"
        :class="{ 'label-item-active': activeIndex === 0 }"
        @click="JudgeStatusAndChange(0)"
      >
        全部
      </div>
      <div
        class="label-item"
        :class="{ 'label-item-active': activeIndex === 1 }"
        @click="JudgeStatusAndChange(1)"
      >
        进行中
      </div>
      <div
        class="label-item"
        :class="{ 'label-item-active': activeIndex === 2 }"
        @click="JudgeStatusAndChange(2)"
      >
        已完成
      </div>
    </div>
    <div class="list-container" @scroll="handleScroll">
      <div class="list-item" v-for="item in workList" :key="item.ID">
        <div class="line1">
          <div class="line1-left" style="font-weight: 700; color: rgba(65, 65, 65, 1)">
            <span style="font-size: 28rem">工单编号：</span>
            <span style="font-size: 28rem">{{ item.order_number }}</span>
          </div>
          <div class="line1-right">
            <div
              class="circle"
              v-if="item.status === 0"
              style="background-color: #faad0f"
            ></div>
            <div
              class="circle"
              v-else-if="item.status === 1"
              style="background-color: #ff4d50"
            ></div>
            <div
              class="circle"
              v-else-if="item.status === 2"
              style="background-color: #1790ff"
            ></div>
            <div
              class="circle"
              v-else-if="item.status === 3"
              style="background-color: #1356eb"
            ></div>
            <div
              class="circle"
              v-else-if="item.status === 4"
              style="background-color: #fa800f"
            ></div>
            <div
              class="circle"
              v-else-if="item.status === 5"
              style="background-color: #53c31a"
            ></div>
            <span style="font-size: 28rm" v-if="item.status === 0">待分配</span>
            <span style="font-size: 28rm" v-else-if="item.status === 1">已分配</span>
            <span style="font-size: 28rm" v-else-if="item.status === 2">已接单</span>
            <span style="font-size: 28rm" v-else-if="item.status === 3">已到达</span>
            <span style="font-size: 28rm" v-else-if="item.status === 4">挂单中</span>
            <span style="font-size: 28rm" v-else-if="item.status === 5">已完成</span>
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
            {{ truncateText(item.description, 15) }}
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
            {{ item.created_at }}
          </div>
          <div style="display: flex; width: 100%; margin-bottom: 16rem">
            <div
              style="color: rgba(153, 153, 153, 1); font-size: 24rem; font-weight: 400"
            >
              工程师
            </div>
            <div
              style="
                color: rgba(65, 65, 65, 1);
                font-size: 24rem;
                font-weight: 400;
                margin-left: 56rem;
              "
            >
              {{ item.engineer_name }}
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
              {{ item.engineer_phone }}
            </div>
            <img
              src="../static/Content copy.svg"
              style="width: 24rem; height: 24rem; margin-left: 32rem; cursor: pointer"
              @click="copyToClipboard(item.engineer_phone)"
              v-if="item.engineer_phone"
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
              {{ item.updated_at }}
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
            @click="gotoDetail(item.ID)"
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
.frame {
  width: 100%;
  padding: 24rem 32rem;
  background-color: #f5f5f5;
  min-height: calc(100vh - 112rem);
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
  height: calc(100vh - 392rem);
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
