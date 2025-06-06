<script setup>
import { ref, onMounted } from "vue";
import { getWorkDetailApi, getWorkLogsListApi, getPhoneAndNameApi } from "../api/work.js";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const workid = route.query.id;
const detailData = ref({});
const getWorkDetailData = async () => {
  const res = await getWorkDetailApi(workid);
  detailData.value = res.data;
};
//获取工单日志记录
const workLogsList = ref([]);
const getWorkLogsListData = async () => {
  const res = await getWorkLogsListApi(workid);
  workLogsList.value = res.data;
};
//获取工程师手机号和姓名
const getPhoneAndNameData = async () => {
  if (detailData.value.status === 0) {
    return;
  }
  const res = await getPhoneAndNameApi(workid);
  Object.assign(detailData.value, res.data);
};
onMounted(async () => {
  getWorkLogsListData();
  await getWorkDetailData();
  getPhoneAndNameData();
});
</script>
<template>
  <div class="detail">
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      工单详情
    </div>
    <div class="container">
      <div style="display: flex; justify-content: space-between; margin-bottom: 2.4rem">
        <div style="display: flex; align-items: center; width: 47%; gap: 17.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            工单编号
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ detailData.order_number }}
          </div>
        </div>
        <div style="display: flex; align-items: center; width: 47%; gap: 17.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            地点
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ detailData.location }}
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2.4rem">
        <div style="display: flex; align-items: center; width: 47%; gap: 17.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            工单状态
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            <span style="font-size: 1.4rem" v-if="detailData.status === -1">已退回</span>
            <span style="font-size: 1.4rem" v-if="detailData.status === 0">待分配</span>
            <span style="font-size: 1.4rem" v-else-if="detailData.status === 1"
              >已分配</span
            >
            <span style="font-size: 1.4rem" v-else-if="detailData.status === 2"
              >已接单</span
            >
            <span style="font-size: 1.4rem" v-else-if="detailData.status === 3"
              >已到达</span
            >
            <span style="font-size: 1.4rem" v-else-if="detailData.status === 4"
              >挂单中</span
            >
            <span style="font-size: 1.4rem" v-else-if="detailData.status === 5"
              >已完成</span
            >
          </div>
        </div>
        <div style="display: flex; align-items: center; width: 47%; gap: 16.2rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            提交人
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ detailData.user_name }}
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2.4rem">
        <div style="display: flex; align-items: center; width: 47%; gap: 17.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            问题描述
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ detailData.problem_content }}
          </div>
        </div>
        <div style="display: flex; align-items: center; width: 47%; gap: 14.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            联系方式
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ detailData.phone_number }}
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2.4rem">
        <div style="display: flex; align-items: center; width: 47%; gap: 17.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            所属组别
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ detailData.group_name }}
          </div>
        </div>
        <div style="display: flex; align-items: center; width: 47%; gap: 14.6rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            提交时间
          </div>
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
            {{ new Date(detailData.CreatedAt).toLocaleString() }}
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 2.4rem">
        <div style="display: flex; align-items: flex-start; width: 47%; gap: 17.6rem">
          <div
            style="
              font-size: 1.4rem;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              flex: 0 0 auto;
            "
          >
            问题详细
          </div>
          <div
            style="
              font-size: 1.4rem;
              font-weight: 400;
              color: rgba(37, 37, 37, 1);
              text-align: left;
            "
          >
            {{ detailData.details }}
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; width: 47%; gap: 17rem">
          <div style="font-size: 1.4rem; font-weight: 400; color: rgba(153, 153, 153, 1)">
            照片
          </div>
          <div class="picture-container-wrap">
            <div class="picture-container" v-for="img in detailData.photos">
              <img :src="img.url" @click="openPreview(img.url)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="log-container">
      <div class="item" v-if="detailData.status !== 0 && detailData.status !== 1">
        <div class="text-left">工程师</div>
        <div class="text-right">{{ detailData.engineer_name }}</div>
      </div>
      <div
        style="display: flex; align-items: center; gap: 14.9rem"
        v-if="detailData.status !== 0 && detailData.status !== 1"
      >
        <div class="text-left">联系方式</div>
        <div class="text-right">{{ detailData.engineer_phone_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">进度</div>
      </div>
      <div class="order-container">
        <div class="order-container-item" v-for="item in workLogsList">
          <div class="order-left">
            <div class="circle"></div>
            <div class="line"></div>
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
            <div class="order-time">
              {{ item.work_order_status_log.change_time }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="button"
        style="
          width: 8rem;
          height: 4rem;
          background: rgba(217, 217, 217, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.6rem;
          cursor: pointer;
          font-size: 1.6rem;
          font-weight: 400;
          color: #303133;
          margin: 0 auto;
          margin-top: 4.6rem;
        "
        @click="router.back()"
      >
        返回
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail {
  width: 100%;
  margin: 2.4rem;
}
.container {
  width: 100%;
  background-color: #fff;
  padding: 2.4rem 1.8rem;
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 2.4rem;
}
.picture-container-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 28rem;
  gap: 1.2rem;
}
.picture-container {
  width: 7.6rem;
  height: 7.6rem;
}
.picture-container img {
  width: 100%;
  height: 100%;
  border-radius: 0.8rem;
  object-fit: cover;
}
.log-container {
  width: 100%;
  background-color: #fff;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
}
.item {
  display: flex;
  align-items: center;
  gap: 16.4rem;
}
.text-left {
  font-size: 1.4rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.text-right {
  font-size: 1.4rem;
  font-weight: 400;
  color: rgba(37, 37, 37, 1);
  max-width: 20rem;
  text-align: left;
}
.order-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.order-container-item {
  display: flex;
  margin-left: 4rem;
  gap: 1.2rem;
}
.order-left {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: center;
}
.circle {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: #fff;
  border: 0.1rem solid #1356eb;
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
  gap: 0.6rem;
  align-items: flex-start;
}
.order-status {
  text-align: left;
  font-size: 1.4rem;
  font-weight: 400;
}
.order-time {
  text-align: left;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(153, 1);
}
.button:hover {
  opacity: 0.8;
}
</style>
