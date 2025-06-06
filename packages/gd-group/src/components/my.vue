<script setup>
import { ref, onMounted, watch } from "vue";
import Datacard from "./datacard.vue";
import Workdata from "./workdata.vue";
import Scrollview from "./scrollview.vue";
import { getDashboardApi, updateEngineerStatusApi } from "../api/user.js";
import useLoginStore from "../store/login.js";
import { useRouter } from "vue-router";
import usePageStore from "../store/page.js";
import { getDutyPicture, setDutyPicture } from "../api/duty.js";
import {
  createFreeDayAPI,
  getFreeDayListAPI,
  deleteFreeDayAPI,
  updateFreeDayAPI,
} from "../api/freeday.js";
import DateScroll from "./dateScroll.vue";
import TimeScroll from "./timeScroll.vue";
import upload from "./upload.vue";
const router = useRouter();
const userData = ref({});
const userId = useLoginStore().id;
const isoverlay = ref(false);
const activeIndex = ref(0);
const isShowDuty = ref(true);
const reason = ref("");
const isScroll = ref(false);
const getUserData = async () => {
  const res = await getDashboardApi(userId);
  userData.value = res.data;
};
//退出登录
const logout = () => {
  useLoginStore().removeGroupId();
  useLoginStore().removeName();
  useLoginStore().removeUserId();
  useLoginStore().removeId();
  useLoginStore().removeRoleId();
  useLoginStore().removeStatus();
  useLoginStore().removePhoneNumber();
  useLoginStore().removeToken();
  window.location.href = window.location.href.replace(
    /(^[^\\/]*\/\/[^\\/]*\/).*$/,
    "$1login/login"
  );
};
//接收子组件传递的工程师id和名称
const selectedEngineerID = ref(0);
const selectedEngineerName = ref("");
const ScrollLeave = ref(false);
const handleSendEngineerID = (id, name, flag) => {
  selectedEngineerID.value = id;
  selectedEngineerName.value = name;
  setTimeout(() => {
    isScroll.value = flag;
    ScrollLeave.value = false;
  }, 480);
  ScrollLeave.value = true;
  usePageStore().setSelectedEngineerName(name);
};
const cancel = (val) => {
  setTimeout(() => {
    isScroll.value = val;
    ScrollLeave.value = false;
  }, 480);
  ScrollLeave.value = true;
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
//预览图片
const showPreview = ref(false);
onMounted(() => {
  getFreeDayListData();
  getUserData();
  selectedEngineerName.value = usePageStore().selectedEngineerName;
  getDutyPictureData();
});
//打卡
let engineerStatus = useLoginStore().status;
watch(
  () => engineerStatus,
  (val) => {
    engineerStatus = val;
  },
  { immediate: true }
);
const updateEngineerStatus = async () => {
  let status = engineerStatus;
  if (status === 0) {
    const res = await updateEngineerStatusApi(userId, { status: 1 });
    useLoginStore().setStatus(1);
    engineerStatus = 1;
  }
  if (status === 1) {
    const res = await updateEngineerStatusApi(userId, { status: 0 });
    useLoginStore().setStatus(0);
    engineerStatus = 0;
  }
  isoverlay.value = false;
};
//发送请假申请
const createFreeDay = async () => {
  try {
    let data = {
      reason: reason.value,
      start_time: convertToISO(beginDate.value, beginTime.value),
      end_time: convertToISO(endDate.value, endTime.value),
    };
    const res = await createFreeDayAPI(data);
    showPopup("申请成功");
  } catch (error) {
    let message = error.response.data.error;
    console.error(error);
    showPopup(message);
  }
};
//获取请假列表
const freedayList = ref([]);
const getFreeDayListData = async () => {
  const res = await getFreeDayListAPI(1, 10);
  freedayList.value = res.data.data;
};
//获得日期
const dateIndex = ref(0);
const beginDate = ref(null);
const endDate = ref(null);
const isDateScroll = ref(false);
const getDate = (date, type) => {
  if (type === "begin") {
    beginDate.value = date; // 更新开始日期
  } else if (type === "end") {
    endDate.value = date; // 更新结束日期
  }
  setTimeout(() => {
    isDateScroll.value = false;
    ScrollLeave.value = false;
  }, 480);
  ScrollLeave.value = true;
};
const beginTime = ref(null);
const endTime = ref(null);
const getTime = (time, type) => {
  if (type === "begin") {
    beginTime.value = time; // 更新开始日期
  } else if (type === "end") {
    endTime.value = time; // 更新结束日期
  }
  setTimeout(() => {
    isDateScroll.value = false;
    ScrollLeave.value = false;
  }, 480);
  ScrollLeave.value = true;
};
const Datecancel = (val) => {
  setTimeout(() => {
    isDateScroll.value = val;
    ScrollLeave.value = false;
  }, 480);
  ScrollLeave.value = true;
};
function convertToISO(dateString, timeString) {
  // 确保 dateString 是字符串
  if (typeof dateString !== "string") {
    return null;
  }

  // 使用正则表达式提取年份、月份和日期
  const match = dateString.match(/(\d{4})年[-](\d{1,2})月[-](\d{1,2})日/);
  if (!match) return null;

  const [_, year, month, day] = match;

  // 创建日期对象，并格式化为 ISO 8601 字符串
  const date = new Date(year, month - 1, day).toISOString().split("T")[0];
  return `${date} ${timeString}`;
}
//删除请假申请
const deleteFreeDay = async (id) => {
  const res = await deleteFreeDayAPI(id);
  showPopup("删除成功");
  getFreeDayListData();
};
//更新请假申请
const updateFreeDay = async (id, status) => {
  let data = {
    status: status,
  };
  const res = await updateFreeDayAPI(id, data);
  showPopup("更新成功");
  getFreeDayListData();
};
//获取值班图片
const getDutyPictureData = async () => {
  const res = await getDutyPicture(useLoginStore().group_id);
  dutyPictureUrl.value = res.data;
};
//上传值班图片
const PreviewPictureUrl = ref("");
const dutyPictureUrl = ref("");
const sendPhotos = (val) => {
  PreviewPictureUrl.value = val[0].url;
};
const uploadDutyPicture = async () => {
  const res = await setDutyPicture(useLoginStore().group_id, PreviewPictureUrl.value);
  showPopup("上传成功");
  getDutyPictureData();
};
</script>
<template>
  <div class="my">
    <div class="scroll" v-if="isDateScroll" :class="{ 'Scroll-leave': ScrollLeave }">
      <DateScroll
        @sendDate="(date) => getDate(date, 'begin')"
        @cancel="Datecancel"
        v-if="dateIndex === 0"
      />
      <DateScroll
        @sendDate="(date) => getDate(date, 'end')"
        @cancel="Datecancel"
        v-if="dateIndex === 1"
      />
      <TimeScroll
        @sendTime="(time) => getTime(time, 'begin')"
        @cancel="Datecancel"
        v-if="dateIndex === 2"
      />
      <TimeScroll
        @sendTime="(time) => getTime(time, 'end')"
        @cancel="Datecancel"
        v-if="dateIndex === 3"
      />
    </div>
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div
      class="overlay"
      v-if="isoverlay"
      @click="
        () => {
          (isoverlay = false), (isScroll = false), (isDateScroll = false);
        }
      "
    ></div>
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
          请阐述请假理由和请假时间
        </div>
        <div style="text-align: left; margin-left: 50rem; color: rgba(153, 153, 153, 1)">
          请假时间
        </div>
        <div
          style="
            padding: 18rem 36rem;
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
                (dateIndex = 0), (isDateScroll = true);
              }
            "
            :style="{
              color:
                beginDate === null ? 'rgba(153, 153, 153, 1)' : 'rgba(65, 65, 65, 1)',
            }"
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
                (dateIndex = 1), (isDateScroll = true);
              }
            "
            :style="{
              color: endDate === null ? 'rgba(153, 153, 153, 1)' : 'rgba(65, 65, 65, 1)',
            }"
          >
            {{ endDate == null ? "请选择日期" : endDate }}
          </div>
        </div>
        <div
          style="
            padding: 18rem 36rem;
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
                (dateIndex = 2), (isDateScroll = true);
              }
            "
            :style="{
              color:
                beginTime === null ? 'rgba(153, 153, 153, 1)' : 'rgba(65, 65, 65, 1)',
            }"
          >
            {{ beginTime == null ? "请选择时间" : beginTime }}
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
                (dateIndex = 3), (isDateScroll = true);
              }
            "
            :style="{
              color: endTime === null ? 'rgba(153, 153, 153, 1)' : 'rgba(65, 65, 65, 1)',
            }"
          >
            {{ endTime == null ? "请选择时间" : endTime }}
          </div>
        </div>
        <div style="padding: 16rem; position: relative">
          <div
            style="
              text-align: left;
              margin-left: 36rem;
              color: rgba(153, 153, 153, 1);
              margin-bottom: 16rem;
            "
          >
            理由阐述
          </div>
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
            maxlength="60"
            placeholder="请输入"
            v-model="reason"
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
            >{{ reason.length }} / 60</span
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
                createFreeDay(), (isoverlay = false);
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
          请假列表
        </div>
        <div
          style="padding: 36rem; position: relative; max-height: 700rem; overflow-y: auto"
        >
          <div
            style="
              padding: 0 36rem;
              display: flex;
              flex-direction: column;
              gap: 24rem;
              margin-bottom: 24rem;
            "
            v-for="(item, index) in freedayList"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <div style="font-size: 32rem; font-weight: 700; color: rgba(37, 37, 37, 1)">
                {{ item.user_name }}
              </div>
              <div
                style="
                  width: 104rem;
                  height: 48rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-left: 36rem;
                  border-radius: 6rem;
                  font-size: 24rem;
                  font-weight: 500;
                  color: rgba(255, 255, 255, 1);
                  background: rgba(19, 86, 235, 1);
                "
              >
                {{ item.role }}
              </div>
              <div
                v-if="item.status === 1"
                style="
                  margin-left: auto;
                  color: rgba(153, 153, 153, 1);
                  font-size: 24rem;
                  font-weight: 400;
                "
              >
                已通过
              </div>
              <div
                v-if="item.status === 2"
                style="
                  margin-left: auto;
                  color: rgba(153, 153, 153, 1);
                  font-size: 24rem;
                  font-weight: 400;
                "
              >
                已否决
              </div>
            </div>
            <div
              style="
                text-align: left;
                color: rgba(65, 65, 65, 1);
                font-size: 28rem;
                font-weight: 400;
              "
            >
              {{ item.reason }}
            </div>
            <div
              style="
                font-size: 24rem;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                text-align: left;
              "
            >
              {{ item.start_date }}
            </div>
            <div style="display: flex">
              <div
                style="
                  width: 215rem;
                  height: 80rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border: 2rem solid rgba(19, 86, 235, 1);
                  background-color: #fff;
                  border-radius: 12rem;
                  font-size: 32rem;
                  font-weight: 400;
                  color: rgba(19, 86, 235, 1);
                  margin-right: 36rem;
                  cursor: pointer;
                "
                @click="
                  () => {
                    updateFreeDay(item.id, 2);
                  }
                "
                v-if="item.status === 0"
              >
                否决
              </div>
              <div
                style="
                  width: 215rem;
                  height: 80rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: rgba(19, 86, 235, 1);
                  border-radius: 12rem;
                  font-size: 32rem;
                  font-weight: 400;
                  color: #fff;
                  margin-right: 36rem;
                  cursor: pointer;
                "
                @click="updateFreeDay(item.id, 1)"
                v-if="item.status === 0"
              >
                通过
              </div>
            </div>
            <div
              style="
                border-bottom: 1px solid #ccc;
                background-color: #eaeaea;
                width: 105%;
              "
              v-if="index !== freedayList.length - 1"
            ></div>
          </div>
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="display: flex; cursor: pointer">
          <div
            style="
              width: 100%;
              height: 84rem;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            @click="isoverlay = false"
          >
            返回
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 2">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          上传值班表
        </div>
        <div
          style="width: 100%; display: flex; justify-content: center; align-items: center"
        >
          <upload @sendPhotos="sendPhotos" />
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
                showPopup('上传成功'), uploadDutyPicture(), (isoverlay = false);
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
      <div style="width: 100%" v-if="activeIndex === 3">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          v-if="engineerStatus === 0"
        >
          确定要下班打卡吗
        </div>
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
          v-if="engineerStatus === 1"
        >
          确定要值班打卡吗
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
                showPopup('打卡成功'), updateEngineerStatus();
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
    <div class="title-container" v-if="activeIndex === 5 && isoverlay">
      <div
        style="
          margin: 0 48rem;
          margin-top: 48rem;
          background: rgba(245, 245, 245, 1);
          padding: 24rem;
          border-radius: 16rem;
          display: flex;
          align-items: center;
          font-size: 32rem;
          font-weight: 400;
          display: flex;
          justify-content: space-between;
        "
        @click="isScroll = true"
      >
        <div style="">工程师</div>
        <div style="">{{ selectedEngineerName }}</div>
        <img src="../static/union.svg" style="width: 16rem; height: 26.76rem" />
      </div>
      <div class="card-container">
        <Datacard :selectedEngineerID="selectedEngineerID" />
        <div
          style="
            font-size: 28rem;
            font-weight: 700;
            text-align: left;
            padding-left: 32rem;
          "
        >
          工作情况
        </div>
        <Workdata :selectedEngineerID="selectedEngineerID" />
      </div>
    </div>
    <div class="scroll" v-if="isScroll" :class="{ 'Scroll-leave': ScrollLeave }">
      <Scrollview @sendEngineerID="handleSendEngineerID" @cancel="cancel" />
    </div>
    <div class="card">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24rem;
        "
      >
        <div style="display: flex; gap: 24rem; align-items: center">
          <div style="font-size: 48rem; font-weight: 700">{{ useLoginStore().name }}</div>
          <div
            style="
              font-size: 24rem;
              background-color: #1356eb;
              color: #fff;
              border-radius: 6rem;
              width: 104rem;
              height: 48rem;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            v-if="useLoginStore().role_id === 1"
          >
            工程师
          </div>
          <div
            style="
              font-size: 24rem;
              background-color: #1356eb;
              color: #fff;
              border-radius: 6rem;
              width: 104rem;
              height: 48rem;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            v-if="useLoginStore().role_id === 2"
          >
            组长
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 24rem">
          <div
            style="
              background-color: #53c31a;
              width: 24rem;
              height: 24rem;
              border-radius: 50%;
            "
            v-if="useLoginStore().status === 0"
          ></div>
          <div
            style="
              background-color: #1790ff;
              width: 24rem;
              height: 24rem;
              border-radius: 50%;
            "
            v-if="useLoginStore().status === 1"
          ></div>
          <div v-if="useLoginStore().status === 0">在岗</div>
          <div v-else-if="useLoginStore().status === 1">离岗</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-if="useLoginStore().group_id === 0"
        >
          无分组
        </div>
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-else-if="useLoginStore().group_id === 1"
        >
          IDC机房运维
        </div>
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-else-if="useLoginStore().group_id === 2"
        >
          系统运维
        </div>
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-else-if="useLoginStore().group_id === 3"
        >
          网络运维
        </div>
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-else-if="useLoginStore().group_id === 4"
        >
          学生机房运维
        </div>
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-else-if="useLoginStore().group_id === 5"
        >
          日常办公运维
        </div>
        <div
          style="text-align: left; font-weight: 400; font-size: 28rem"
          v-else-if="useLoginStore().group_id === 6"
        >
          行政会议保障运营
        </div>
        <img
          src="../static/退出.svg"
          style="width: 48rem; height: 48rem"
          @click="logout()"
        />
      </div>
    </div>
    <div class="fun-card">
      <img
        src="../static/打卡.svg"
        alt=""
        class="svg-item"
        @click="
          () => {
            (isoverlay = true), (activeIndex = 3);
          }
        "
      />
      <img
        src="../static/请假.svg"
        alt=""
        class="svg-item"
        @click="
          () => {
            (isoverlay = true), (activeIndex = 0);
          }
        "
      />
      <img
        src="../static/请假审批.svg"
        alt=""
        class="svg-item"
        @click="
          () => {
            (isoverlay = true), (activeIndex = 1);
          }
        "
      />
      <img
        src="../static/问题描述管理.svg"
        alt=""
        class="svg-item"
        @click="router.push('/questionManage')"
      />
      <img
        src="../static/创建工单.svg"
        alt=""
        class="svg-item"
        @click="router.push('/create')"
      />
    </div>
    <div class="Dutycard">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24rem;
          background-color: #fff;
          border-radius: 16rem;
          padding: 24rem;
        "
        @click="isShowDuty = !isShowDuty"
      >
        <div style="font-weight: 700">值班表</div>
        <img
          src="../static/arrow.svg"
          style="width: 24rem; height: 12rem; transition: 0.5s"
          :class="{ rotate: isShowDuty }"
        />
      </div>
      <div
        style="
          padding: 24rem;
          margin-bottom: 24rem;
          background-color: #fff;
          border-radius: 16rem;
        "
        v-if="!isShowDuty"
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 24rem;
            margin-right: 24rem;
          "
        >
          <img
            src="../static/upload.svg"
            style="height: 32rem; height: 32rem"
            @click="
              () => {
                (isoverlay = true), (activeIndex = 2);
              }
            "
          />
        </div>
        <img
          :src="dutyPictureUrl"
          style="width: 100%; height: 100%; object-fit: cover"
          @click="showPreview = true"
          v-if="dutyPictureUrl !== ''"
        />
      </div>
    </div>
    <div class="data-card">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24rem;
        "
      >
        <div style="font-size: 28rem; font-weight: 700; text-align: left">工作数据</div>
        <div
          style="
            width: 200rem;
            height: 40rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(19, 86, 235, 1);
            border-radius: 8rem;
            color: #fff;
            font-size: 24rem;
            user-select: none;
            cursor: pointer;
            font-weight: 700;
          "
          @click="
            () => {
              (isoverlay = true), (activeIndex = 5);
            }
          "
        >
          查看组内工程师
        </div>
      </div>
      <div class="data-container">
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.total_count }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">个</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            总工单量
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.monthly_count }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">个</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            月工单量
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.monthly_transfer_count }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">个</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            月转工单量
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.total_work_hours }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">h</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            总工作时长
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.monthly_work_hours }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">h</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            月工作时长
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.leave_hours }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">h</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            请假时间
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.avg_response_time }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">min</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            平均响应时间
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.avg_process_start_time }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">min</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            平均开始处理时间
          </div>
        </div>
        <div>
          <div style="display: flex; align-items: end; justify-content: center">
            <div style="font-size: 36rem; font-weight: 700; color: #1356eb">
              {{ userData.avg_resolve_time }}
            </div>
            <div style="font-size: 24rem; font-weight: 500; color: #1356eb">min</div>
          </div>
          <div style="font-size: 20rem; font-weight: 700; color: rgba(91, 91, 91, 1)">
            平均解决问题时间
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPreview" class="preview-overlay" @click="showPreview = false">
      <div class="preview-container">
        <img :src="dutyPictureUrl" class="preview-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.my {
  width: 100%;
  padding: 24rem 32rem;
  background-color: #f5f5f5;
  min-height: calc(100vh - 112rem);
  height: calc(100vh - 112rem);
  overflow-y: scroll;
}
.card {
  width: 100%;
  background-color: #fff;
  padding: 32rem 48rem;
  margin-bottom: 24rem;
  border-radius: 16rem;
}
.fun-card {
  width: 100%;
  background-color: #1356eb;
  padding: 32rem 48rem;
  border-radius: 16rem;
  margin-bottom: 24rem;
  display: flex;
  gap: 24rem;
  align-items: center;
  justify-content: flex-start;
}
.svg-item {
  width: 96rem;
  height: 104rem;
}
.data-card {
  width: 100%;
  background-color: #fff;
  padding: 32rem 36rem;
  border-radius: 16rem;
}
.data-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 48rem;
}
.data-container > div {
  box-sizing: border-box;
}
.overlay {
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
.title-container {
  position: fixed;
  width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 24rem;
  z-index: 1001;
}
.card-container {
  height: 700rem;
  overflow-y: auto;
}
.scroll {
  animation: fadein 0.5s ease-in-out;
  position: fixed;
  width: 100vw;
  bottom: 0;
  left: 0;
  height: 516rem;
  background-color: #fff;
  border-radius: 24rem 24rem 0 0;
  z-index: 1002;
  box-shadow: 0px -4rem 8rem rgba(0, 0, 0, 0.25);
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
  max-width: 100%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.popup {
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background-color: #fff;
  border-radius: 24rem;
}
textarea::placeholder {
  font-size: 24rem;
  color: rgba(153, 153, 153, 1);
  font-weight: 400;
}
.message {
  position: fixed;
  width: 240rem;
  height: 220rem;
  background: rgba(0, 0, 0, 0.8);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
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
.rotate {
  transform: rotate(-180deg);
  transition: 0.3s;
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
.show {
  visibility: visible;
  opacity: 1;
}
</style>
