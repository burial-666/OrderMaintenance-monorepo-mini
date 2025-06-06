import { createRouter, createWebHistory } from 'vue-router'
import Tickets from '../views/Tickets/Tickets.vue'
const routes = [
    {
        path: '/',
        redirect: '/Tickets/myTickets'
    },
    {
        path: '/detail',
        name: 'detail',
        component: () => import('../components/detail.vue')
    },
    {
        path: '/search',
        name:'search',
        component: () => import('../components/search.vue')
    },
    {
        path: '/create',
        name: 'create',
        component: () => import('../components/create.vue')
    },
    {
        path: '/Tickets',
        name: 'Tickets',
        component: Tickets,
        children: [
            {
                path: 'my',
                name:'my',
                component: () => import('../components/my.vue')
            },
            {
                path: 'myTickets',
                name:'myTickets',
                component: () => import('../components/myTickets.vue')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router