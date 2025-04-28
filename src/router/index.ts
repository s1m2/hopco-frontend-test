import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/configure',
      name: 'configure',
      component: () => import('../views/ListConfigurationView.vue')
    },
    {
      path: '/add-new-inventory',
      name: 'add-new-inventory',
      component: () => import('../views/AddNewInventory.vue')
    }
  ],
})

export default router
