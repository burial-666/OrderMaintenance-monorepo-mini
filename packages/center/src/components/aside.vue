<script setup>
import IconBase from "../svg/IconBase.vue";
import Assignment from "../svg/assignment.vue";
import Freeday from "../svg/freeday.vue";
import StatisticsIcon from "../svg/StatisticsIcon.vue";
import Create from "../svg/create.vue";
import Question from "../svg/question.vue";
import people from "../svg/people.vue";
import download from "../svg/download.vue";
import robot from "../svg/robot.vue";
const PushToRobot = () => {
  window.location.href = "https://sztuwork.sligenai.cn/sztuaiBack";
};
</script>
<template>
  <div class="aside">
    <router-link class="item" to="/home/Statistics">
      <IconBase fontSize="2.4rem">
        <StatisticsIcon />
      </IconBase>
      <div style="font-size: 1.6rem">报表统计</div>
    </router-link>
    <router-link class="item" to="/home/assignment">
      <IconBase fontSize="2.4rem">
        <Assignment />
      </IconBase>
      <div style="font-size: 1.6rem">工单派单</div>
    </router-link>
    <router-link class="item" to="/home/freeday">
      <IconBase fontSize="2.4rem">
        <Freeday />
      </IconBase>
      <div style="font-size: 1.6rem">请假审批</div>
    </router-link>
    <router-link class="item" to="/home/download">
      <IconBase fontSize="2.4rem">
        <download />
      </IconBase>
      <div style="font-size: 1.6rem">软件安装</div>
    </router-link>
    <router-link class="item" to="/home/createTicket">
      <IconBase fontSize="2.4rem">
        <Create />
      </IconBase>
      <div style="font-size: 1.6rem">创建工单</div>
    </router-link>
    <router-link class="item" to="/home/question">
      <IconBase fontSize="2.4rem">
        <Question />
      </IconBase>
      <div style="font-size: 1.6rem">问题管理</div>
    </router-link>
    <router-link class="item" to="/home/people">
      <IconBase fontSize="2.4rem">
        <people />
      </IconBase>
      <div style="font-size: 1.6rem">人员管理</div>
    </router-link>
    <!-- <div class="item" style="cursor: pointer" @click="PushToRobot()">
      <IconBase fontSize="2.4rem">
        <robot />
      </IconBase>
      <div style="font-size: 1.6rem">智能体管理</div>
    </div> -->
  </div>
</template>

<style scoped>
.aside {
  width: 23.2rem;
  min-height: calc(100vh - 6.4rem);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1.8rem 0.9rem;
  gap: 1.2rem;
  user-select: none;
}
.item {
  display: flex;
  min-width: 21.4rem;
  font-size: 1.6rem;
  padding: 2.2rem;
  gap: 0.8rem;
  height: 3.8rem;
  align-items: center;
  font-weight: 500;
  border-radius: 0.4rem;
}
.router-link-active {
  background-color: #dfe8ff;
  color: #1356eb;
}
.item:not(.router-link-active):hover {
  background-color: #f5f5f5;
}
</style>
