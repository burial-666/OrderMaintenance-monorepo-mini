import { createRouter, createWebHistory } from 'vue-router'
import Tickets from '../views/Tickets/Tickets.vue'
import intelligent from '../views/intelligent.vue'
const routes = [
    {
        path: '/',
        redirect: '/Tickets/intelligent'
    },
    {
        path: '/search',
        name:'search',
        component: () => import('../components/search.vue')
    },
    {
        path: '/createSoftware',
        name:'createSoftware',
        component: () => import('../components/createSoftware.vue')
    },
    {
        path: '/software',
        name:'software',
        component: () => import('../components/softwareList.vue')
    },
    {
        path: '/softwareDetail',
        name:'softwareDetail',
        component: () => import('../components/softwareDetail.vue')
    },
    {
        path: '/detail',
        name: 'detail',
        component: () => import('../components/detail.vue')
    },
    {
        path: '/create',
        name: 'create',
        component: () => import('../components/create.vue')
    },
    {
        path: '/AI',
        name: 'AI',
        component: () => import('../components/AI.vue')
    },
    {
        path: '/Tickets',
        name: 'Tickets',
        redirect: '/Tickets/myTickets',
        component: Tickets,
        children: [
            {
                path: 'intelligent',
                name: 'intelligent',
                component: intelligent
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