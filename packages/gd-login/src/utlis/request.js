import axios from 'axios'
import router from '../router'
import useLoginStore from '../store/login'
import { ElMessage } from 'element-plus'
const service = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 5000
})

service.interceptors.request.use(
    (config) => {
        config.headers.Authorization = useLoginStore().token
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response) => {
        if(response.status !== 200){
            ElMessage.error(response.statusText)
        }
        else if (response.data.code === 0) {
            ElMessage.error(response.data.message)
        }
        return response
    },
    (error) => {
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        }
        else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        }
        else if (message.includes("401")) {
            ElMessage.error('登陆状态失效')
            window.location.href = window.location.href.replace(/(^[^\\/]*\/\/[^\\/]*\/).*$/, '$1login/login')
        }
        else if (message.includes("400")){
            ElMessage.error('验证码错误或已过期');
        }
        else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        return Promise.reject(error).catch(error)
    }
)

export default service