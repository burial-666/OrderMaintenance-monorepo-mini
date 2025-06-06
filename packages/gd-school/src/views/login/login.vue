<script setup>
import { ref } from "vue";
import { login, getcode } from "../../api/user.js";
import useLoginStore from "../../store/login.js";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const phone_number = ref("");
const code = ref("");
const codeBtn = ref("获取验证码");
const message = ref("发送成功");
const router = useRouter();
const Login = async () => {
  const res = await login(phone_number.value, code.value);
  if (res.data.code != 1) {
    return;
  }
  useLoginStore().setToken(res.data.token);
  useLoginStore().setId(res.data.userID);
  console.log(res.data.token);
  router.push("/Tickets/create");
};

const GetCode = async () => {
  if (phone_number.value.length !== 11) {
    ElMessage.error("请输入正确的手机号");
    return;
  }
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
  let time = 60;
  codeBtn.value = `${time}秒后重发`;
  const timer = setInterval(() => {
    time--;
    codeBtn.value = `${time}秒后重发`;
    if (time <= 0) {
      clearInterval(timer);
      codeBtn.value = "获取验证码";
    }
  }, 1000);
  const res = await getcode(phone_number.value);
};
</script>
<template>
  <div class="frame">
    <div class="message" id="message">
      <img src="../../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div class="title">
      <span style="font-size: 64rem; font-weight: 700; text-align: left">欢迎登录</span>
      <span style="font-size: 48rem; font-weight: 400; text-align: left"
        >深圳技术大学工单维保系统</span
      >
    </div>
    <div class="main-content">
      <div class="username">
        <div style="font-size: 32rem">用户名</div>
        <input
          type="text"
          v-model="phone_number"
          placeholder="请输入手机号"
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
        />
      </div>
      <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
      <div class="password">
        <div style="font-size: 32rem; margin-right: 72rem">验证码</div>
        <input
          type="text"
          v-model="code"
          placeholder="请输入验证码"
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
            width: 322rem;
          "
        />
        <div
          style="
            height: 50%;
            width: 1px;
            background-color: #ccc;
            margin-top: 25%;
            margin-bottom: 25%;
            margin-left: 32rem;
          "
        ></div>
        <div
          class="code-button"
          @click="GetCode()"
          :class="{ 'code-button-disabled': codeBtn !== '获取验证码' }"
        >
          {{ codeBtn }}
        </div>
      </div>
      <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
      <div
        style="
          font-size: 28rem;
          font-weight: 400;
          color: rgba(182, 182, 182, 1);
          margin-top: 32rem;
          text-align: left;
        "
      >
        未注册的手机号验证通过后将自动注册
      </div>
    </div>
    <div
      style="
        color: #0052d9;
        font-size: 28rem;
        cursor: pointer;
        text-align: center;
        margin-top: 32rem;
      "
    >
      使用统一身份认证登录
    </div>
    <div class="button" @click="Login">登录</div>
  </div>
</template>

<style scoped>
@import "./index.css";
.code-button {
  font-size: 32rem;
  margin-left: 22rem;
  color: #0052d9;
}
.code-button-disabled {
  color: rgba(149, 178, 224, 1);
  cursor: not-allowed;
  pointer-events: none;
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
