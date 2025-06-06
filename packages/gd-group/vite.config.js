import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const newUrl = 'http://47.96.253.87:12106/'
// https://vitejs.dev/config/
export default defineConfig({
  base:'/group',
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: newUrl, //目标url
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
        //重写路径,替换/api
      }
    }
  }
})