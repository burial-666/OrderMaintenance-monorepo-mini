<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useLoginStore from "../store/login.js";
import { uploadApi } from "../api/upload.js";
import { ElMessage } from "element-plus";
import { getquestionsListApi, createWorkApi } from "../api/work.js";
const fileInput = ref(null);
const imagePreviewList = ref([]);
const router = useRouter();
const uploadingImages = ref([]); // 新增：用于跟踪正在上传的图片

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
//获取问题列表
const questionsList = ref([]);
const getQuestionsList = async () => {
  const res = await getquestionsListApi(1, 100);
  questionsList.value = res.data.data;
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
  problem_id: "",
  photos: [],
  user_id: useLoginStore().id,
});
const createworkData = async () => {
  if (
    !Form.value.name ||
    !Form.value.studentNumber ||
    !Form.value.phone_number ||
    !Form.value.location ||
    !Form.value.details ||
    !Form.value.problem_id
  ) {
    ElMessage.error("请填写完整信息");
    return;
  }
  const res = await createWorkApi(Form.value);
  ElMessage.success("工单创建成功");
  setTimeout(() => {
    router.push("/home/Statistics");
  }, 400);
};
onMounted(() => {
  getQuestionsList();
});
</script>
<template>
  <div class="create">
    <div
      style="text-align: left; font-size: 1.6rem; font-weight: 700; margin-bottom: 1.2rem"
    >
      创建工单
    </div>
    <div class="form-container">
      <div class="from-line" style="margin-bottom: 3.6rem">
        <div class="from-line-item">
          <div style="margin-left: 2.8rem">姓名</div>
          <input type="text" placeholder="请输入" v-model="Form.name" />
        </div>
        <div class="from-line-item">
          <div>学号</div>
          <input type="text" placeholder="请输入" v-model="Form.studentNumber" />
        </div>
      </div>
      <div class="from-line" style="margin-bottom: 3.6rem">
        <div class="from-line-item">
          <div>电话号码</div>
          <input type="text" placeholder="请输入" v-model="Form.phone_number" />
        </div>
        <div class="from-line-item">
          <div>地点</div>
          <input type="text" placeholder="请输入" v-model="Form.location" />
        </div>
      </div>
      <div style="margin-bottom: 3.6rem; display: flex; gap: 1.2rem">
        <div class="from-line-item">
          <div>问题描述</div>
          <el-select
            v-model="Form.problem_id"
            placeholder="请选择"
            style="width: 56.2rem; height: 3.2rem; min-height: none"
          >
            <el-option
              v-for="item in questionsList"
              :label="item.content"
              :value="item.ID"
            />
          </el-select>
        </div>
      </div>
      <div style="margin-bottom: 3.6rem; display: flex; gap: 1.2rem">
        <div class="from-line-item" style="position: relative; align-items: flex-start">
          <div>问题详细</div>
          <textarea
            v-model="Form.details"
            style="
              border: 1px solid #dcdfe6;
              outline: none;
              font-size: 1.4rem;
              font-weight: 400;
              color: black;
              resize: none;
              width: 56.2rem;
              height: 12.8rem;
              border-radius: 0.4rem;
              padding: 1.2rem;
            "
            maxlength="60"
            placeholder="请详细描述问题发生的地点与问题故障"
          ></textarea>
          <span style="position: absolute; right: 1.2rem; bottom: 1.2rem"
            >{{ Form.details.length }}/60</span
          >
        </div>
      </div>
      <div style="margin-bottom: 3.6rem; display: flex; gap: 1.2rem">
        <div class="from-line-item" style="align-items: flex-start">
          <div>上传照片</div>
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
              <span style="font-size: 2.4rem; color: #888">+</span>
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
      </div>
      <div style="display: flex; margin-left: 6.6rem; gap: 1.2rem">
        <div
          class="button"
          style="flex: 0 0 auto"
          @click="
            () => {
              createworkData();
            }
          "
        >
          确认提交
        </div>
        <div
          style="
            flex: 0 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #e7e7e7;
            border-radius: 0.4rem;
            cursor: pointer;
            user-select: none;
            font-size: 1.4rem;
            width: 8rem;
            height: 4rem;
          "
          class="button-gray"
        >
          取消
        </div>
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
.create {
  width: 100%;
  margin: 2.4rem;
}
.form-container {
  width: 100%;
  background-color: #fff;
  padding: 2.4rem 12.8rem;
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
}
.from-line {
  display: flex;
  gap: 5.6rem;
}
.from-line-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.from-line-item > div {
  font-size: 1.4rem;
  font-weight: 500;
  flex: 0 0 auto;
}
input {
  height: 3.2rem;
  outline: none;
  border: 1px solid #dcdfe6;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  width: 23.4rem;
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
textarea::placeholder {
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
.upload-container-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 53.4rem;
  gap: 1rem;
}
.image-preview-container {
  width: 15.2rem;
  height: 15.2rem;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
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
.upload-container {
  width: 15.2rem;
  height: 15.2rem;
  border: 1px dashed #dcdcdc;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f3f3f3;
  position: relative;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  width: 11.2rem;
  color: #ffffff;
  background: #0052d9;
  border-radius: 0.4rem;
  cursor: pointer;
  user-select: none;
  font-size: 1.4rem;
}
.button:hover {
  opacity: 0.8;
}
.button-gray:hover {
  opacity: 0.8;
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
.cancel-upload {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
}
</style>
