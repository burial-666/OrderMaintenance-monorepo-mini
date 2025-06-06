<script setup>
import { ref } from "vue";
import { createSoftwareApi } from "../api/work.js";
import { useRouter } from "vue-router";
import useLoginStore from "../store/login.js";
const router = useRouter();
const isoverlay = ref(false);
//创建工单
const Form = ref({
  teacherName: useLoginStore().name,
  teacherNumber: useLoginStore().user_id,
  contactPhone: useLoginStore().phone_number,
  department: "",
  courseName: "",
  classroomName: "",
  installCount: null,
  softwareVersion: "",
  description: "",
  applicant: "",
});
const createworkData = async () => {
  if (
    Form.value.department.trim() === "" ||
    Form.value.courseName.trim() === "" ||
    Form.value.classroomName.trim() === "" ||
    Form.value.installCount === null ||
    Form.value.softwareVersion.trim() === "" ||
    Form.value.description.trim() === "" ||
    Form.value.applicant.trim() === ""
  ) {
    showPopup("请填写完整信息");
    return;
  }
  Form.value.installCount = parseInt(Form.value.installCount);
  const res = await createSoftwareApi(Form.value);
  showPopup("创建成功");
  setTimeout(() => {
    router.push("/Tickets/myTickets");
  }, 1400);
};
const codeBtn = ref("确认提交");
const showComfirm = () => {
  if (
    Form.value.department?.trim() === "" ||
    Form.value.courseName?.trim() === "" ||
    Form.value.classroomName?.trim() === "" ||
    Form.value.installCount === null ||
    Form.value.softwareVersion?.trim() === "" ||
    Form.value.description?.trim() === "" ||
    Form.value.applicant?.trim() === ""
  ) {
    showPopup("请填写完整信息");
    return;
  }
  isoverlay.value = true;
  let time = 5;
  codeBtn.value = `确认提交 (${time})`;
  const timer = setInterval(() => {
    time--;
    codeBtn.value = `确认提交 (${time})`;
    if (time <= 0) {
      clearInterval(timer);
      codeBtn.value = "确认提交";
    }
  }, 1000);
};
// 弹窗
const message = ref("");
const showPopup = (value) => {
  message.value = value;
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
    <div class="navbar-title">软件安装申请</div>
  </div>
  <div class="frame">
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
    <div class="popup" v-if="isoverlay">
      <div style="padding: 48rem">
        <div
          style="
            font-size: 36rem;
            font-weight: 400;
            color: rgba(37, 37, 37, 1);
            margin-bottom: 12rem;
          "
        >
          注意事项
        </div>
        <div
          style="
            font-size: 28rem;
            font-weight: 400;
            color: rgba(91, 91, 91, 1);
            text-align: left;
          "
        >
          1.安装软件必须由申请单位（申请人）提供正版软件，我中心工作人员提供技术支持。<br />
          2.安装前请提前联系信息中心提交此表，我中心安排相关工作人员与申请单位（申请人）确定安装时间及安装流程。<br />
          3.在安装期间，申请人需到场提供技术指导，直至安装完成。<br />
          4.如有同一软件前后版本冲突，我部门将选择教学设备最优匹配的软件版本。<br />
          5.安装调试软件需要一定的准备时间，建议提前至两周提交申请表，否则可能因为时间不够导致软件安装失败，请悉知。
        </div>
      </div>
      <div style="border-bottom: 1px solid #ccc"></div>
      <div style="display: flex">
        <div
          style="
            width: 50%;
            height: 84rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid #ccc;
            color: rgba(91, 91, 91, 1);
          "
          @click="isoverlay = false"
        >
          取消
        </div>
        <div
          style="
            width: 50%;
            height: 84rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: rgba(19, 86, 235, 1);
          "
          @click="createworkData(), (isoverlay = false)"
          :class="{ 'code-button-disabled': codeBtn !== '确认提交' }"
        >
          {{ codeBtn }}
        </div>
      </div>
    </div>
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div class="input-item">
      <div style="font-size: 32rem">教师姓名</div>
      <input
        type="text"
        v-model="Form.teacherName"
        disabled
        style="
          border: none;
          outline: none;
          height: 56rem;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入姓名"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">教师工号</div>
      <input
        type="text"
        v-model="Form.teacherNumber"
        disabled
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入学号"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">联系电话</div>
      <input
        type="text"
        v-model="Form.contactPhone"
        disabled
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入学号"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">学院部门</div>
      <input
        type="text"
        v-model="Form.department"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">课程名称</div>
      <input
        type="text"
        v-model="Form.courseName"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem; text-align: left; max-width: 128rem">
        所安装房间名称
      </div>
      <input
        type="text"
        v-model="Form.classroomName"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">安装机数</div>
      <input
        type="text"
        v-model="Form.installCount"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem; text-align: left; max-width: 128rem">
        软件名称及版本
      </div>
      <input
        type="text"
        v-model="Form.softwareVersion"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">软件用途</div>
      <input
        type="text"
        v-model="Form.description"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item" style="gap: 130rem">
      <div style="font-size: 32rem; text-align: left">申请人</div>
      <input
        type="text"
        v-model="Form.applicant"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入"
      />
    </div>
    <div
      @click="showComfirm()"
      style="
        width: 100%;
        height: 100rem;
        margin-top: 64rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1356eb;
        color: white;
        font-size: 36rem;
        font-weight: 400;
        cursor: pointer;
        border-radius: 10rem;
      "
    >
      提交
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
  padding: 0 32rem;
  position: relative;
}
.input-item {
  display: flex;
  height: 112rem;
  align-items: center;
  gap: 102rem;
  user-select: none;
}
.popup {
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1003;
  background-color: #fff;
  border-radius: 24rem;
}
input::placeholder {
  font-size: 32rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
textarea::placeholder {
  font-size: 32rem;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.textarea-container {
  width: 464rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.textarea-container textarea {
  height: 80%;
  resize: none;
  width: 100%;
}
.upload-container {
  width: 152rem;
  height: 152rem;
  border: 1px dashed #dcdcdc;
  border-radius: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f3f3f3;
  position: relative;
}
.image-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 0;
  cursor: pointer;
}
::v-deep .el-select__wrapper {
  box-shadow: none !important;
  padding: 0;
}
::v-deep .el-select__placeholder {
  font-size: 32rem;
  font-weight: 400;
  color: #3b3c52;
}

.upload-container-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 534rem;
  gap: 10rem;
}

.image-preview-container {
  width: 152rem;
  height: 152rem;
  position: relative;
  border-radius: 10rem;
  overflow: hidden;
}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rem;
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
  z-index: 1001;
}

.cancel-upload {
  position: absolute;
  top: 5rem;
  right: 5rem;
  width: 30rem;
  height: 30rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20rem;
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
input:disabled {
  background-color: transparent;
}
.code-button-disabled {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
}
</style>
