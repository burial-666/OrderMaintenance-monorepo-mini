// vite.config.js
import { defineConfig } from "file:///C:/Users/Administrator/Desktop/gd-momo/packages/gd-group/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Administrator/Desktop/gd-momo/packages/gd-group/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var newUrl = "http://47.96.253.87:12106/";
var vite_config_default = defineConfig({
  base: "/group",
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: newUrl,
        //目标url
        changeOrigin: true,
        //支持跨域
        rewrite: (path) => path.replace(/^\/api/, "")
        //重写路径,替换/api
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pbmlzdHJhdG9yXFxcXERlc2t0b3BcXFxcZ2QtbW9tb1xcXFxwYWNrYWdlc1xcXFxnZC1ncm91cFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5pc3RyYXRvclxcXFxEZXNrdG9wXFxcXGdkLW1vbW9cXFxccGFja2FnZXNcXFxcZ2QtZ3JvdXBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluaXN0cmF0b3IvRGVza3RvcC9nZC1tb21vL3BhY2thZ2VzL2dkLWdyb3VwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuY29uc3QgbmV3VXJsID0gJ2h0dHA6Ly80Ny45Ni4yNTMuODc6ODA4MS8nXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTonL2dyb3VwJyxcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6IG5ld1VybCwgLy9cdTc2RUVcdTY4MDd1cmxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLCAvL1x1NjUyRlx1NjMwMVx1OERFOFx1NTdERlxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgICAgIC8vXHU5MUNEXHU1MTk5XHU4REVGXHU1Rjg0LFx1NjZGRlx1NjM2Mi9hcGlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VyxTQUFTLG9CQUFvQjtBQUNyWSxPQUFPLFNBQVM7QUFDaEIsSUFBTSxTQUFTO0FBRWYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBSztBQUFBLEVBQ0wsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQTtBQUFBLE1BRTlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
