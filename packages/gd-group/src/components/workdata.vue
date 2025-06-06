<script setup>
import { ref, defineProps, watch, onMounted, computed } from "vue";
import usePageStore from "../store/page.js";
import { getWorkListApi } from "../api/work.js";
import { useRouter } from "vue-router";
//分页查询
const router = useRouter();
const page = ref(1);
const pageSize = ref(10);
const workList = ref([]);
const loading = ref(false);
const hasMore = ref(true);
const beginDate = ref(null);
const endDate = ref(null);
const getWorkList = async (reset = false) => {
  if (loading.value || (!hasMore.value && !reset)) return;

  if (reset) {
    page.value = 1;
    workList.value = [];
    hasMore.value = true;
  }

  loading.value = true;
  const statusString = statusList.value.join(",");
  const engineer_id = usePageStore().selectedEngineerID;
  const res = await getWorkListApi(
    page.value,
    pageSize.value,
    statusString,
    engineer_id,
    "engineer",
    "",
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
//获取不同状态的工单列表
const activeIndex = ref(0);
const statusList = ref([1, 2, 3, 4, 5]);
const JudgeStatusAndChange = (index) => {
  if (activeIndex.value === index) return;

  activeIndex.value = index;
  if (activeIndex.value === 0) {
    statusList.value = [1, 2, 3, 4, 5];
  } else if (activeIndex.value === 1) {
    statusList.value = [1];
  } else if (activeIndex.value === 2) {
    statusList.value = [2, 3];
  } else if (activeIndex.value === 3) {
    statusList.value = [4];
  } else if (activeIndex.value === 4) {
    statusList.value = [5];
  }
  getWorkList(true); // 重置并重新加载数据
};
//
const selectedEngineerID = ref(0);
const props = defineProps({
  selectedEngineerID: {
    type: Number,
    default: 0,
  },
});
const gotoDetail = (id) => {
  router.push(`/detail?id=${id}`);
};
watch(
  () => props.selectedEngineerID,
  (newVal) => {
    selectedEngineerID.value = newVal;
    usePageStore().setSelectedEngineerID(newVal);
    getWorkList(true);
  }
);
onMounted(() => {
  selectedEngineerID.value = usePageStore().selectedEngineerID;
  getWorkList(true);
});
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
</script>
<template>
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
      待处理
    </div>
    <div
      class="label-item"
      :class="{ 'label-item-active': activeIndex === 2 }"
      @click="JudgeStatusAndChange(2)"
    >
      处理中
    </div>
    <div
      class="label-item"
      :class="{ 'label-item-active': activeIndex === 3 }"
      @click="JudgeStatusAndChange(3)"
    >
      挂单中
    </div>
    <div
      class="label-item"
      :class="{ 'label-item-active': activeIndex === 4 }"
      @click="JudgeStatusAndChange(4)"
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
        <div
          style="
            width: 100%;
            height: 96rem;
            background: #d9d9d9;
            border-radius: 16rem;
            margin-bottom: 16rem;
            display: flex;
            align-items: center;
          "
        >
          <div style="width: 33.3%">
            <div
              style="font-size: 24rem; font-weight: 400; color: rgba(153, 153, 153, 1)"
            >
              提交人
            </div>
            <div style="font-size: 24rem; font-weight: 400; color: rgba(65, 65, 65, 1)">
              {{ item.name }}
            </div>
          </div>
          <div style="width: 33.3%">
            <div
              style="
                display: flex;
                gap: 8rem;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="font-size: 24rem; font-weight: 400; color: rgba(153, 153, 153, 1)"
              >
                联系方式
              </div>
              <img
                src="../static/Content copy.svg"
                style="width: 24rem; height: 24rem; cursor: pointer"
                @click="copyToClipboard(item.phone_number)"
              />
            </div>
            <div style="font-size: 24rem; font-weight: 400; color: rgba(65, 65, 65, 1)">
              {{ item.phone_number }}
            </div>
          </div>
          <div style="width: 33.3%">
            <div
              style="font-size: 24rem; font-weight: 400; color: rgba(153, 153, 153, 1)"
            >
              故障地点
            </div>
            <div style="font-size: 24rem; font-weight: 400; color: rgba(65, 65, 65, 1)">
              {{ item.location }}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 16rem; align-items: center">
          <div style="font-size: 24rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            更新时间
          </div>
          <div
            style="
              font-size: 24rem;
              font-weight: 400;
              color: rgba(65, 65, 65, 1);
              padding-top: 2rem;
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
</template>
<style scoped>
.list-container {
  width: 100%;
  display: flex;
  gap: 32rem;
  margin-top: 32rem;
  flex-direction: column;
  margin-bottom: 32rem;
}
.list-item {
  height: 436rem;
  width: calc(100% - 64rem);
  background-color: #f5f5f5;
  border-radius: 16rem;
  flex: 0 0 auto;
  margin: 0rem 32rem;
}
.label {
  width: calc(100% - 64rem);
  height: 96rem;
  background-color: #f5f5f5;
  border-radius: 16rem;
  display: flex;
  margin: 32rem 32rem 0rem 32rem;
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
  background: rgba(83, 195, 26, 1);
}
.line2 {
  width: 100%;
  padding: 24rem 32rem;
}
</style>
