import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Game from '../views/Game.vue'
import Liders from '../views/Liders.vue'
import Flipping from '../views/Flipping.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/liders',
      name: 'liders',
      component: Liders
    },
       {
      path: '/flipping',
      name: 'flipping',
      component: Flipping
    },

  ]
})

export default router
