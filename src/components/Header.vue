
<script setup lang="ts">
import PizzaBal from '../assets/images/pizza-bal.svg'

defineProps<{
    name: string;
    count: number;
}>()


    </script>
    
<template>
<div class="header">
  <div class="header__ball">
    <p class="header__bal-text">{{ count }}</p>
    <img :src="PizzaBal" alt="" class="header__logo-bal">
  </div>
  <div class="header__name">
    <p class="name"> {{ name }}</p>
   
  </div>
</div>
  </template>


  
  <style scoped>
.header{
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(255, 255, 255);
  width: 100%;
  padding: calc(var(--app-width) * 2.2 / 100) calc(var(--app-width) * 6.7 / 100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.header__ball{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--app-width) * 3 / 100);
}

.header__logo-bal{
width:  calc(var(--app-width) * 10 / 100);
}

.name{
  font-size: calc(var(--app-width) * 5 / 100);
}

.header__bal-text{
  font-size: calc(var(--app-width) * 6 / 100);
}
  </style>