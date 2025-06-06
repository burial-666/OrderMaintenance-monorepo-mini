<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  manualAssignmentApi,
  getWorkDetailApi,
  getWorkLogsListApi,
  getPhoneAndNameApi,
  updateWorkStatusApi,
  getGroupListApi,
  returnWorkStatusApi,
  deleteWorkApi,
} from "../api/work.js";
import { getUsersListApi } from "../api/user.js";
import useLoginStore from "../store/login.js";
import upload from "./upload.vue";
const route = useRoute();
const router = useRouter();
const workid = route.query.id;
const activeIndex = ref(0);
const isoverlay = ref(false);
const message = ref("");
//判断弹窗类型
const takeOrder = () => {
  isoverlay.value = true;
  activeIndex.value = 0;
};
const assignEngineers = () => {
  isoverlay.value = true;
  activeIndex.value = 1;
  getUsersListData();
};
const transferGroup = () => {
  isoverlay.value = true;
  activeIndex.value = 2;
};
const Arrive = () => {
  isoverlay.value = true;
  activeIndex.value = 3;
};
const Finish = () => {
  isoverlay.value = true;
  activeIndex.value = 4;
};
const Pending = () => {
  isoverlay.value = true;
  activeIndex.value = 5;
};
const EndPending = () => {
  isoverlay.value = true;
  activeIndex.value = 6;
};
const detele = () => {
  isoverlay.value = true;
  activeIndex.value = 7;
};
const returnWork = async () => {
  let data = { remarks: "退回工单" };
  const res = await returnWorkStatusApi(workid, data);
};
//消息弹窗信息
const showPopup = (index) => {
  if (index === 0) {
    message.value = "接单成功";
  } else if (index === 1) {
    message.value = "分配成功";
  } else if (index === 2) {
    message.value = "转组成功";
  } else if (index === 3) {
    message.value = "打卡成功";
  } else if (index === 4) {
    message.value = "工单已完成";
  } else if (index === 5) {
    message.value = "挂单成功";
  } else if (index === 6) {
    message.value = "已结束挂单";
  } else if (index === 7) {
    message.value = "退回成功";
  }
  isoverlay.value = false;
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");

  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
  setTimeout(() => {
    router.push("/Tickets/myTickets");
  }, 1400);
};
const showtextPopup = (val) => {
  message.value = val;
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");

  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
};
//分配工程师
const selectEngineerstep = ref(0);
const selectedEngineers = ref([]);
const selectedEngineerIds = ref([]);
const selectedEngineerId = ref(0);
const MakeSelectEngineerStep1 = () => {
  if (selectedEngineers.value.length === 0) {
    showtextPopup("不能为空");
    return;
  } else if (selectedEngineers.value.length === 1) {
    showtextPopup("分配成功");
    manualAssignmentData();
    selectEngineerstep.value = 0;
    isoverlay.value = false;
    setTimeout(() => {
      router.push("/Tickets/myTickets");
    }, 1400);
  } else {
    selectEngineerstep.value = 1;
    selecteEngineer();
  }
};
const JudegeEngineerSelection = () => {
  selectedEngineers.value = usersList.value.filter(
    (user, index) => selectedUsers.value[index]
  );
};
const selecteEngineer = () => {
  selectedEngineers.value = usersList.value.filter(
    (user, index) => selectedUsers.value[index]
  ); // 过滤仅选中工程师
  selectedEngineerIds.value = usersList.value
    .filter((user, index) => selectedUsers.value[index])
    .map((user) => user.id);
  selectedUsers.value = new Array(selectedEngineers.value.length).fill(false);
};
const manualAssignmentData = async () => {
  if (selectedEngineers.value.length === 1) {
    selectedEngineerIds.value = [selectedEngineers.value[0].id];
    selectedEngineerId.value = selectedEngineers.value[0].id;
  } else {
    selectedEngineerId.value = selectedEngineers.value
      .filter((user, index) => selectedUsers.value[index]) // 过滤仅选中工程师
      .map((user) => user.id); // 提取被选中工程师的 ID
    selectedEngineerId.value = selectedEngineerId.value[0];
  }
  let data = {
    engineers: selectedEngineerIds.value,
    main_engineer_id: selectedEngineerId.value,
  };
  await manualAssignmentApi(workid, data);
  let updatedata = {
    new_engineer_id: selectedEngineerId.value,
    new_group_id: useLoginStore().group_id,
    new_status: 1,
    operation: "已分配",
  };
  updateWorkStatusApi(workid, updatedata);
};
//获取工单详情
const detailData = ref({});
const getWorkDetailData = async () => {
  const res = await getWorkDetailApi(workid);
  detailData.value = res.data;
};
//获取工单日志记录
const workLogsList = ref([]);
const getWorkLogsListData = async () => {
  const res = await getWorkLogsListApi(workid);
  workLogsList.value = res.data;
};
//获得工单负责人姓名和电话
const getPhoneAndNameData = async () => {
  if (detailData.value.status === 0) {
    return;
  }
  const res = await getPhoneAndNameApi(workid);
  Object.assign(detailData.value, res.data);
};
//获取工程师列表
const selectedUsers = ref([]);
const usersList = ref([]);
const getUsersListData = async () => {
  const res = await getUsersListApi(1, 100, 0, 1, useLoginStore().group_id);
  usersList.value = res.data.users;
  selectedUsers.value = new Array(usersList.value.length).fill(false);
};
//组长接单
const groupTakeOrders = async () => {
  let assaigndata = {
    engineers: [useLoginStore().id],
    main_engineer_id: useLoginStore().id,
  };
  await manualAssignmentApi(workid, assaigndata);
  let updatedata = {
    new_engineer_id: useLoginStore().id,
    new_group_id: useLoginStore().group_id,
    new_status: 1,
    operation: "已分配",
  };
  await updateWorkStatusApi(workid, updatedata);
  let data = {
    new_engineer_id: useLoginStore().id,
    new_group_id: useLoginStore().group_id,
    new_status: 2,
    operation: "已接单",
  };
  const res = updateWorkStatusApi(workid, data);
};
//删除工单
const deleteWork = () => {
  const res = deleteWorkApi(workid);
};
//预览图片
const previewImage = ref(null);
const showPreview = ref(false);
const openPreview = (image) => {
  previewImage.value = image;
  showPreview.value = true;
};
const closePreview = () => {
  showPreview.value = false;
};
//组长已到达
const groupArrive = () => {
  let data = {
    new_engineer_id: useLoginStore().id,
    new_group_id: useLoginStore().group_id,
    new_status: 3,
    photos: Photos.value,
    operation: "已到达",
  };
  const res = updateWorkStatusApi(workid, data);
};
//组长完成
const groupFinish = () => {
  let data = {
    new_engineer_id: useLoginStore().id,
    new_group_id: useLoginStore().group_id,
    new_status: 5,
    photos: Photos.value,
    operation: "已完成",
  };
  const res = updateWorkStatusApi(workid, data);
};
//组长挂单
const groupPendingOrders = () => {
  let data = {
    new_engineer_id: useLoginStore().id,
    new_group_id: useLoginStore().group_id,
    new_status: 4,
    operation: "已挂单",
  };
  const res = updateWorkStatusApi(workid, data);
};
//组长结束挂单
const groupEndPendingOrders = () => {
  let data = {
    new_engineer_id: useLoginStore().id,
    new_group_id: useLoginStore().group_id,
    new_status: 3,
    operation: "挂单结束",
  };
  const res = updateWorkStatusApi(workid, data);
};
//获得图片
const Photos = ref([]);
const sendPhotos = (val) => {
  Photos.value = val; // 更新 Photos 的值
};
//获取所有组数据
const selectedGroups = ref([]);
const groupList = ref([]);
const getGroupListData = async () => {
  const res = await getGroupListApi();
  groupList.value = res.data;
  groupList.value = groupList.value.filter(
    (group) => group.ID !== useLoginStore().group_id
  );
  selectedGroups.value = new Array(groupList.value.length).fill(false);
};
//转组
const transferGroupData = async () => {
  const selectedGroupIds = groupList.value
    .filter((group, index) => selectedGroups.value[index])
    .map((group) => group.ID);
  const selectedGroupId = selectedGroupIds[0];
  let data = {
    new_engineer_id: 0,
    new_group_id: selectedGroupId,
    new_status: 0,
    operation: "已转组",
  };
  const res = updateWorkStatusApi(workid, data);
};
onMounted(async () => {
  getWorkLogsListData();
  getGroupListData();
  await getWorkDetailData();
  getPhoneAndNameData();
});

// 在 selectedGroups 发生变化时进行检查和限制
const handleGroupSelection = (index) => {
  // 先将所有选项设为 false
  selectedGroups.value = selectedGroups.value.map(() => false);
  // 只设置当前选中的为 true
  selectedGroups.value[index] = true;
};
const handleEngineerSelection = (index) => {
  // 先将所有选项设为 false
  selectedUsers.value = selectedUsers.value.map(() => false);
  // 只设置当前选中的为 true
  selectedUsers.value[index] = true;
  // 设置选中的工程师ID
  selectedEngineerId.value = selectedEngineers.value[index].id;
};
</script>
<template>
  <div class="top-navbar">
    <img
      src="../static/back.svg"
      style="width: 16rem; height: 26rem"
      @click="() => router.back()"
    />
    <div class="navbar-title">工单详情</div>
  </div>
  <div class="frame">
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
    <div class="popup" v-if="isoverlay">
      <div class="confirm" v-if="activeIndex === 0">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          你确定要接单吗？
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
              {
                showPopup(activeIndex), groupTakeOrders();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
      <div class="engineers" v-if="activeIndex === 1 && selectEngineerstep === 0">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 108rem;
          "
        >
          分配工程师
        </div>
        <div style="padding: 36rem 48rem; max-height: 900rem; overflow-y: scroll">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 60rem;
            "
            v-for="(item, index) in usersList"
          >
            <div style="font-size: 32rem; font-weight: 500">{{ item.name }}</div>
            <div style="display: flex; gap: 24rem; align-items: center">
              <div
                style="
                  background-color: #1356eb;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 48rem;
                  width: 102rem;
                  border-radius: 16rem;
                  cursor: pointer;
                  font-size: 24rem;
                "
                v-if="item.role_id === 1"
              >
                工程师
              </div>
              <div
                style="
                  background-color: #1356eb;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 48rem;
                  width: 102rem;
                  border-radius: 16rem;
                  cursor: pointer;
                  font-size: 24rem;
                "
                v-if="item.role_id === 2"
              >
                组长
              </div>
              <label
                style="
                  display: block;
                  width: 40rem;
                  height: 40rem;
                  border-radius: 50%;
                  border: 1px solid #ccc;
                "
                :class="{ 'select-circle-active': selectedUsers[index] }"
              >
                <input
                  type="checkbox"
                  style="display: none"
                  v-model="selectedUsers[index]"
                  @change="JudegeEngineerSelection(index)"
                />
              </label>
            </div>
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
                MakeSelectEngineerStep1();
              }
            "
          >
            {{ selectedEngineers.length > 1 ? "下一步" : "确认" }}
          </div>
          <div
            style="
              width: 50%;
              height: 84rem;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            @click="(isoverlay = false), (selectedEngineers = [])"
          >
            取消
          </div>
        </div>
      </div>
      <div class="engineers" v-if="activeIndex === 1 && selectEngineerstep === 1">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 108rem;
          "
        >
          选择主工程师
        </div>
        <div style="padding: 36rem 48rem; max-height: 900rem; overflow-y: scroll">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 60rem;
            "
            v-for="(item, index) in selectedEngineers"
          >
            <div style="font-size: 32rem; font-weight: 500">{{ item.name }}</div>
            <div style="display: flex; gap: 24rem; align-items: center">
              <div
                style="
                  background-color: #1356eb;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 48rem;
                  width: 102rem;
                  border-radius: 16rem;
                  cursor: pointer;
                  font-size: 24rem;
                "
                v-if="item.role_id === 1"
              >
                工程师
              </div>
              <div
                style="
                  background-color: #1356eb;
                  color: #fff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 48rem;
                  width: 102rem;
                  border-radius: 16rem;
                  cursor: pointer;
                  font-size: 24rem;
                "
                v-if="item.role_id === 2"
              >
                组长
              </div>
              <label
                style="
                  display: block;
                  width: 40rem;
                  height: 40rem;
                  border-radius: 50%;
                  border: 1px solid #ccc;
                "
                :class="{ 'select-circle-active': selectedUsers[index] }"
              >
                <input
                  type="checkbox"
                  style="display: none"
                  :checked="selectedUsers[index]"
                  @change="handleEngineerSelection(index)"
                />
              </label>
            </div>
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
                showPopup(activeIndex), manualAssignmentData(), (selectEngineerstep = 0);
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
            @click="
              (isoverlay = false), (selectEngineerstep = 0), (selectedEngineers = [])
            "
          >
            取消
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 2">
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 108rem;
          "
        >
          转组
        </div>
        <div style="padding: 36rem 48rem">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 60rem;
              position: relative;
            "
            v-for="(item, index) in groupList"
          >
            <div style="font-size: 32rem; font-weight: 500">{{ item.name }}</div>
            <input
              type="checkbox"
              :checked="selectedGroups[index]"
              @change="handleGroupSelection(index)"
            />
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
                showPopup(activeIndex), transferGroupData();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 3">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          到达打卡
        </div>
        <div
          style="width: 100%; display: flex; justify-content: center; align-items: center"
        >
          <upload @sendPhotos="sendPhotos" />
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
              {
                showPopup(activeIndex), groupArrive();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 4">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          完成打卡
        </div>
        <div
          style="width: 100%; display: flex; justify-content: center; align-items: center"
        >
          <upload @sendPhotos="sendPhotos" />
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
              {
                showPopup(activeIndex), groupFinish();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 5">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          确定要挂单吗？
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
              {
                showPopup(activeIndex), groupPendingOrders();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 6">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          确定要结束挂单吗？
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
              {
                showPopup(activeIndex), groupEndPendingOrders();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
      <div style="width: 100%" v-if="activeIndex === 7">
        <div
          style="
            width: 100%;
            height: 108rem;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          你确定要退回工单吗？
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
                showPopup(activeIndex), returnWork();
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
            @click="isoverlay = false"
          >
            取消
          </div>
        </div>
      </div>
    </div>
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div class="container" style="margin-bottom: 40rem">
      <div class="item">
        <div class="text-left">工单编号</div>
        <div class="text-right">{{ detailData.order_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">工单状态</div>
        <div class="text-right" style="display: flex; align-items: center; gap: 16rem">
          <div
            class="status-circle"
            v-if="detailData.status === 0"
            style="background-color: #faad0f"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 1"
            style="background-color: #ff4d50"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 2"
            style="background-color: #1790ff"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 3"
            style="background-color: #1356eb"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 4"
            style="background-color: #fa800f"
          ></div>
          <div
            class="status-circle"
            v-else-if="detailData.status === 5"
            style="background-color: #53c31a"
          ></div>
          <span v-if="detailData.status === 0">待分配</span>
          <span v-else-if="detailData.status === 1">待接单</span>
          <span v-else-if="detailData.status === 2">已接单</span>
          <span v-else-if="detailData.status === 3">已到达</span>
          <span v-else-if="detailData.status === 4">挂单中</span>
          <span v-else-if="detailData.status === 5">已完成</span>
        </div>
      </div>
      <div class="item">
        <div class="text-left">问题描述</div>
        <div class="text-right">{{ detailData.problem_content }}</div>
      </div>
      <div class="item">
        <div class="text-left">所属组别</div>
        <div class="text-right">{{ detailData.group_name }}</div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div class="text-left">问题详细</div>
        <div class="text-right">
          {{ detailData.details }}
        </div>
      </div>
      <div class="picture-item">
        <div class="picture-container-wrap">
          <div class="picture-container" v-for="img in detailData.photos">
            <img :src="img.url" @click="openPreview(img.url)" />
          </div>
        </div>
      </div>
      <div class="item">
        <div class="text-left">提交人</div>
        <div class="text-right">{{ detailData.name }}</div>
      </div>
      <div class="item">
        <div class="text-left">联系方式</div>
        <div class="text-right">{{ detailData.phone_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">地点</div>
        <div class="text-right">{{ detailData.location }}</div>
      </div>
      <div class="item">
        <div class="text-left">提交时间</div>
        <div class="text-right">
          {{ new Date(detailData.CreatedAt).toLocaleString() }}
        </div>
      </div>
    </div>
    <div class="container">
      <div class="item" v-if="detailData.status !== 0 && detailData.status !== 1">
        <div class="text-left">工程师</div>
        <div class="text-right">{{ detailData.engineer_name }}</div>
      </div>
      <div class="item" v-if="detailData.status !== 0 && detailData.status !== 1">
        <div class="text-left">联系方式</div>
        <div class="text-right">{{ detailData.engineer_phone_number }}</div>
      </div>
      <div class="item">
        <div class="text-left">进度</div>
      </div>
      <div class="order-container">
        <div class="order-container-item" v-for="(item, index) in workLogsList">
          <div class="order-left">
            <div class="circle" v-if="index !== workLogsList.length - 1"></div>
            <div
              class="circle"
              style="background-color: #1356eb; margin-top: 28rem"
              v-if="index === workLogsList.length - 1"
            ></div>
            <div class="line" v-if="index !== workLogsList.length - 1"></div>
          </div>
          <div class="order-right">
            <div class="order-status">
              {{ item.work_order_status_log.operation }}
            </div>
            <div
              class="picture-container-wrap"
              style="justify-content: flex-start"
              v-if="item.photos.length > 0"
            >
              <div class="picture-container" v-for="img in item.photos" :key="img.id">
                <img :src="img.url" @click="openPreview(img.url)" />
              </div>
            </div>
            <div class="order-time">
              {{ item.work_order_status_log.change_time }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <div
        class="button-item"
        style="background-color: #1356eb; color: #fff"
        @click="takeOrder()"
        v-if="detailData.status === 0"
      >
        接单
      </div>
      <div
        class="button-item"
        style="color: #1356eb; background-color: #fff; border: 3rem solid #1356eb"
        @click="assignEngineers()"
        v-if="detailData.status === 0"
      >
        分配工程师
      </div>
      <div
        class="button-item"
        style="color: #1356eb; background-color: #fff; border: 3rem solid #1356eb"
        @click="transferGroup()"
        v-if="detailData.status === 0"
      >
        转组
      </div>
      <div
        class="button-item"
        style="background-color: #1356eb; color: #fff"
        @click="Arrive()"
        v-if="detailData.status === 2 && detailData.is_main_engineer === true"
      >
        我已到达
      </div>
      <div
        class="button-item"
        style="background-color: #1356eb; color: #fff"
        @click="Finish()"
        v-if="detailData.status === 3 && detailData.is_main_engineer === true"
      >
        我已完成
      </div>
      <div
        class="button-item"
        style="color: #1356eb; background-color: #fff; border: 3rem solid #1356eb"
        @click="Pending()"
        v-if="detailData.status === 3 && detailData.is_main_engineer === true"
      >
        挂单
      </div>
      <div
        class="button-item"
        style="background-color: #ff4d50; color: #fff"
        @click="detele()"
        v-if="detailData.status === 4 && detailData.is_main_engineer === true"
      >
        退回
      </div>
      <div
        class="button-item"
        style="color: #ff4d50; background-color: #fff; border: 3rem solid #ff4d50"
        @click="EndPending()"
        v-if="detailData.status === 4 && detailData.is_main_engineer === true"
      >
        结束挂单
      </div>
    </div>
    <div v-if="showPreview" class="preview-overlay" @click="closePreview">
      <div class="preview-container">
        <img :src="previewImage" class="preview-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-navbar {
  background-color: #fff;
  height: 92rem;
  display: flex;
  align-items: center;
  padding: 0 32rem;
  position: relative;
}
.navbar-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 36rem;
}
.frame {
  width: 100%;
  min-height: calc(100vh - 92rem);
  padding: 24rem 32rem;
  background-color: #f5f5f5;
  position: relative;
}
.engineers {
  width: 100%;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.message {
  position: fixed;
  width: 240rem;
  height: 220rem;
  background: rgba(0, 0, 0, 0.8);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24rem;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s;
}
.show {
  visibility: visible;
  opacity: 1;
}
.popup {
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  border-radius: 24rem;
}
.container {
  width: 100%;
  background-color: #fff;
  border-radius: 16rem;
  display: flex;
  flex-direction: column;
  gap: 24rem;
  padding: 24rem 32rem;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.select-circle {
  width: 40rem;
  height: 40rem;
  border: 3rem solid #999999;
  border-radius: 50%;
}
.select-circle-active {
  background-color: #1356eb;
  position: relative; /* 添加定位属性 */
  border: 0.01px solid #1356eb;
}

.select-circle-active::after {
  content: "✔";
  color: white;
  font-size: 25rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.text-left {
  font-size: 28rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
.text-right {
  font-size: 28rem;
  font-weight: 400;
  color: rgba(37, 37, 37, 1);
  max-width: 400rem;
  text-align: left;
}
.picture-item {
  margin-left: auto;
}
.picture-container-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 340rem;
  gap: 24rem;
}
.picture-container {
  width: 152rem;
  height: 152rem;
}
.picture-container img {
  width: 100%;
  height: 100%;
  border-radius: 16rem;
  object-fit: cover;
}
.order-container {
  display: flex;
  flex-direction: column;
  gap: 24rem;
}
.order-container-item {
  display: flex;
  margin-left: 80rem;
  gap: 24rem;
}
.order-left {
  display: flex;
  flex-direction: column;
  gap: 12rem;
  align-items: center;
}
.circle {
  width: 16rem;
  height: 16rem;
  border-radius: 50%;
  background-color: #fff;
  border: 2rem solid #1356eb;
  flex: 0 0 auto;
}
.line {
  width: 1px;
  height: 100%;
  background-color: #1356eb;
}
.order-right {
  display: flex;
  flex-direction: column;
  gap: 12rem;
  align-items: flex-start;
}
.order-status {
  text-align: left;
  font-size: 28rem;
  font-weight: 400;
}
.order-time {
  text-align: left;
  font-size: 20rem;
  font-weight: 400;
  color: rgba(153, 1);
}
.button-container {
  margin-top: 64rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rem;
}
.button-item {
  width: 100%;
  height: 96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16rem;
  cursor: pointer;
}
.confirm {
  width: 100%;
}
.status-circle {
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
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
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-container {
  max-width: 90%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
