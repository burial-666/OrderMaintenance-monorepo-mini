<script setup>
import { ref, defineEmits, watch } from "vue";
import { uploadApi } from "../api/upload.js";
const fileInput = ref(null);
const imagePreviewList = ref([]);
const uploadingImages = ref([]);
const photos = ref([]);
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

const cancelUpload = (imageId) => {
  const canceledImage = imagePreviewList.value.find((img) => img.id === imageId);
  if (canceledImage) {
    imagePreviewList.value = imagePreviewList.value.filter((img) => img.id !== imageId);
    uploadingImages.value = uploadingImages.value.filter((id) => id !== imageId);
    photos.value = photos.value.filter((photo) => photo.url !== canceledImage.url);
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
    photos.value.push(photoObject);
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
const emit = defineEmits(["sendPhotos"]);
watch(
  () => photos.value,
  (val) => {
    emit("sendPhotos", val);
  },
  { deep: true }
);
</script>
<template>
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
  <div v-if="showPreview" class="preview-overlay" @click="closePreview">
    <div class="preview-container">
      <img :src="previewImage" class="preview-image" />
    </div>
  </div>
</template>

<style scoped>
.upload-container-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 534rem;
  gap: 10rem;
  margin-bottom: 48rem;
}
.image-preview-container {
  width: 152rem;
  height: 152rem;
  position: relative;
  border-radius: 10rem;
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
