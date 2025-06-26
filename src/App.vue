<script setup lang="ts">
import { onMounted, ref } from 'vue'
import  WebApp  from '@twa-dev/sdk'
import axios from 'axios'
import { RouterLink, RouterView } from 'vue-router'
import type {IUser}  from '@/stores/user' 
import {MOCK_DATA, MOCK_INITDATA} from '@/mockData/mockData' 
import {useUserStore} from '@/stores/user' 
import {baseUrl} from '@/API/api' 

const userStore = useUserStore()


document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });



const userData = ref<{
  id?: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}>({})

onMounted(async() => {

  // Расширяем приложение на весь экран
WebApp.setHeaderColor('#ffffff'); // Обязательно установите цвет фона
WebApp.enableClosingConfirmation(); // Опционально: подтверждение перед закрытием
WebApp.expand(); // Развернуть на весь экран

console.log(WebApp.initData)

userData.value = WebApp.initDataUnsafe.user ? WebApp.initDataUnsafe.user : {} // это можно убрать


if(WebApp.initData){
  // отпарвить на сервер запрос и сохранить в сторе
  const { data } = await axios.post<IUser>(`${baseUrl}/api/auth`, {
  "initData": WebApp.initData,
});

if(data){
    userStore.user.currentEnergy = data.currentEnergy
  userStore.user.avatar = data?.avatar
  userStore.user.name = data.name
  userStore.user.ticket = data.ticket
  userStore.user.userId = data.userId
  userStore.user.winStreak = data.winStreak
  }

} else {
  console.log('нет initData')
}


// моковые данные
// const { data } = await axios.post<IUser>(`${baseUrl}/api/auth`, {
//   "initData": MOCK_INITDATA,
// });
//   console.log(data)
//   if(data){
//     userStore.user.currentEnergy = data.currentEnergy
//   userStore.user.avatar = data?.avatar
//   userStore.user.name = data.name
//   userStore.user.ticket = data.ticket
//   userStore.user.userId = data.userId
//   userStore.user.winStreak = data.winStreak
//   }

// userStore.user = MOCK_DATA

})
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>

</style>
