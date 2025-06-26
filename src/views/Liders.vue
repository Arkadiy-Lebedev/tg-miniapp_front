
<script setup lang="ts">
import Header from '@/components/Header.vue';
import axios from 'axios'
import {baseUrl} from '@/API/api' 
import PizzaBal from '../assets/images/pizza-bal.svg'
import ButtonAlfa from '@/UI/Button/ButtonAlfa.vue';
import { gsap } from 'gsap'
import { ref,onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {useUserStore} from '@/stores/user' 


interface ILidersData {
  name: string,
  avatar: string,
  currentEnergy: string
}

const userStore = useUserStore()
const router = useRouter()

const liders=ref<ILidersData[]>([])

onMounted(async()=>{
  const { data } = await axios.get<ILidersData[]>(`${baseUrl}/api/liders`);
  console.log(data)
  liders.value=sortLidersByEnergyDescending(data)
})

const  sortLidersByEnergyDescending = (arr:ILidersData[]): ILidersData[] => {
  const sortedArray = [...arr];
  sortedArray.sort((a, b) => {
    // Преобразуем currentEnergy в числа для сравнения
    const energyA = parseFloat(a.currentEnergy);
    const energyB = parseFloat(b.currentEnergy);
    
    // Сортируем по убыванию
    return energyB - energyA;
  });
  return sortedArray;
}

const goGame = () => {  
  // if(userStore.user.ticket <=0 )return
  router.push({ name: 'game' })
}

</script>

<template> 
  <div class="wrapper">

    <Header :name="userStore.user.name" :count="userStore.user.currentEnergy"/>
    
    <div class="content">

<div ref="contentRef" class="main">
  <div class="back-group">
    <img @click=" router.push({ name: 'index' })" src="@/assets/images/back.svg" alt="" class="back">
  <p class="title">
   Лидеры 
  </p>
  </div>
  
  <table class="table">

	<tbody>
		<tr  v-for="(lider, index) in liders" 
      :key="index"
        >
			<td>{{ index + 1 }}</td>
			<td >
        <div class="name-block">
        <img  :src="lider.avatar" alt="" class="avatar">
        {{ lider.name }}  
      </div>
      </td>
			<td>
        <div class="name-block">
               {{ lider.currentEnergy }}
        <img :src="PizzaBal" alt="" class="ball">
        </div>
   
      </td>		
		</tr>
	
	</tbody>
</table>
</div>
    </div>   
      </div>
    </template>
  
   
    <style scoped>

    .back-group{
      display: flex;
      align-items: center;
      gap: calc(var(--app-width)*5.5 / 100);;
    }

.back{
  width: calc(var(--app-width)* 8.5 / 100);
  height: calc(var(--app-width)*8.5 / 100);
  margin-right: calc(var(--app-width)* 1.5 / 100);
}

.avatar{
  width: calc(var(--app-width)* 8.5 / 100);
  height: calc(var(--app-width)*8.5 / 100);
  border-radius: 50%;
  margin-right: calc(var(--app-width)* 1.5 / 100);
}

.ball{
  width: calc(var(--app-width)* 5.5 / 100);
  height: calc(var(--app-width)*5.5 / 100);
  border-radius: 50%;
  margin-left:calc(var(--app-width)* 1.5 / 100); ;
}

.name-block{
  display: flex;
  align-items: center;

}

.modal-content{
    width: 87%;

}

  .wrapper{
  width: 100%;
    height:100%;
  padding-top: calc(var(--app-width)* 19 / 100);;
  }

  .content{

    width: 87%;
    margin: 0 auto;
    height:100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }



  .title{
    color: seashell;
    font-weight: 600;
    font-size: calc(var(--app-width)* 5.35 / 100);
    line-height: calc(var(--app-height)* 3.2 / 100);
  }

  .text{
    margin-top: calc(var(--app-width)* 4.58 / 100);
  }

  .main{
    /* background-image: url("@/assets/images/modal-bg.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%; */
    border-radius: 0px;
background: #04482f;
box-shadow:  13px 13px 26px #03301f,
             -13px -13px 26px #05603f;
    padding: calc(var(--app-width)* 11.28 / 100) calc(var(--app-width)* 0.58 / 100) calc(var(--app-width)* 7.28 / 100) calc(var(--app-width)* 4.38 / 100);
    height: 90%;
    overflow: auto;
  }

  .main > p{
    color: rgb(255, 255, 255);
  }

  .table {
	width: 100%;
	border: none;
  margin-top: calc(var(--app-width)* 7 / 100) ;
  margin-top: calc(var(--app-width)* 7 / 100) ;
}
.table thead th {
	padding: calc(var(--app-width)* 7 / 100) ;
	font-weight: 500;
	text-align: left;
	color: #ffffff;

}
.table tbody td {
	padding: calc(var(--app-width)* 1.1 / 100) ;

	color: #ffffff;
	border-bottom: 1px solid #716561;
}
    </style>