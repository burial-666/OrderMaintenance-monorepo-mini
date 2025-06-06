<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { autoAssignmentApi, getAutoAssignmentStatusApi } from "../../api/work.js";
const router = useRouter();
const activeIndex = ref();
const route = useRoute();
const isoverlay = ref(false);
const assginment = ref(false);
const isAutoAssign = ref(false);
const updateOverlay = (value1, value2) => {
  isoverlay.value = value1;
  assginment.value = value2;
};

const handleClick = (index) => {
  activeIndex.value = index;
  if (index === 1) {
    router.push("/Tickets/myTickets");
  } else if (index === 2) {
    router.push("/Tickets/my");
  }
};

const check = () => {
  if (route.path === "/Tickets/myTickets") {
    activeIndex.value = 1;
  } else if (route.path === "/Tickets/my") {
    activeIndex.value = 2;
  }
};
//获取自动分配状态
const getAutoAssignmentStatusData = async () => {
  const res = await getAutoAssignmentStatusApi();
  isAutoAssign.value = res.data.enabled;
};
//开启自动分配
const useAutoAssignment = () => {
  let data = {
    enabled: isAutoAssign.value,
  };
  const res = autoAssignmentApi(data);
};
watch(
  route,
  (newRoute) => {
    check();
  },
  { immediate: true }
);
onMounted(() => {
  getAutoAssignmentStatusData();
});
</script>
<template>
  <div class="frame" style="font-size: 36rem">
    <div class="overlay" v-if="isoverlay" @click="updateOverlay(false, false)"></div>
    <div class="assginmet-container" v-if="assginment">
      <div class="confirm">
        <div style="width: 100%; display: flex; flex-direction: column; padding: 48rem">
          <div>分配设置</div>
          <div style="display: flex; justify-content: space-between; margin-top: 24rem">
            <div>自动分配</div>
            <input type="checkbox" id="switch" v-model="isAutoAssign" />
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
                updateOverlay(false, false), useAutoAssignment();
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
            @click="updateOverlay(false, false)"
          >
            取消
          </div>
        </div>
      </div>
    </div>
    <router-view @updateOverlay="updateOverlay" />
    <div class="nav">
      <div
        class="nav-item1"
        :class="{ 'item1-active': activeIndex === 1 }"
        @click="handleClick(1)"
      ></div>
      <div
        class="nav-item2"
        :class="{ 'item2-active': activeIndex === 2 }"
        @click="handleClick(2)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@import "./index.css";
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.assginmet-container {
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  border-radius: 24rem;
}
.confirm {
  width: 100%;
}
input[type="checkbox"] {
  position: relative;
  width: 80rem;
  height: 40rem;
  -webkit-appearance: none;
  background: #c6c6c6;
  outline: none;
  border-radius: 40rem;
  transition: background 0.3s;
  cursor: pointer;
  margin-left: 16rem;
}

input[type="checkbox"]:checked {
  background: #3b82f6;
}
input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 4rem;
  left: 4rem;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  transition: 0.3s;
  background: #fff;
}

input[type="checkbox"]:checked::before {
  left: 44rem;
}
</style>
