<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import { getDashboardApi } from "../api/user.js";
import usePageStore from "../store/page.js";
const userData = ref({});
const getUserData = async () => {
  const res = await getDashboardApi(selectedEngineerID.value);
  userData.value = res.data;
};

//
const selectedEngineerID = ref(0);
const props = defineProps({
  selectedEngineerID: {
    type: Number,
    default: 0,
  },
});
watch(
  () => props.selectedEngineerID,
  (newVal) => {
    selectedEngineerID.value = newVal;
    usePageStore().setSelectedEngineerID(newVal);
    getUserData();
  }
);
onMounted(() => {
  selectedEngineerID.value = usePageStore().selectedEngineerID;
  getUserData();
});
</script>
<template>
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
</template>

<style scoped>
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
</style>
