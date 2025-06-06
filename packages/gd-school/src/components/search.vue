<script setup>
import { ref, onMounted } from "vue";
import { getSearchListAPI, createSearchAPI } from "../api/search.js";
import { useRouter } from "vue-router";
const searchList = ref([]);
const getSearchListData = async () => {
  const res = await getSearchListAPI(10);
  searchList.value = res.data;
};
const router = useRouter();
const description = ref("");
const comeBack = () => {
  createSearch();
  router.push(`/Tickets/myTickets?description=${description.value}`);
};
const createSearch = () => {
  if (description.value === "") {
    return;
  }
  let data = {
    query: description.value,
  };
  createSearchAPI(data);
};
const goToSearch = (description) => {
  router.push(`/Tickets/myTickets?description=${description}`);
};
onMounted(() => {
  getSearchListData();
});
</script>
<template>
  <div class="frame">
    <div class="search">
      <div class="search-container">
        <img
          src="../../src/static/search.svg"
          style="width: 36rem; height: 36rem; margin: 12rem"
        />
        <!-- <div
          style="
            font-size: 30rem;
            color: rgb(182, 182, 182);
            width: 512rem;
            text-align: left;
            font-weight: 400;
          "
        >
          请输入问题描述
        </div> -->
        <input
          type="text"
          style="
            width: 512rem;
            border: none;
            padding: 12rem 32rem 12rem 0;
            font-size: 32rem;
            outline: none;
          "
          v-model="description"
          placeholder="请输入问题描述"
          @keyup.enter="comeBack()"
        />
        <div
          style="
            font-size: 24rem;
            width: 88rem;
            height: 48rem;
            background-color: #1356eb;
            border-radius: 32rem;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          "
          @click="comeBack()"
        >
          搜索
        </div>
      </div>
    </div>
    <div style="width: 100%">
      <div style="font-size: 24rem; text-align: left">历史记录</div>
      <div
        style="display: flex; flex-wrap: wrap; gap: 24rem; margin-top: 24rem; width: 100%"
      >
        <div
          style="
            font-size: 24rem;
            background: #fff;
            border-radius: 24rem;
            padding: 16rem;
            user-select: none;
            cursor: pointer;
          "
          v-for="(item, index) in searchList"
          :key="index"
          @click="goToSearch(item.query)"
        >
          {{ item.query }}
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
  min-height: 100vh;
  height: 100vh;
  overflow-y: hidden;
}
.search {
  width: 100%;
  height: 80rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rem;
}
.search-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 36rem;
}
.filter {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12rem;
}
input::placeholder {
  font-size: 32rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
</style>
