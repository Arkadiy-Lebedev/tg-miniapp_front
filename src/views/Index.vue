
<script setup lang="ts">
import Header from '@/components/Header.vue';
import ButtonAlfa from '@/UI/Button/ButtonAlfa.vue';
import { toast } from 'vue3-toastify';

import { gsap } from 'gsap'
import { ref,onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useYandexMetrika } from 'yandex-metrika-vue3'
import {useUserStore} from '@/stores/user' 

import 'vue3-toastify/dist/index.css';

const userStore = useUserStore()
const yandexMetrika = useYandexMetrika()


const router = useRouter()

const contentRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)
  const menRef = ref<HTMLElement | null>(null)
    const isModal = ref(false)
    const isModalBoosts = ref(false)

watch(() => userStore.user.winStreak, (val)=>{
  if(userStore.user.winStreak && userStore.user.winStreak > 0){
    isModal.value = true
  }
},  { immediate: true })

onMounted(async() => {
  // yandexMetrika.setUserID('0300403333')
if(!contentRef.value )return
    gsap.from(contentRef.value, { duration: 0.5, autoAlpha: 0, delay:0.2, ease: 'power1.out' })
    gsap.from(btnRef.value, { duration: 0.5, autoAlpha: 0, delay:0.5, ease: 'power1.out' })
  gsap.from(menRef.value, { duration: 0.5, y:-50, autoAlpha: 0, delay:0.8, ease: 'power1.out' })

})

const goGame = () => {  
  if(userStore.user.ticket <=0 )return
  router.push({ name: 'game' })
}

const takeTicket = () => {
  isModal.value=false
  userStore.user.winStreak = 0
}

const notify = () => {
      toast("Скоро будет доступно...", {
        autoClose: 2000,
        transition: toast.TRANSITIONS.SLIDE,
    position: toast.POSITION.TOP_RIGHT,
    type: toast.TYPE.WARNING,
    expandCustomProps: true,
      });
    }

    const notify2 = () => {
      toast("В разработке...", {
        autoClose: 2000,
        transition: toast.TRANSITIONS.SLIDE,
    position: toast.POSITION.TOP_RIGHT,
    type: toast.TYPE.WARNING,
    expandCustomProps: true,
      });
    }

</script>

<template> 
  <div class="wrapper">
    
    <div v-if="isModal" class="wrapper-modal">
      <div class="modal-content">
        <div class="modal-block">
           <p class="text-winner text"> Поздравляем!</p>       
           <p class=" text"> Вам начислено</p>   
           <div class="ticket_block">
                      <p class="text-ticket text"> {{ userStore.user.winStreak }}</p>    
          <img src="@/assets/images/ticket.svg" alt="" class="modal-ticket">
           </div>         
        </div>
<div ref="btnRef" class="btn-wrapper">
  <ButtonAlfa @click="takeTicket" text="ЗАБРАТЬ"/>
</div>
      </div>
    </div>

    <div v-if="isModalBoosts" class="wrapper-modal-boosts">
      <div class="modal-content">
        <div class="modal-block">
           <p class="text-winner text"> Улучшения</p>      
          
           <div @click="notify" class="boosts_block">
            <p class="x2-text"> X2 <span class="comment"> (5 игр) </span> - 200</p>    
          <img src="@/assets/images/pizza-bal.svg" alt="" class="modal-ball">
           </div>         
           <div @click="notify2" class="boosts_block">
            <p class="x2-text"> +30 сек <span class="comment"> (24 ч.) </span> - 500</p>    
          <img src="@/assets/images/pizza-bal.svg" alt="" class="modal-ball">
           </div>             
        </div>
<div ref="btnRef" class="btn-wrapper">
  <ButtonAlfa @click="isModalBoosts=false" text="НАЗАД"/>
</div>
      </div>
    </div>

    <Header :name="userStore.user.name" :count="userStore.user.currentEnergy"/>
    <div class="tickets">
  <img src="@/assets/images/ticket.svg" alt="" class="ticket-img">  
  {{ userStore.user.ticket }}</div>
    <div class="content">

<div ref="contentRef" class="main">
  <p class="title">
    Собирай пиццу<br/>учавствуй в розыгрыше! 
  </p>
  <p class="text">
    Каждый день начисляются билеты для прохода в игру.  <br/> Пиццу можешь использовать для приобретения улучшений или промокодов.
  </p>
  <p class="text">
    Кто больше соберет пиццы тот и победит.
  </p>
</div>
<div ref="btnRef" class="btn__group">
  <div class="btn-group">
     <div  class="btn-wrapper">
  <ButtonAlfa @click="goGame" :disabled="userStore.user.ticket <= 0" text="Играть"/>
</div>
<div  class="btn-wrapper">
  <ButtonAlfa @click=" router.push({ name: 'flipping' })"  text="дуэль"/>
</div>
  </div>
 
<div  class="btn-wrapper">
  <ButtonAlfa @click="router.push({ name: 'liders' })" text="Лидеры"/>
</div>
<div class="btn-block__promo">
  <div class="btn-wrapper">
  <ButtonAlfa @click="isModalBoosts=true" text="boost"/>
</div>
<div class="btn-wrapper">
  <ButtonAlfa :disabled="true" text="promo"/>
</div>
</div>

</div>  


    </div>
   
      </div>
    </template>
  
   
    <style scoped>
.btn-block__promo{
  display: flex;
  gap:  calc(var(--app-width)* 4 / 100);;
}

.btn-group{
    display: flex;
  gap:  calc(var(--app-width)* 4 / 100);
}

.ticket_block{
  margin-top:calc(var(--app-width)* 7 / 100);
  display: flex;
gap: calc(var(--app-width)* 4 / 100);
justify-content: center;
}
.boosts_block{
  width: 100%;
  height: calc(var(--app-width)* 20 / 100);
  margin-top:calc(var(--app-width)* 5 / 100);
  display: flex;
  align-items: center;
  gap:calc(var(--app-width)* 1 / 100);
  justify-content: center;
  border-radius: 15px;
background: #f0f8ff;
box-shadow:  13px 13px 26px #ccd3d9,
-13px -13px 26px #ccd3d9;
padding: calc(var(--app-width)* 2 / 100) calc(var(--app-width)* 3 / 100);

}

.boosts_block:nth-child(2){
  margin-top:calc(var(--app-width)* 10 / 100);
}

    .modal-ticket{
      width: calc(var(--app-width)* 15 / 100);

    }

        .modal-ball{
      width: calc(var(--app-width)* 9 / 100);

    }

    .x2-text{
      font-size: calc(var(--app-width)* 5 / 100);
    }

    .comment{
      font-size: calc(var(--app-width)* 3 / 100);
      color: #535252;
    }

    .text-winner{
      font-size: calc(var(--app-width)* 7 / 100);
      text-align: center;

    }
    .text-ticket{
      font-size: calc(var(--app-width)* 10 / 100);
      text-align: center;
    }
.wrapper-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
   background: rgba(0, 0, 0, 0.5);/* Полупрозрачный фон */
  backdrop-filter: blur(10px); /* Размытие фона */
  -webkit-backdrop-filter: blur(10px); /* Для Safari */
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;

}

.wrapper-modal-boosts {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
   background: rgba(0, 0, 0, 0.5);/* Полупрозрачный фон */
  backdrop-filter: blur(10px); /* Размытие фона */
  -webkit-backdrop-filter: blur(10px); /* Для Safari */
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;

}


.modal-content{
  display: flex;
  flex-direction: column;

    width: 87%;

}

.modal-block{
background-color: aliceblue;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: calc(var(--app-width)* 10.55 / 100) calc(var(--app-width)* 3.58 / 100) calc(var(--app-width)* 14.18 / 100) calc(var(--app-width)* 5.38 / 100);
    text-align: center;
}

.tickets{
  width: 87%;
    margin: 0 auto;
  display: flex;       
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--app-width)* 2.96 / 100);
  color: aliceblue;
  font-size: calc(var(--app-width)* 5 / 100);;
}

.ticket-img{
  width: calc(var(--app-width)* 10 / 100);
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

  .men{
    width: calc(var(--app-width)* 37.3 / 100);

  }

  .title{
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
    padding: calc(var(--app-width)* 11.28 / 100) calc(var(--app-width)* 0.58 / 100) calc(var(--app-width)* 7.28 / 100) calc(var(--app-width)* 4.38 / 100)
  }

  .main > p{
    color: rgb(255, 255, 255);
  }

  .btn-wrapper{
    margin-top: calc(var(--app-width)* 6 / 100) ;
    width: 100%;
  }

  .img-block{
    position: relative;
    margin-bottom: calc(var(--app-width)* -14.4 / 100) ;
    margin-left: auto;
    margin-right:  calc(var(--app-width)* 6.4 / 100) ;
    z-index: 8;
  }
  
    </style>