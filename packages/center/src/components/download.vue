<script setup>
import { ref, onMounted } from "vue";
import {
  getSoftwareListApi,
  getSoftwareDetailApi,
  approveSoftwareApi,
} from "../api/software.js";
import { ElMessage } from "element-plus";
const usersList = ref([]);
const activeIndex = ref(0);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const isoverlay = ref(false);
//获取数据列表
const softwareList = ref([]);
const getSoftwareListData = async () => {
  const res = await getSoftwareListApi(page.value, pageSize.value);
  softwareList.value = res.data.data;
  total.value = res.data.total;
};
const handleCurrentChange = (currentPage) => {
  page.value = currentPage;
  getSoftwareListData();
};
//获取当前选中的工单编号
const currentSoftwareId = ref(0);
const handleSoftwareClick = (id) => {
  currentSoftwareId.value = id;
};
//获取详细数据
const softwareDetail = ref({});
const getSoftwareDetailData = async (id) => {
  const res = await getSoftwareDetailApi(id);
  softwareDetail.value = res.data;
};
//审批软件
const approveSoftware = async (id, status) => {
  let data = {
    remark: "",
    status,
  };
  await approveSoftwareApi(id, data);
  getSoftwareListData();
};
onMounted(() => {
  getSoftwareListData();
});
</script>
<template>
  <div class="people">
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
    <div class="popup2" v-if="isoverlay && activeIndex === 0">
      <div style="width: 100%">
        <div
          style="
            width: 100%;
            height: 5.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            font-weight: 500;
            color: rgba(65, 65, 65, 1);
            padding: 4.8rem 3.2rem;
          "
        >
          确定要退回软件安装申请吗？
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div
          style="
            height: 8rem;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 3.2rem;
          "
        >
          <div
            class="button"
            style="
              width: 8rem;
              height: 4rem;
              background: rgba(217, 217, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
              margin-right: 1.2rem;
            "
            @click="
              () => {
                isoverlay = false;
              }
            "
          >
            取消
          </div>
          <div
            class="button"
            style="
              width: 10rem;
              height: 4rem;
              background: rgba(0, 82, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
            "
            @click="
              () => {
                (isoverlay = false), approveSoftware(currentSoftwareId, 2);
              }
            "
          >
            确认退回
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-if="isoverlay && activeIndex === 1">
      <div style="width: 100%">
        <div
          style="
            width: 100%;
            height: 5.4rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 1.6rem;
            font-weight: 700;
            color: rgba(65, 65, 65, 1);
            padding: 2.4rem 3.2rem;
          "
        >
          软件安装申请信息详细
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="padding: 2.4rem 3.2rem">
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              教师姓名
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.applicant }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              教师学号
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.teacherNumber }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              学院部门
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.department }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              联系电话
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.contactPhone }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              所安装房间名称
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.classroomName }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              安装机数
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.installCount }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              软件名称及版本
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.softwareVersion }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              软件用途
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.description }}
            </div>
          </div>
          <div
            style="
              display: flex;
              gap: 1.6rem;
              margin-bottom: 1.8rem;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div
              style="font-size: 1.4rem; font-weight: 400; color: #999999; flex: 0 0 auto"
            >
              申请时间
            </div>
            <div style="font-size: 1.4rem; font-weight: 400; color: #414141">
              {{ softwareDetail.updatedAt }}
            </div>
          </div>
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div
          style="
            height: 8rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            class="button"
            style="
              width: 8rem;
              height: 4rem;
              background: rgba(0, 82, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
            "
            @click="
              () => {
                isoverlay = false;
              }
            "
          >
            返回
          </div>
        </div>
      </div>
    </div>
    <div class="popup2" v-if="isoverlay && activeIndex === 2">
      <div style="width: 100%">
        <div
          style="
            width: 100%;
            height: 5.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            font-weight: 500;
            color: rgba(65, 65, 65, 1);
            padding: 4.8rem 3.2rem;
          "
        >
          确定要批准安装申请吗？
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div
          style="
            height: 8rem;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 3.2rem;
          "
        >
          <div
            class="button"
            style="
              width: 8rem;
              height: 4rem;
              background: rgba(217, 217, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
              margin-right: 1.2rem;
            "
            @click="
              () => {
                isoverlay = false;
              }
            "
          >
            取消
          </div>
          <div
            class="button"
            style="
              width: 10rem;
              height: 4rem;
              background: rgba(0, 82, 217, 1);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0.6rem;
              cursor: pointer;
              font-size: 1.6rem;
              font-weight: 400;
              color: #fff;
            "
            @click="
              () => {
                (isoverlay = false), approveSoftware(currentSoftwareId, 1);
              }
            "
          >
            确认批准
          </div>
        </div>
      </div>
    </div>
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      软件安装
    </div>
    <div class="container">
      <div style="display: flex; gap: 2.4rem; align-items: center; margin-bottom: 1.2rem">
        <div class="content-title-item" style="margin-left: 1.2rem">
          <div style="font-size: 1.4rem; font-weight: 400; flex: 0 0 auto">
            姓名/联系方式
          </div>
          <input type="text" placeholder="请输入" />
        </div>
        <div style="margin-left: auto; display: flex; gap: 1.2rem">
          <div
            style="
              border-radius: 0.3rem;
              background: rgba(19, 86, 235, 1);
              width: 6rem;
              height: 3.2rem;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              cursor: pointer;
              font-size: 1.4rem;
              font-weight: 400;
            "
            class="button"
            @click="getUsersListData()"
          >
            查询
          </div>
          <div
            style="
              border-radius: 0.3rem;
              background: rgba(217, 217, 217, 1);
              width: 6rem;
              height: 3.2rem;
              display: flex;
              justify-content: center;
              align-items: center;
              color: rgba(65, 65, 65, 1);
              cursor: pointer;
              font-size: 1.4rem;
              font-weight: 400;
            "
            class="button"
            @click="(search_group_id = ''), getUsersListData()"
          >
            重置
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2.4rem">
        <el-table :data="softwareList" style="width: 100%">
          <el-table-column label="序号" width="60" align="center">
            <template #default="scope">
              <div style="text-align: center">{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="applicant" label="教师姓名" width="80" />
          <el-table-column prop="classroomName" label="安装地点" />
          <el-table-column prop="softwareVersion" label="软件名称及版本" />
          <el-table-column prop="updatedAt" label="提交时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <span
                class="blue-span"
                style="margin-right: 1.8rem"
                @click="
                  getSoftwareDetailData(scope.row.id),
                    (isoverlay = true),
                    (activeIndex = 1)
                "
                >查看详细</span
              >
              <span
                class="blue-span"
                style="margin-right: 1.8rem"
                @click="
                  handleSoftwareClick(scope.row.id), (isoverlay = true), (activeIndex = 2)
                "
                v-if="scope.row.status === 0"
                >批准</span
              >
              <span
                class="red-span"
                style="margin-right: 1.8rem"
                @click="
                  handleSoftwareClick(scope.row.id), (isoverlay = true), (activeIndex = 0)
                "
                v-if="scope.row.status === 0"
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
  </div>
</template>

<style scoped>
.people {
  width: 100%;
  margin: 2.4rem;
}
.container {
  width: 100%;
  background-color: #fff;
  padding: 2.4rem 1.8rem;
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
}
.content-title-item {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  height: 3.2rem;
}
input {
  height: 3.2rem;
  outline: none;
  border: 1px solid #dcdfe6;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  width: 16.4rem;
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
::v-deep .el-select__wrapper {
  font-size: 1.4rem;
  border-radius: 0.4rem;
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
.green-span {
  color: #53c31a;
  font-size: 1.4rem;
  user-select: none;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.popup {
  position: fixed;
  width: 30%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background-color: #fff;
  border-radius: 1.2rem;
}
.popup2 {
  position: fixed;
  width: 25%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  background-color: #fff;
  border-radius: 1.2rem;
}
</style>
