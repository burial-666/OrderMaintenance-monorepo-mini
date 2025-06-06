<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllWorkListApi, getGroupListApi, exportWorkDataApi } from "../api/work.js";
import EChartsPie from "./eChartsPie.vue";
import EChartsBar from "./eChartsBar.vue";
import EChartLine from "./eChartLine.vue";
import { ElMessage } from "element-plus";
import {
  getPieEchratsApi,
  getBarEchratsApi,
  getLineEchratsApi,
} from "../api/eChratsData.js";
const router = useRouter();
const selectedgroup = ref();
const workList = ref([]);
const search = ref("");
const showWorkList = ref([]);
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
const download = (data, name) => {
  let url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
};
const exportData = async () => {
  let startTime = "";
  let endTime = "";
  if (!dateRange.value || dateRange.value.length !== 2) {
    ElMessage.error("请选择日期范围");
    return;
  }
  if (dateRange.value && dateRange.value.length === 2) {
    [startTime, endTime] = dateRange.value;
    startTime = startTime + " 00:00";
    endTime = endTime + " 00:00";
  }
  let data = {
    start_time: startTime,
    end_time: endTime,
  };
  const res = await exportWorkDataApi(data);
  const fileUrl = res.data.url;

  // 发起新的请求获取 Blob 数据
  try {
    const fileResponse = await fetch(fileUrl);
    const fileBlob = await fileResponse.blob();
    download(fileBlob, "“工单维保”工单统计表.xlsx");
  } catch (error) {
    console.error("文件下载失败:", error);
    ElMessage.error("文件下载失败");
  }
  download(res.data.url, "“工单维保”工单统计表.xlsx");
};
// 获取饼图数据
const pieChartData = ref([]);
const barChartData = ref([]);
const lineChartData = ref([]);
const getPieEchratsData = async () => {
  const res = await getPieEchratsApi();
  pieChartData.value = Object.entries(res.data.distribution).map(([key, value]) => ({
    name: key,
    value: value,
    itemStyle: {
      color: getStatusColor(key),
    },
  }));
};
// 获取柱状图数据
const getBarEchratsData = async () => {
  const res = await getBarEchratsApi();
  // 将categories和values数组组合成所需的数据格式
  barChartData.value = res.data.categories.map((name, index) => ({
    name: name,
    value: res.data.values[index],
  }));
};
// 获取折线图数据
const getLineEchratsData = async () => {
  const res = await getLineEchratsApi();
  // 将categories和values数组组合成所需的数据格式
  lineChartData.value = res.data.categories.map((date, index) => ({
    date: date,
    value: res.data.values[index],
  }));
};
const options = ref([]);
const size = ref("default");
const value2 = ref("");
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const handleCurrentChange = (currentPage) => {
  page.value = currentPage;
  getAllWorkListData();
};
const goToDetail = (id) => {
  router.push(`/home/detail?id=${id}`);
};
onMounted(() => {
  getAllWorkListData();
  getGroupListData();
  showWorkList.value = workList.value;
  getPieEchratsData();
  getBarEchratsData();
  getLineEchratsData();
});
const getGroupListData = async () => {
  const res = await getGroupListApi();
  options.value = res.data;
};

// 获取状态对应的颜色
const getStatusColor = (status) => {
  const colorMap = {
    已分配: "#ff4d50",
    已到达: "#1356eb",
    已完成: "#53c31a",
    已接单: "#1790ff",
    待分配: "#faad0f",
    挂单中: "#fa800f",
  };
  return colorMap[status];
};
</script>
<template>
  <div class="statistics">
    <div class="ststatistics-header">
      <div class="chart-container">
        <div class="chart-title">工单状态分布</div>
        <EChartsPie :data="pieChartData" />
      </div>
      <div class="chart-container">
        <div class="chart-title">工单类型统计</div>
        <EChartsBar :data="barChartData" />
      </div>
      <div class="chart-container">
        <div class="chart-title">工单趋势统计</div>
        <EChartLine :data="lineChartData" />
      </div>
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
              v-for="item in options"
              :key="item.ID"
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
        <el-button type="success" @click="exportData"
          >导出"工单维保系统"工单统计表</el-button
        >
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
        <el-table-column prop="engineer_name" label="工程师" />
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
        <el-table-column prop="response_time" label="响应时间" />
        <el-table-column prop="arrival_time" label="到场时间" />
        <el-table-column prop="resolved_time" label="解决时间" />
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

.chart-container {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #303133;
}
</style>
