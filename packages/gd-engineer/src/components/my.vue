<script setup>
import { ref, onMounted, watch } from "vue";
import { getDashboardApi, updateEngineerStatusApi } from "../api/user.js";
import useLoginStore from "../store/login.js";
import { createFreeDayAPI } from "../api/freeday.js";
import DateScroll from "./dateScroll.vue";
import TimeScroll from "./timeScroll.vue";
import { useRouter } from "vue-router";
const userData = ref({});
const userId = useLoginStore().id;
const activeIndex = ref(0);
const router = useRouter();
const reason = ref("");
let engineerStatus = useLoginStore().status;
const isoverlay = ref(false);
const getUserData = async () => {
  const res = await getDashboardApi(userId);
  userData.value = res.data;
};
// 更新工程师状态
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
// 弹窗提示
const message = ref("");
const showPopup = (val) => {
  message.value = val;
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
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
//获得日期
const dateIndex = ref(0);
const beginDate = ref(null);
const endDate = ref(null);
const isDateScroll = ref(false);
const ScrollLeave = ref(false);
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
onMounted(() => {
  getUserData();
});
</script>
<template>
  <div class="frame">
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
                showPopup('申请成功'), createFreeDay(), (isoverlay = false);
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
          v-if="useLoginStore().group_id === 1"
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
            (isoverlay = true), (activeIndex = 0);
          }
        "
      />
      <img
        src="../static/请假.svg"
        alt=""
        class="svg-item"
        @click="
          () => {
            (isoverlay = true), (activeIndex = 1);
          }
        "
      />
      <img
        src="../static/创建工单.svg"
        alt=""
        class="svg-item"
        @click="router.push('/create')"
      />
    </div>
    <div class="data-card">
      <div style="font-size: 28rem; font-weight: 700; text-align: left">工作数据</div>
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
  width: 80%;
  background-color: #fff;
  border-radius: 24rem;
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
</style>
