import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/login.vue'
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router