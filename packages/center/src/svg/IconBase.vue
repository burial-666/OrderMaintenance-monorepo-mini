<template>
  <el-icon :style="{ fontSize: fontSize }">
    <slot></slot>
  </el-icon>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: "box",
    },
    width: {
      type: [Number, String],
      default: 26,
    },
    height: {
      type: [Number, String],
      default: 26,
    },
    iconColor: {
      type: String,
      default: "currentColor",
    },
    fontSize: {
      type: [Number, String],
      default: "inherit",
    },
  },
  computed: {
    rootFont() {
      return parseInt(window.getComputedStyle(document.documentElement).fontSize);
    },
    viewHeight() {
      return this.viewCompute(this.height);
    },
    viewWidth() {
      return this.viewCompute(this.width);
    },
    viewFontSize() {
      return this.viewCompute(this.fontSize);
    },
  },
  methods: {
    viewCompute(val) {
      if (typeof val === "number") {
        return val;
      } else {
        if (val.includes("rem")) {
          return parseFloat(val) * this.rootFont;
        } else return parseInt(val);
      }
    },
  },
};
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px;
}
:deep(path) {
  fill: currentColor;
}
</style>
