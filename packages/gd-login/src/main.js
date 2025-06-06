import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router'
import { createPinia } from 'pinia'
import './utlis/rem.js'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')