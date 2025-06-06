<script setup></script>
<template>
  <div class="overlay" v-if="isoverlay" @click="isoverlay = false"></div>
  <div class="popup" v-if="isoverlay">
    <div style="width: 100%">
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
  </div>
</template>

<style scoped></style>
