import MainPage from '@/components/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
  ],
})

export default router
