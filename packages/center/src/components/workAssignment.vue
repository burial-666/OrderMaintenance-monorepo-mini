<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllWorkListApi, getGroupListApi } from "../api/work.js";
const router = useRouter();
const workList = ref([]);
const search = ref("");
const dateRange = ref("");
const getAllWorkListData = async () => {
  let startTime = "";
  let endTime = "";

  if (dateRange.value && dateRange.value.length === 2) {
    [startTime, endTime] = dateRange.value;
  }

  const res = await getAllWorkListApi(
    page.value,
    pageSize.value,
    search.value,
    selectedgroup.value,
    startTime,
    endTime
  );
  workList.value = res.data.data;
  total.value = res.data.total;
};
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const handleCurrentChange = (currentPage) => {
  page.value = currentPage;
  getAllWorkListData();
};
const goToDetail = (id) => {
  router.push(`/home/assignDetail?id=${id}`);
};
//获得选项列表
const selectedgroup = ref();
const groupList = ref([]);
const getGroupListData = async () => {
  const res = await getGroupListApi();
  groupList.value = res.data;
};
onMounted(() => {
  getAllWorkListData();
  getGroupListData();
});
</script>
<template>
  <div class="statistics">
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      工单派单
    </div>
    <div class="table-containter">
      <div class="table-header">
        <div style="display: flex; gap: 1.2rem; align-items: center">
          <div style="font-size: 1.4rem; flex: 0 0 auto">工程师/工单编号</div>
          <input type="text" placeholder="请输入" v-model="search" />
        </div>
        <div style="display: flex; gap: 1.2rem; align-items: center">
          <div style="font-size: 1.4rem; flex: 0 0 auto">所属组别</div>
          <el-select
            v-model="selectedgroup"
            placeholder="请选择"
            style="width: 14.4rem; height: 3.2rem; min-height: none"
          >
            <el-option
              v-for="item in groupList"
              :key="item.value"
              :label="item.name"
              :value="item.ID"
            />
          </el-select>
        </div>
        <div style="display: flex; gap: 1.2rem; align-items: center">
          <div style="font-size: 1.4rem; flex: 0 0 auto">起止时间</div>
          <div class="block">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :size="size"
              value-format="YYYY-MM-DD"
              style="width: 23.6rem; height: 3.2rem"
            />
          </div>
        </div>
        <div class="button" style="flex: 0 0 auto" @click="getAllWorkListData()">
          查询
        </div>
        <div
          class="button"
          style="background-color: #d9d9d9; flex: 0 0 auto; color: #303133"
          @click="
            (search = ''), (selectedgroup = ''), (dateRange = ''), getAllWorkListData()
          "
        >
          重置
        </div>
      </div>
      <el-table :data="workList" style="width: 100%">
        <el-table-column label="序号" width="60" align="center">
          <template #default="scope">
            <div style="text-align: center">{{ scope.$index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="submitted_at" label="提交时间" />
        <el-table-column prop="order_number" label="工单编号" />
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
              <span style="font-size: 1.4rem" v-if="scope.row.status === 0">待分配</span>
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 1"
                >已分配</span
              >
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 2"
                >已接单</span
              >
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 3"
                >已到达</span
              >
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 4"
                >挂单中</span
              >
              <span style="font-size: 1.4rem" v-else-if="scope.row.status === 5"
                >已完成</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <span class="blue-span" @click="goToDetail(scope.row.id)">查看详情</span>
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
