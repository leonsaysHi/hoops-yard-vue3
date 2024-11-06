import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/su-reserva/:id',
      name: 'record-view',
      component: () => import('@/views/RecordView.vue')
    }
  ]
})

export default router
