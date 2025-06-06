<script setup>
import { ref, onMounted } from "vue";
import {
  getUsersList,
  createUserApi,
  deleteUserApi,
  getUserApi,
  updateUserApi,
} from "../api/user.js";
import { getGroupListApi } from "../api/work.js";
import { ElMessage } from "element-plus";
const usersList = ref([]);
const search_group_id = ref(null);
const roleIdString = "1,2";
const user_name_or_phone_number = ref("");
const getUsersListData = async () => {
  const res = await getUsersList(
    page.value,
    pageSize.value,
    search_group_id.value,
    roleIdString,
    user_name_or_phone_number.value
  );
  usersList.value = res.data.users;
  total.value = res.data.total;
};
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const isoverlay = ref(false);
const name = ref("");
const activeIndex = ref(0);
const phone_number = ref("");
const create_group_id = ref();
const user_id = ref("");
const role = ref(null);
const roles = ref([
  { label: "工程师", value: 1 },
  { label: "组长", value: 2 },
]);
const handleCurrentChange = (currentPage) => {
  page.value = currentPage;
  getUsersListData();
};
//清除人员信息
const clearUserInfo = () => {
  name.value = "";
  phone_number.value = "";
  role.value = null;
  user_id.value = "";
  create_group_id.value = null;
};
//获取组别列表
const groups = ref([]);
const getGroupListData = async () => {
  const res = await getGroupListApi();
  groups.value = res.data;
};
// 新增人员
const createUser = async () => {
  if (role.value === 3) {
    create_group_id.value = 0;
  }
  let data = {
    group_id: create_group_id.value,
    name: name.value,
    phone_number: phone_number.value,
    role_id: role.value,
    user_id: user_id.value,
  };
  const res = await createUserApi(data);
  ElMessage.success("新增成功");
  getUsersListData();
};
//删除人员
const selectId = ref(null);
const selectcurrentId = (val) => {
  selectId.value = val;
};
const deleteUser = async () => {
  const res = await deleteUserApi(selectId.value);
  ElMessage.success("删除成功");
  getUsersListData();
};
//获取单个人员信息
const getUserData = async (id) => {
  name.value = "";
  phone_number.value = "";
  role.value = 0;
  user_id.value = "";
  create_group_id.value = "";
  const res = await getUserApi(id);
  selectId.value = id;
  name.value = res.data.name;
  phone_number.value = res.data.phone_number;
  role.value = res.data.role_id;
  user_id.value = res.data.user_id;
  create_group_id.value = res.data.group_id;
};
//修改人员信息
const updateUser = async () => {
  let data = {
    group_id: create_group_id.value,
    name: name.value,
    phone_number: phone_number.value,
    role_id: role.value,
    user_id: user_id.value,
  };
  const res = await updateUserApi(selectId.value, data);
  ElMessage.success("修改成功");

  getUsersListData();
};
onMounted(() => {
  getUsersListData();
  getGroupListData();
});
</script>
<template>
  <div class="people">
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
          添加人员
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="padding: 2.4rem 3.2rem">
          <div
            style="display: flex; gap: 5rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              姓名
            </div>
            <input type="text" style="width: 24.4rem" v-model="name" />
          </div>
          <div
            style="display: flex; gap: 1.6rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              学号/工号
            </div>
            <input type="text" style="width: 24.4rem" v-model="user_id" />
          </div>
          <div
            style="
              display: flex;
              gap: 2.2rem;
              margin-bottom: 1.8rem;
              align-items: center;
              flex: 0 0 auto;
            "
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              联系方式
            </div>
            <input type="text" style="width: 24.4rem" v-model="phone_number" />
          </div>
          <div
            style="display: flex; gap: 2.2rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              所属组别
            </div>
            <el-select
              v-model="create_group_id"
              placeholder="请选择"
              style="width: 24.4rem; height: 3.2rem; min-height: none"
            >
              <el-option v-for="item in groups" :label="item.name" :value="item.ID" />
            </el-select>
          </div>
          <div
            style="display: flex; gap: 5rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              权限
            </div>
            <el-select
              v-model="role"
              placeholder="请选择"
              style="width: 24.4rem; height: 3.2rem; min-height: none"
            >
              <el-option v-for="item in roles" :label="item.label" :value="item.value" />
            </el-select>
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
                createUser(), (isoverlay = false);
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
          确定要删除选中的人员吗？
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
                deleteUser(), (isoverlay = false);
              }
            "
          >
            确认删除
          </div>
        </div>
      </div>
    </div>
    <div class="popup" v-if="isoverlay && activeIndex === 3">
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
          更新人员信息
        </div>
        <div style="border-bottom: 1px solid #ccc"></div>
        <div style="padding: 2.4rem 3.2rem">
          <div
            style="display: flex; gap: 5rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              姓名
            </div>
            <input type="text" style="width: 24.4rem" v-model="name" />
          </div>
          <div
            style="display: flex; gap: 1.6rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              学号/工号
            </div>
            <input type="text" style="width: 24.4rem" v-model="user_id" />
          </div>
          <div
            style="
              display: flex;
              gap: 2.2rem;
              margin-bottom: 1.8rem;
              align-items: center;
              flex: 0 0 auto;
            "
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              联系方式
            </div>
            <input type="text" style="width: 24.4rem" v-model="phone_number" />
          </div>
          <div
            style="display: flex; gap: 2.2rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              所属组别
            </div>
            <el-select
              v-model="create_group_id"
              placeholder="请选择"
              style="width: 24.4rem; height: 3.2rem; min-height: none"
            >
              <el-option v-for="item in groups" :label="item.name" :value="item.ID" />
            </el-select>
          </div>
          <div
            style="display: flex; gap: 5rem; margin-bottom: 1.8rem; align-items: center"
          >
            <div
              style="
                font-size: 1.4rem;
                font-weight: 400;
                color: rgba(37, 37, 37, 1);
                flex: 0 0 auto;
              "
            >
              权限
            </div>
            <el-select
              v-model="role"
              placeholder="请选择"
              style="width: 24.4rem; height: 3.2rem; min-height: none"
            >
              <el-option v-for="item in roles" :label="item.label" :value="item.value" />
            </el-select>
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
                updateUser(), (isoverlay = false);
              }
            "
          >
            确定
          </div>
        </div>
      </div>
    </div>
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      人员管理
    </div>
    <div class="container">
      <div style="display: flex; gap: 2.4rem; align-items: center; margin-bottom: 1.2rem">
        <div class="content-title-item" style="margin-left: 1.2rem">
          <div style="font-size: 1.4rem; font-weight: 400; flex: 0 0 auto">
            姓名/联系方式
          </div>
          <input type="text" placeholder="请输入" v-model="user_name_or_phone_number" />
        </div>
        <div class="content-title-item">
          <div style="font-size: 1.4rem; font-weight: 400; flex: 0 0 auto">所属组别</div>
          <el-select
            v-model="search_group_id"
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
            @click="
              (search_group_id = ''), (user_name_or_phone_number = ''), getUsersListData()
            "
          >
            重置
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2.4rem">
        <el-table :data="usersList" style="width: 100%">
          <el-table-column label="序号" width="60" align="center">
            <template #default="scope">
              <div style="text-align: center">{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="80" />
          <el-table-column prop="phone_number" label="联系方式" />
          <el-table-column label="所属组别">
            <template #default="scope">
              <span>{{ scope.row.role_id === 0 ? "教职工" : scope.row.group_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="role" label="权限" />
          <el-table-column label="操作">
            <template #default="scope">
              <span
                class="blue-span"
                style="margin-right: 1.8rem"
                @click="getUserData(scope.row.id), (isoverlay = true), (activeIndex = 3)"
                >管理</span
              >
              <span
                class="red-span"
                @click="
                  selectcurrentId(scope.row.id), (isoverlay = true), (activeIndex = 2)
                "
                >删除</span
              >
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
          @click="(isoverlay = true), (activeIndex = 1), clearUserInfo()"
        >
          添加人员
        </div>
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
