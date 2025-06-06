<script setup>
import { ref, onMounted } from "vue";
import {
  getWorkDetailApi,
  getWorkLogsListApi,
  getPhoneAndNameApi,
  getGroupListApi,
  updateWorkStatusApi,
  returnWorkStatusApi,
} from "../api/work.js";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const workid = route.query.id;
const detailData = ref({});
const isoverlay = ref(false);
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
//获取所有组
const selectedgroup = ref();
const groupList = ref([]);
const getGroupListData = async () => {
  const res = await getGroupListApi();
  groupList.value = res.data;
};
//派单
const transferGroup = async () => {
  let data = {
    new_engineer_id: 0,
    new_group_id: selectedgroup.value,
    new_status: 0,
    operation: "已转组",
  };
  const res = await updateWorkStatusApi(workid, data);
  if (res.status === 200) {
    ElMessage.success("派单成功");
    router.push("/home/Statistics");
  }
};
//退回
const returnWork = async () => {
  let data = { remarks: "退回工单" };
  const res = await returnWorkStatusApi(workid, data);
  if (res.status === 200) {
    ElMessage.success(res.data.message);
  }
  router.push("/home/Statistics");
};
onMounted(async () => {
  getWorkLogsListData();
  await getWorkDetailData();
  getPhoneAndNameData();
  getGroupListData();
});
const activeIndex = ref(0);
</script>
<template>
  <div class="detail">
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      工单详情
    </div>
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
    <div class="popup" v-if="isoverlay && activeIndex === 0">
      <div style="width: 100%">
        <div
          style="
            width: 100%;
            height: 5.4rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 1.6rem;
            font-weight: 700;
            color: rgba(65, 65, 65, 1);
            padding: 2.4rem 3.2rem;
          "
        >
          派单给
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div
          style="
            height: 11.4rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <el-select
            v-model="selectedgroup"
            placeholder="请选择"
            style="width: 85%; height: 3.2rem; min-height: none"
          >
            <el-option
              v-for="item in groupList"
              :key="item.value"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div
          style="
            height: 8rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            class="button"
            style="
              width: 8rem;
              height: 4rem;
              background: rgba(0, 82, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
            "
            @click="transferGroup()"
          >
            确定
          </div>
        </div>
      </div>
    </div>
    <div class="popup2" v-else-if="isoverlay && activeIndex === 1">
      <div style="width: 100%">
        <div
          style="
            width: 100%;
            height: 5.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            font-weight: 500;
            color: rgba(65, 65, 65, 1);
            padding: 4.8rem 3.2rem;
          "
        >
          确定要退回工单吗？
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div
          style="
            height: 8rem;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 3.2rem;
          "
        >
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
              color: #fff;
              margin-right: 1.2rem;
            "
            @click="
              () => {
                isoverlay = false;
              }
            "
          >
            取消
          </div>
          <div
            class="button"
            style="
              width: 10rem;
              height: 4rem;
              background: rgba(0, 82, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
            "
            @click="
              () => {
                returnWork(), (isoverlay = false);
              }
            "
          >
            确认退回
          </div>
        </div>
      </div>
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
        style="display: flex; justify-content: center; margin-top: 4.8rem; gap: 1.2rem"
      >
        <div
          class="button"
          style="
            width: 8rem;
            height: 4rem;
            background: rgba(0, 82, 217, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.6rem;
            cursor: pointer;
            font-size: 1.6rem;
            font-weight: 400;
            color: #fff;
          "
          @click="(isoverlay = true), (activeIndex = 0)"
          v-if="detailData.status === 0"
        >
          派单
        </div>
        <div
          class="button"
          style="
            width: 8rem;
            height: 4rem;
            background: rgba(255, 17, 21, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.6rem;
            cursor: pointer;
            font-size: 1.6rem;
            font-weight: 400;
            color: #fff;
          "
          @click="(isoverlay = true), (activeIndex = 1)"
          v-if="detailData.status === 0"
        >
          退回
        </div>
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.popup {
  position: fixed;
  width: 40%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 12;
  background-color: #fff;
  border-radius: 1.2rem;
}
.popup2 {
  position: fixed;
  width: 25%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  background-color: #fff;
  border-radius: 1.2rem;
}
::v-deep .el-select__wrapper {
  box-shadow: 0 0 0 1px #dcdfe6 !important;
  min-height: 0 !important;
  height: 3.2rem;
}
::v-deep .el-select__wrapper {
  font-size: 1.4rem;
  border-radius: 0.4rem;
}
</style>
