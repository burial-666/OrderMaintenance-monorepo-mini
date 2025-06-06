<script setup>
import { ref, onMounted } from "vue";
import { SSOLoginAPI } from "../api/sso.js";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { login, getcode, getUserApi, loginSuccess } from "../api/user.js";
import useLoginStore from "../store/login.js";
const codeBtn = ref("获取验证码");
const route = useRoute();
const router = useRouter();
const phone_number = ref("");
const code = ref("");
const Login = async () => {
  if (phone_number.value.length !== 11) {
    ElMessage.error("请输入正确的手机号");
    return;
  }
  const res = await login(phone_number.value, code.value);
  if (res.data.code != 1) {
    return;
  }
  useLoginStore().setToken(res.data.token);
  useLoginStore().setId(res.data.userID);
  const respose = await getUserApi(res.data.userID);
  useLoginStore().setRoleId(respose.data.role_id);
  useLoginStore().setGroupId(respose.data.group_id);
  useLoginStore().setName(respose.data.name);
  useLoginStore().setPhoneNumber(respose.data.phone_number);
  useLoginStore().setStatus(respose.data.status);
  router.push("/home");
};
const GetCode = async () => {
  if (phone_number.value.length !== 11) {
    ElMessage.error("请输入正确的手机号");
    return;
  }
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
const redirect = () => {
  window.location.href =
    "https://auth.sztu.edu.cn/idp/oauth2/authorize?redirect_uri=https://sztuwork.sligenai.cn/login/login&state=state&client_id=work_order&response_type=code";
};
const SSOLogin = async () => {
  const code = route.query.code;
  if (!code) {
    return;
  }
  const res = await SSOLoginAPI(code, 1);
  if (res.data.code != 1) {
    return;
  }
  useLoginStore().setToken(res.data.token);
  useLoginStore().setId(res.data.userID);
  const respose = await getUserApi(res.data.userID);
  useLoginStore().setRoleId(respose.data.role_id);
  useLoginStore().setGroupId(respose.data.group_id);
  useLoginStore().setName(respose.data.name);
  useLoginStore().setPhoneNumber(respose.data.phone_number);
  useLoginStore().setStatus(respose.data.status);
  router.push("/home");
};
onMounted(() => {
  SSOLogin();
});
</script>
<template>
  <div class="frame">
    <div class="login-container">
      <div
        style="
          font-size: 3.2rem;
          font-weight: 700;
          color: rgba(37, 37, 37, 1);
          text-align: left;
        "
      >
        欢迎登录
      </div>
      <div style="display: flex; gap: 0.4rem; margin-top: 0.8rem; margin-bottom: 4.8rem">
        <div style="font-size: 2.4rem; font-weight: 400; color: rgba(37, 37, 37, 1)">
          深圳技术大学
        </div>
        <div style="font-size: 2.4rem; font-weight: 400; color: rgba(19, 86, 235, 1)">
          工单维保系统
        </div>
      </div>
      <div
        style="
          width: 40rem;
          height: 4rem;
          border-radius: 0.3rem;
          background: rgba(255, 255, 255, 1);
          border: 0.2rem solid rgba(153, 153, 153, 1);
          padding: 0 1.3rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2.4rem;
        "
      >
        <img src="../static/login.svg" alt="" style="width: 1.8rem; height: 1.8rem" />
        <input type="text" placeholder="请输入手机号" v-model="phone_number" />
      </div>
      <div style="display: flex; margin-bottom: 2.4rem">
        <input
          type="text"
          placeholder="请输入验证码"
          style="
            border: 0.2rem solid rgba(153, 153, 153, 1);
            width: 25.6rem;
            height: 4rem;
            padding-left: 1.2rem;
          "
          v-model="code"
          @keydown.enter="Login()"
        />
        <div
          class="button code-button"
          @click="GetCode()"
          :class="{ 'code-button-disabled': codeBtn !== '获取验证码' }"
        >
          {{ codeBtn }}
        </div>
      </div>
      <div
        style="
          font-size: 1.4rem;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
          text-align: left;
          margin-bottom: 3.2rem;
        "
      >
        未注册的手机号验证通过后将自动注册
      </div>
      <div
        style="
          background: rgba(0, 82, 217, 1);
          color: #fff;
          font-size: 1.6rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 4rem;
          width: 40rem;
          border-radius: 0.4rem;
          cursor: pointer;
          margin-bottom: 3.6rem;
        "
        class="button"
        @click="Login()"
      >
        登录
      </div>
      <div
        style="
          font-size: 1.4rem;
          font-weight: 400;
          color: rgba(0, 82, 217, 1);
          cursor: pointer;
        "
        @click="redirect()"
      >
        使用统一身份认证登录
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background: url("../static/web登录页.png") no-repeat center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-container {
  width: 80rem;
  height: 56rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 1.6rem;
  padding: 8.35rem 20rem 0 20rem;
}
input {
  height: 3.2rem;
  outline: none;
  border: none;
  border-radius: 0.4rem;
  font-size: 1.6rem;
  width: 23.4rem;
  font-weight: 400;
  padding: 0.6rem 0.5rem 0.5rem 0.5rem;
}
input::placeholder {
  color: #a8abb2;
  font-size: 1.6rem;
  font-weight: 400;
}
.button:hover {
  opacity: 0.8;
}
.code-button {
  background: rgba(0, 82, 217, 1);
  color: #fff;
  font-size: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  border-radius: 0.4rem;
  cursor: pointer;
  margin-left: 1.6rem;
  width: 12.8rem;
  height: 4rem;
}
.code-button-disabled {
  background-color: #a8abb2;
  cursor: not-allowed;
}
</style>
