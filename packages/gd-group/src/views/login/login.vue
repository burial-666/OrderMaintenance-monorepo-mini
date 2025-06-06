<script setup>
import { ref } from 'vue'
import { login } from  '../../api/user.js'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const router = useRouter()
const Login = async () => {
    const res = await login(username.value, password.value)
    if (res.data.message === '登录成功') {
        router.push('/Tickets/create')
    }
}
console.log('Login')
const loginTest = () => {
    router.push('/Tickets/create')
}
</script>
<template>
    <div class="frame">
        <div class="title">
            <span style="font-size: 64rem; font-weight: 700; text-align: left;">欢迎登录</span>
            <span style="font-size: 48rem; font-weight: 400; text-align: left;">深圳技术大学工单维保系统</span>
        </div>
        <div class="main-content">
            <div class="username">
                <div style="font-size: 32rem;">用户名</div>
                <input type="text" v-model="username"  placeholder="请输入手机号" style="border: none; outline: none; height: 56rem; padding-bottom: 8rem;height: 56rem; padding-top: 8rem; font-size: 32rem; font-weight: 400; color: black;">
            </div>
            <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem;"></div>
            <div class="password">
                <div style="font-size: 32rem; margin-right:72rem;">验证码</div>
                <input type="text"  v-model="password" placeholder="请输入验证码" style="border: none; outline: none; height: 56rem; padding-bottom: 8rem;height: 56rem; padding-top: 8rem; font-size: 32rem; font-weight: 400; color: black; width: 322rem;">
                <div style="height: 50%; width: 1px ; background-color: #ccc; margin-top: 25%; margin-bottom: 25%;margin-left: 32rem;"></div>
                <div style="font-size: 32rem; margin-left: 22rem; cursor: pointer; color:#0052D9" @click="sendCode">发送验证码</div>
            </div>
            <div style="border-bottom: 1px solid #ccc; margin-bottom: 6rem;"></div>
            <div style="font-size: 28rem; font-weight: 400; color: rgba(182, 182, 182, 1); margin-top: 32rem; text-align: left;">未注册的手机号验证通过后将自动注册</div>
        </div>
        <div style="color: #0052D9; font-size: 28rem; cursor: pointer; text-align: center;margin-top: 32rem;">使用统一身份认证登录</div>
        <div class="button" @click="loginTest">登录</div>
    </div>
</template>


<style scoped>
@import './index.css';
</style>
