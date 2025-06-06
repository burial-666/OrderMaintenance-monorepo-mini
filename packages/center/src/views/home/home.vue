<script setup>
import Header from "../../components/header.vue";
import Aside from "../../components/aside.vue";
</script>
<template>
  <div class="frame">
    <Header></Header>
    <div style="display: flex">
      <Aside></Aside>
      <router-view style="width: calc(100% - 28rem)"></router-view>
    </div>
  </div>
</template>

<style scoped>
@import "./index.css";
</style>
