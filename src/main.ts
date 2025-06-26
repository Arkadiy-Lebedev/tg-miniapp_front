import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { initYandexMetrika } from 'yandex-metrika-vue3'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(initYandexMetrika, {
  id: '100722011',
  router: router,
  env: 'production',
  scriptSrc: 'https://mc.yandex.ru/metrika/tag.js',
})

app.mount('#app')
