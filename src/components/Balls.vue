
<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { gsap } from 'gsap'

defineProps<{
    bal: number; 
    x: number;
    y: number;
}>()

const balRef = ref<HTMLElement | null>(null)

onMounted(async() => {
  // yandexMetrika.setUserID('0300403333')
if(!balRef.value )return
  gsap.from(balRef.value, { duration: 0.5, y:10, autoAlpha: 0, ease: 'power1.out' })

})
    </script>
    
<template>
<span ref="balRef" class="ball"
:style="{
        left: `${x}px`,
        top: `${y}px`,
        color: bal>0 ? '#ffffff' : 'red'
      }"
>{{ bal }}</span>

  </template>


  
  <style scoped>

  .ball{
 font-size: calc(var(--app-width)* 4 / 100);
    color: #ffffff;
    opacity: 0.5;
  }


  </style>