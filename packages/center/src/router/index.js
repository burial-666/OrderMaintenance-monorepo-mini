import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/home.vue'
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        redirect: '/home/Statistics',
        children: [
            {
                path: 'Statistics',
                name:'Statistics',
                component: () => import('../components/Statistics.vue')
            },
            {
                path: 'download',
                name:'download',
                component: () => import('../components/download.vue')
            },
            {
                path: 'detail',
                name:'detail',
                component: () => import('../components/detail.vue')
            },
            {
                path: 'assignDetail',
                name:'assignDetail',
                component: () => import('../components/assignment.vue')
            },
            {
                path: 'createTicket',
                name:'createTicket',
                component: () => import('../components/createTicket.vue')
            },
            {
                path: 'freeday',
                name:'freeday',
                component: () => import('../components/freeday.vue')
            },
            {
                path: 'assignment',
                name:'assignment',
                component: () => import('../components/workAssignment.vue')
            },
            {
                path: 'question',
                name:'question',
                component: () => import('../components/question.vue')
            },
            {
                path: 'people',
                name:'people',
                component: () => import('../components/people.vue')
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router