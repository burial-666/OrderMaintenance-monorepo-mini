<script setup>
import { ref, onMounted } from "vue";
import { getFreeDayListAPI, updateFreeDayAPI } from "../api/freeday.js";
import { getGroupListApi } from "../api/work.js";
const freedayList = ref([]);
const getFreeDayListData = async () => {
  const res = await getFreeDayListAPI(page.value, pageSize.value);
  freedayList.value = res.data.data;
  total.value = res.data.total;
};
const groupList = ref([]);
const selectedgroup = ref();
const getGroupListData = async () => {
  const res = await getGroupListApi();
  groupList.value = res.data;
};
const updateFreeDay = async (id, status) => {
  let data = {
    status: status,
  };
  const res = await updateFreeDayAPI(id, data);
  getFreeDayListData();
};
const size = ref("default");
const value2 = ref("");
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const handleCurrentChange = (currentPage) => {
  page.value = currentPage;
  getFreeDayListData();
};
onMounted(() => {
  getFreeDayListData();
  getGroupListData();
});
</script>
<template>
  <div class="statistics">
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      请假审批
    </div>
    <div class="table-containter">
      <el-table :data="freedayList" style="width: 100%">
        <el-table-column label="序号" width="60" align="center">
          <template #default="scope">
            <div style="text-align: center">{{ scope.$index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="姓名" />
        <el-table-column prop="reason" label="请假理由阐述" />
        <el-table-column prop="group_name" label="所属组别" />
        <el-table-column label="状态">
          <template #default="scope">
            <div style="display: flex; align-items: center; gap: 1.2rem">
              <div
                class="circle"
                v-if="scope.row.status === 0"
                style="background-color: #faad0f"
              ></div>
              <div
                class="circle"
                v-else-if="scope.row.status === 1"
                style="background-color: #ff4d50"
              ></div>
              <div
                class="circle"
                v-else-if="scope.row.status === 2"
                style="background-color: #1790ff"
              ></div>
              <div
                class="circle"
                v-else-if="scope.row.status === 3"
                style="background-color: #1356eb"
              ></div>
              <div
                class="circle"
                v-else-if="scope.row.status === 4"
                style="background-color: #fa800f"
              ></div>
              <div
                class="circle"
                v-else-if="scope.row.status === 5"
                style="background-color: #53c31a"
              ></div>
              <span style="font-size: 1.4rem" v-if="scope.row.status === 0">在岗</span>
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 1"
                >休息</span
              >
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 2"
                >在岗</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <span
              class="blue-span"
              style="margin-right: 1.8rem"
              @click="updateFreeDay(scope.row.id, 1)"
              v-if="scope.row.status === 0"
              >批准</span
            >
            <span
              class="red-span"
              v-if="scope.row.status === 0"
              @click="updateFreeDay(scope.row.id, 2)"
              >退回</span
            >
            <span class="green-span" v-if="scope.row.status === 1">已批准</span>
            <span class="red-span" v-if="scope.row.status === 2">已退回</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        background
        style="align-self: flex-end; margin-bottom: 1rem; margin-right: 2.5%"
      />
    </div>
  </div>
</template>

<style scoped>
.statistics {
  width: 100%;
  margin: 2.4rem;
  border-radius: 0.6rem;
}
.ststatistics-header {
  display: flex;
  gap: 4.2rem;
  margin-bottom: 2.2rem;
}
.ststatistics-header > div {
  flex: 0 1 calc(33.33% - 2.733rem);
  background: #ffffff;
  border-radius: 0.6rem;
  width: calc(33.33% - 2.733rem);
  height: 21.6rem;
}
.table-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2.4rem;
  flex-wrap: wrap;
}
.table-header > div {
  flex: 0 1 auto;
}
.table-containter {
  padding: 2.4rem;
  border-radius: 0.6rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}
input {
  height: 3.2rem;
  outline: none;
  border: 1px solid #dcdfe6;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  width: 14.4rem;
  padding: 0.6rem;
}
input::placeholder {
  color: #a8abb2;
}
::v-deep .el-select__wrapper {
  box-shadow: 0 0 0 1px #dcdfe6 !important;
  min-height: 0 !important;
  height: 3.2rem;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.2rem;
  width: 6.4rem;
  color: #ffffff;
  background: #1356eb;
  border-radius: 0.4rem;
  cursor: pointer;
  user-select: none;
  font-size: 1.4rem;
}
.button:hover {
  opacity: 0.8;
}
.blue-span {
  color: #147ad6;
  font-size: 1.4rem;
  cursor: pointer;
}
.red-span {
  color: rgba(255, 17, 21, 1);
  font-size: 1.4rem;
  cursor: pointer;
}
.gray-span {
  color: rgba(153, 153, 153, 1);
  font-size: 1.4rem;
  user-select: none;
}
.green-span {
  color: #53c31a;
  font-size: 1.4rem;
  user-select: none;
}
.circle {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
}
::v-deep .el-range-input {
  font-size: 1.4rem;
}
::v-deep .el-select__wrapper {
  font-size: 1.4rem;
  border-radius: 0.4rem;
}
</style>
