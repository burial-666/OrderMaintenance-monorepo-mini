<script setup>
import { ref } from "vue";
import { createWorkApi } from "../api/work.js";
import { uploadApi } from "../api/upload.js";
import { useRouter } from "vue-router";
import useLoginStore from "../store/login.js";
import Scrollview from "./questionScroll.vue";
import LocationScroll from "./locationScroll.vue";
const scrolltype = ref(1);
const fileInput = ref(null);
const imagePreviewList = ref([]);
const router = useRouter();
const uploadingImages = ref([]); // 新增：用于跟踪正在上传的图片
const isOver = ref(false);
// 新增: 预览大图
const previewImage = ref(null);
const showPreview = ref(false);

const openPreview = (image) => {
  previewImage.value = image.url;
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
};

// 修改: 取消上传的图片
const cancelUpload = (imageId) => {
  const canceledImage = imagePreviewList.value.find((img) => img.id === imageId);
  if (canceledImage) {
    imagePreviewList.value = imagePreviewList.value.filter((img) => img.id !== imageId);
    uploadingImages.value = uploadingImages.value.filter((id) => id !== imageId);
    Form.value.photos = Form.value.photos.filter(
      (photo) => photo.url !== canceledImage.url
    );
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/") && file.size <= 1024 * 1024 * 8) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageId = Date.now() + i; // 创建唯一ID
          imagePreviewList.value.push({ id: imageId, url: e.target.result });
          uploadingImages.value.push(imageId); // 标记为正在上传
          handleUpload(file, imageId);
        };
        reader.readAsDataURL(file);
      }
    }
  }
};

// 修改: 上传文件
const handleUpload = async (file, imageId) => {
  try {
    const res = await uploadApi(file);
    const photoObject = {
      url: res.data.url,
    };
    Form.value.photos.push(photoObject);
    // 上传完成后，更新imagePreviewList中的url
    const index = imagePreviewList.value.findIndex((img) => img.id === imageId);
    if (index !== -1) {
      imagePreviewList.value[index].url = res.data.url;
    }
    // 从uploadingImages中移除
    uploadingImages.value = uploadingImages.value.filter((id) => id !== imageId);
  } catch (error) {
    console.error("上传失败:", error);
    // 上传失败时，从列表中移除
    imagePreviewList.value = imagePreviewList.value.filter((img) => img.id !== imageId);
    uploadingImages.value = uploadingImages.value.filter((id) => id !== imageId);
  }
};
//创建工单
const Form = ref({
  name: "",
  studentNumber: "",
  phone_number: "",
  location: "",
  details: "",
  engineer_id: 0,
  user_id: 0,
  problem_id: 0,
  group_id: 0,
  photos: [],
  problem_content: "",
  user_id: useLoginStore().id,
});
const createworkData = async () => {
  if (
    !Form.value.name?.trim() ||
    !Form.value.studentNumber?.trim() ||
    !Form.value.phone_number?.trim() ||
    !Form.value.location?.trim() ||
    !Form.value.details?.trim() ||
    !Form.value.problem_content?.trim()
  ) {
    message.value = "请填写所有必填信息！";
    const messageElement = document.getElementById("message");
    messageElement.classList.add("show");
    setTimeout(() => {
      messageElement.classList.remove("show");
    }, 1000);
    return; // 如果信息不完整，停止执行
  }
  const res = await createWorkApi(Form.value);
  showPopup();
};
// 弹窗
const message = ref("");
const showPopup = () => {
  message.value = "创建成功";
  const messageElement = document.getElementById("message");
  messageElement.classList.add("show");
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 1000);
  setTimeout(() => {
    router.push("/Tickets/myTickets");
  }, 1400);
};
//选择问题类型
const ScrollLeave = ref(false);
const isoverlay = ref(false);
const isScroll = ref(false);
const seletQuestionType = () => {
  isoverlay.value = true;
  isScroll.value = true;
};
//子传父
const sendQuestion = (group_id, id, name, flag) => {
  Form.value.group_id = group_id;
  Form.value.problem_id = id;
  Form.value.problem_content = name;
  setTimeout(() => {
    isScroll.value = flag;
    ScrollLeave.value = false;
    isOver.value = false;
  }, 280);
  ScrollLeave.value = true;
  isOver.value = true;
  isoverlay.value = flag; // 添加这行，确保overlay也被关闭
};
const sendLocation = (location) => {
  Form.value.location = location;
  setTimeout(() => {
    isScroll.value = false;
    ScrollLeave.value = false;
    isOver.value = false;
  }, 280);
  ScrollLeave.value = true;
  isOver.value = true;
  isoverlay.value = false;
};
const cancel = (flag) => {
  // 添加这个方法
  setTimeout(() => {
    isScroll.value = flag;
    ScrollLeave.value = false;
    isOver.value = false;
  }, 280);
  ScrollLeave.value = true;
  isOver.value = true;
  isoverlay.value = flag;
};
</script>

<template>
  <div class="top-navbar">
    <img
      src="../static/back.svg"
      style="width: 16rem; height: 26rem"
      @click="() => router.back()"
    />
    <div class="navbar-title">故障报修表单</div>
  </div>
  <div class="frame">
    <div class="overlay" v-if="isoverlay" @click="cancel(false)"></div>
    <div class="Translateover" v-if="isOver"></div>
    <div class="scroll" v-if="isScroll" :class="{ 'Scroll-leave': ScrollLeave }">
      <Scrollview @sendQuestion="sendQuestion" @cancel="cancel" v-if="scrolltype === 0" />
      <LocationScroll
        @sendLocation="sendLocation"
        @cancel="cancel"
        v-if="scrolltype === 1"
      />
    </div>
    <div class="message" id="message">
      <img src="../static/success.svg" alt="" style="width: 64rem; height: 64rem" />
      <div style="color: #fff">{{ message }}</div>
    </div>
    <div class="input-item">
      <div style="font-size: 32rem">姓名</div>
      <input
        type="text"
        v-model="Form.name"
        style="
          border: none;
          outline: none;
          height: 56rem;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入姓名"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item">
      <div style="font-size: 32rem">学号</div>
      <input
        type="text"
        v-model="Form.studentNumber"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入学号"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div class="input-item" style="gap: 37rem">
      <div style="font-size: 32rem">电话号码</div>
      <input
        type="text"
        v-model="Form.phone_number"
        maxlength="11"
        style="
          border: none;
          outline: none;
          padding-bottom: 8rem;
          height: 56rem;
          padding-top: 8rem;
          font-size: 32rem;
          font-weight: 400;
          color: black;
        "
        placeholder="请输入电话号码"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div
      class="input-item"
      style="gap: 44rem"
      @click="(isoverlay = true), (isScroll = true), (scrolltype = 1)"
    >
      <div style="font-size: 32rem">故障地点</div>
      <div
        style="font-size: 32rem; font-weight: 400; color: rgba(153, 153, 153, 1)"
        v-if="Form.location === ''"
      >
        请选择故障地点
      </div>
      <div
        style="font-size: 32rem; font-weight: 400; color: #414141"
        v-if="Form.location !== ''"
      >
        {{ Form.location }}
      </div>
      <img
        src="../static/union.svg"
        alt=""
        style="width: 16rem; height: 26rem; margin-left: auto; margin-right: 40rem"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div
      class="input-item"
      style="gap: 44rem"
      @click="(isoverlay = true), (isScroll = true), (scrolltype = 0)"
    >
      <div style="font-size: 32rem; flex: 0 0 auto">问题描述</div>
      <div
        style="font-size: 32rem; font-weight: 400; color: rgba(153, 153, 153, 1)"
        v-if="Form.problem_content === ''"
      >
        请选择问题类型
      </div>
      <div
        style="font-size: 32rem; font-weight: 400; color: #414141; text-align: left"
        v-if="Form.problem_content !== ''"
      >
        {{ Form.problem_content }}
      </div>
      <img
        src="../static/union.svg"
        alt=""
        style="width: 16rem; height: 26rem; margin-left: auto; margin-right: 40rem"
      />
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div
      class="input-item"
      style="height: 312rem; align-items: flex-start; padding-top: 32rem; gap: 37rem"
    >
      <div style="font-size: 32rem">问题详细</div>
      <div class="textarea-container">
        <textarea
          v-model="Form.details"
          style="
            border: none;
            outline: none;
            font-size: 32rem;
            font-weight: 400;
            color: black;
          "
          maxlength="60"
          placeholder="请详细描述问题发生的地点与问题故障"
        ></textarea>
        <span style="font-size: 24rem; color: rgba(153, 1); margin-left: auto"
          >{{ Form.details.length }} / 60</span
        >
      </div>
    </div>
    <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem"></div>
    <div style="display: flex; align-items: flex-start; gap: 98rem; margin-top: 36rem">
      <div style="font-size: 32rem; height: 48rem; width: 76rem">照片</div>
      <div class="upload-container-wrapper">
        <div
          v-for="image in imagePreviewList"
          :key="image.id"
          class="image-preview-container"
        >
          <img :src="image.url" class="image-preview" @click="openPreview(image)" />
          <div v-if="uploadingImages.includes(image.id)" class="uploading-overlay">
            上传中...
          </div>
          <div class="cancel-upload" @click="cancelUpload(image.id)">×</div>
        </div>
        <div class="upload-container" @click="fileInput.click()">
          <span style="font-size: 48rem; color: #888">+</span>
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            style="display: none"
            @change="handleFileChange"
            multiple
          />
        </div>
      </div>
    </div>
    <div
      @click="createworkData()"
      style="
        width: 100%;
        height: 100rem;
        margin-top: 64rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1356eb;
        color: white;
        font-size: 36rem;
        font-weight: 400;
        cursor: pointer;
        border-radius: 10rem;
      "
    >
      提交
    </div>

    <!-- 新增: 图片预览弹窗 -->
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
  padding: 0 32rem;
  position: relative;
  overflow-y: auto;
}
.input-item {
  display: flex;
  height: 112rem;
  align-items: center;
  gap: 102rem;
  user-select: none;
}
input::placeholder {
  font-size: 32rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
textarea::placeholder {
  font-size: 32rem;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.textarea-container {
  width: 464rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.textarea-container textarea {
  height: 80%;
  resize: none;
  width: 100%;
}
.upload-container {
  width: 152rem;
  height: 152rem;
  border: 1px dashed #dcdcdc;
  border-radius: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f3f3f3;
  position: relative;
}
.image-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 0;
  cursor: pointer;
}
::v-deep .el-select__wrapper {
  box-shadow: none !important;
  padding: 0;
}
::v-deep .el-select__placeholder {
  font-size: 32rem;
  font-weight: 400;
  color: #3b3c52;
}

.upload-container-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 534rem;
  gap: 10rem;
}

.image-preview-container {
  width: 152rem;
  height: 152rem;
  position: relative;
  border-radius: 10rem;
  overflow: hidden;
}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rem;
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}
.Translateover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1004;
}
.cancel-upload {
  position: absolute;
  top: 5rem;
  right: 5rem;
  width: 30rem;
  height: 30rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20rem;
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
.scroll {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 516rem;
  background-color: #fff;
  border-radius: 24rem 24rem 0 0;
  z-index: 1002;
  box-shadow: 0px -4rem 8rem rgba(0, 0, 0, 0.25);
  animation: fadein 0.3s ease-in-out;
}
.Scroll-leave {
  animation: fadeout 0.3s ease-in-out;
}
@keyframes fadein {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes fadeout {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
input:disabled {
  background-color: transparent;
}
</style>
