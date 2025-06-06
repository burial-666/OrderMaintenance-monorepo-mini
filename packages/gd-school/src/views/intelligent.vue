<script setup>
import { useRouter } from "vue-router";
import useLoginStore from "../store/login.js";
const router = useRouter();
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
</script>
<template>
  <div class="intelligent">
    <div
      style="
        font-size: 48rem;
        font-weight: 700;
        color: white;
        position: absolute;
        top: 46rem;
        left: 48rem;
      "
    >
      欢迎使用
    </div>
    <div
      style="
        font-size: 32rem;
        font-weight: 700;
        color: white;
        position: absolute;
        top: 120rem;
        left: 48rem;
      "
    >
      深圳技术大学工单维保系统
    </div>
    <div class="user-card">
      <div>
        <div style="display: flex; align-items: center; gap: 16rem; margin-bottom: 8rem">
          <div style="font-size: 36rem; font-weight: 700">{{ useLoginStore().name }}</div>
          <div
            style="
              background-color: rgba(19, 86, 235, 1);
              color: #fff;
              padding: 0 16rem;
              border-radius: 6rem;
            "
          >
            {{ useLoginStore().user_id.length === 6 ? "教师" : "学生" }}
          </div>
        </div>
        <div style="display: flex; gap: 48rem; align-items: center; margin-bottom: 8rem">
          <div style="color: #999999; font-size: 28rem">学 号</div>
          <div style="text-align: left; font-size: 28rem; padding-top: 2rem">
            {{ useLoginStore().user_id }}
          </div>
        </div>
        <div style="display: flex; gap: 30rem; align-items: center; margin-bottom: 8rem">
          <div style="color: #999999; font-size: 28rem">手机号</div>
          <div style="text-align: left; font-size: 28rem; padding-top: 2rem">
            {{ useLoginStore().phone_number }}
          </div>
        </div>
      </div>
      <img
        src="../static/退出.svg"
        style="width: 48rem; height: 48rem"
        @click="logout()"
      />
    </div>
    <div style="width: 100%; height: 608rem">
      <img src="../static/Mask group.svg" style="width: 100%; height: 100%" />
    </div>
    <div class="content">
      <div style="width: 49%" @click="router.push('/AI')">
        <img src="../static/智慧运维.svg" alt="" style="width: 112rem; height: 152rem" />
      </div>
      <div style="width: 4rem; height: 224rem; background-color: #f2f2f2"></div>
      <div style="width: 49%" @click="router.push('/create')">
        <img
          src="../static/故障报修表单.svg"
          alt=""
          style="width: 168rem; height: 152rem"
        />
      </div>
    </div>
    <div
      style="
        width: 640rem;
        height: 96rem;
        border-radius: 32rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 8rem 8rem rgba(0, 0, 0, 0.25);
        position: absolute;
        top: 892rem;
        left: 55rem;
        display: flex;
        gap: 32rem;
        align-items: center;
      "
      @click="router.push('/createSoftware')"
      v-if="useLoginStore().user_id.length === 6"
    >
      <img
        src="../static/download.svg"
        style="width: 66rem; height: 66rem; margin-left: 36rem"
      />
      <div style="color: rgba(19, 86, 235, 1); font-size: 32rem; font-weight: 600">
        公共机房软件安装申请
      </div>
      <img
        src="../static/arrow.svg"
        style="width: 16rem; height: 27rem; margin-left: 108rem"
      />
    </div>
    <div
      style="
        width: 640rem;
        height: 96rem;
        border-radius: 32rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 8rem 8rem rgba(0, 0, 0, 0.25);
        position: absolute;
        top: 1022rem;
        left: 55rem;
        display: flex;
        gap: 32rem;
        align-items: center;
      "
      @click="router.push('/software')"
      v-if="useLoginStore().user_id.length === 6"
    >
      <img
        src="../static/file-text.svg"
        style="width: 66rem; height: 66rem; margin-left: 36rem"
      />
      <div style="color: rgba(19, 86, 235, 1); font-size: 32rem; font-weight: 600">
        我的软件安装申请
      </div>
      <img
        src="../static/arrow.svg"
        style="width: 16rem; height: 27rem; margin-left: 168rem"
      />
    </div>
  </div>
</template>

<style scoped>
.intelligent {
  width: 100%;
  min-height: calc(100vh - 112rem);
  height: calc(100vh - 112rem);
  position: relative;
  background-color: #f3f3f3;
}
.content {
  position: absolute;
  top: 564rem;
  left: 54rem;
  width: 640rem;
  height: 288rem;
  box-shadow: 0px 8rem 8rem rgba(0, 0, 0, 0.25);
  border-radius: 32rem;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
}
.user-card {
  width: 640rem;
  height: 198rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8rem 8rem rgba(0, 0, 0, 0.25);
  border-radius: 24rem;
  position: absolute;
  top: 342rem;
  left: 55rem;
  padding: 24rem 48rem;
  display: flex;
  justify-content: space-between;
}
</style>
