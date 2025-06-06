<script setup>
import { ref, onMounted } from "vue";
import {
  getquestionsListApi,
  createquestionApi,
  deletequestionApi,
} from "../api/work.js";
import { getGroupListApi } from "../api/work.js";
import { ElMessage } from "element-plus";
const questionsList = ref([]);
const keyword = ref("");
const getQuestionsList = async () => {
  const res = await getquestionsListApi(
    page.value,
    pageSize.value,
    group_id.value,
    keyword.value
  );
  questionsList.value = res.data.data;
};
const group_id = ref();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const activeIndex = ref(1);
const isoverlay = ref(false);
const handleCurrentChange = (currentPage) => {
  page.value = currentPage;
  getAllWorkListData();
};
const groups = ref([]);
const getGroupListData = async () => {
  const res = await getGroupListApi();
  groups.value = res.data;
};
const questionContent = ref("");
const groupid = ref(0);
const createquestion = async () => {
  let data = {
    content: questionContent.value,
    group_id: groupid.value,
  };
  const res = await createquestionApi(data);
  ElMessage.success("创建成功");
  getQuestionsList();
};
onMounted(() => {
  getQuestionsList();
  getGroupListData();
});
// 选择问题
const selectedQuestions = ref([]);
const handleSelectionChange = (val) => {
  selectedQuestions.value = val;
};
// 删除问题
const deletequestion = async () => {
  for (let i = 0; i < selectedQuestions.value.length; i++) {
    const res = await deletequestionApi(selectedQuestions.value[i].ID);
  }
  ElMessage.success("删除成功");
  getQuestionsList();
};
</script>
<template>
  <div class="question">
    <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
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
          添加问题描述
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="width: 100%; padding: 1.6rem 3.2rem">
          <div class="label-container">
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 1 }"
              @click="groupid = 1"
            >
              IDC机房运维
            </div>
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 2 }"
              @click="groupid = 2"
            >
              系统运维
            </div>
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 3 }"
              @click="groupid = 3"
            >
              网络运维
            </div>
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 4 }"
              @click="groupid = 4"
            >
              学生机房运维
            </div>
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 5 }"
              @click="groupid = 5"
            >
              日常办公运维
            </div>
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 6 }"
              @click="groupid = 6"
            >
              行政会议保障运营
            </div>
            <div
              class="label-item"
              :class="{ 'selected-label': groupid === 7 }"
              @click="groupid = 7"
            >
              智慧教育团队
            </div>
          </div>
          <textarea
            v-model="questionContent"
            style="
              border: 1px solid #dcdfe6;
              outline: none;
              font-size: 1.4rem;
              font-weight: 400;
              color: black;
              resize: none;
              height: 12.8rem;
              border-radius: 0.4rem;
              padding: 1.2rem;
              width: 100%;
            "
            maxlength="60"
            placeholder="请详细描述问题发生的地点与问题故障"
          ></textarea>
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
                createquestion(), (isoverlay = false);
              }
            "
          >
            确定
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
          确定要删除选中的问题吗？
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
                deletequestion(), (isoverlay = false);
              }
            "
          >
            确认删除
          </div>
        </div>
      </div>
    </div>
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      问题管理
    </div>
    <div class="container">
      <div style="display: flex; gap: 2.4rem; align-items: center; margin-bottom: 1.2rem">
        <div class="content-title-item" style="margin-left: 1.2rem">
          <div style="font-size: 1.4rem; font-weight: 400">问题描述</div>
          <input type="text" placeholder="请输入" v-model="keyword" />
        </div>
        <div class="content-title-item">
          <div style="font-size: 1.4rem; font-weight: 400">所属组别</div>
          <el-select
            v-model="group_id"
            placeholder="请选择"
            style="width: 24.4rem; height: 3.2rem; min-height: none"
          >
            <el-option v-for="item in groups" :label="item.name" :value="item.ID" />
          </el-select>
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
            @click="getQuestionsList()"
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
            @click="(group_id = ''), (keyword = ''), getQuestionsList()"
          >
            重置
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2.4rem">
        <el-table
          :data="questionsList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" width="60" align="center">
            <template #default="scope">
              <div style="text-align: center">{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="问题描述" />
          <el-table-column prop="group_name" label="所属组别" />
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
      <div style="display: flex; margin-top: 2.4rem; gap: 1.2rem">
        <div
          style="
            width: 11.6rem;
            height: 3.2rem;
            border-radius: 0.3rem;
            background: rgba(19, 86, 235, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            cursor: pointer;
            font-size: 1.4rem;
            font-weight: 400;
          "
          class="button"
          @click="(isoverlay = true), (activeIndex = 1)"
        >
          添加问题描述
        </div>
        <div
          style="
            width: 11.6rem;
            height: 3.2rem;
            border-radius: 0.3rem;
            background: rgba(255, 17, 21, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            cursor: pointer;
            font-size: 1.4rem;
            font-weight: 400;
          "
          class="button"
          @click="(isoverlay = true), (activeIndex = 2)"
        >
          删除问题描述
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question {
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}
.popup {
  position: fixed;
  width: 30%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  background-color: #fff;
  border-radius: 1.2rem;
}
.label-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}
.label-item {
  padding: 0.8rem 1.2rem;
  border-radius: 0.4rem;
  background-color: #f5f5f5;
  font-size: 1.4rem;
  font-weight: 400;
  color: rgba(65, 65, 65, 1);
  cursor: pointer;
}
.selected-label {
  background-color: rgba(19, 86, 235, 1);
  color: #fff;
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
