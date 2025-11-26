import { createRouter, createWebHistory } from 'vue-router'
import TournamentList from '../components/TournamentList.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: TournamentList
    },
    {
        path: '/admin',
        name: 'AdminLogin',
        component: AdminLogin
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        beforeEnter: (to, from, next) => {
            if (localStorage.getItem('adminAuthenticated') === 'true') {
                next()
            } else {
                next('/admin')
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
