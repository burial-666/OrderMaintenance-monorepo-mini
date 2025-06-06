<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const activeIndex = ref();
const route = useRoute();
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
watch(
  route,
  (newRoute) => {
    check();
  },
  { immediate: true }
);
</script>
<template>
  <div class="frame" style="font-size: 36rem">
    <router-view />
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
</style>
