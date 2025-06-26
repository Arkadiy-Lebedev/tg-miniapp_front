
<script setup lang="ts">
import { gsap } from 'gsap'
import { ref,onMounted } from 'vue';
const firstRef = ref<HTMLElement | null>(null)
const twoRef = ref<HTMLElement | null>(null)

onMounted(()=>{
  if(!firstRef.value) return

  const tl = gsap.timeline({ delay: 1.8 });
  tl.to(firstRef.value, { 
  duration: 0.2, 
  fill: '#971B12', 
  ease: 'power1.out'
}, "+=3.5")
.set(firstRef.value, { 
  fill: '#EF3124' 
}, "+=0.5")
.to(twoRef.value, { 
  duration: 0.2, 
  fill: '#971B12', 
  ease: 'power1.out' 
}, "+=0.5"); // задержка 0.5 сек после смены firstRef

})
    </script>
<template>
<svg class="arrows" width="167" height="106" viewBox="0 0 167 106" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.2143 101.268V57.7322L43.5358 62.4643V106L49.2143 101.268Z" fill="#AE261D"/>
<rect y="62.4642" width="43.5357" height="43.5357" fill="#EF3124"/>
<path d="M11.3572 85.6518L31.942 97.5365L31.942 73.7671L11.3572 85.6518Z" fill="white"/>
<path d="M5.67857 57.7322L0 62.4643H43.5357L49.2143 57.7322H5.67857Z" fill="#D22B1F"/>
<path d="M107.893 101.268V57.7322L102.214 62.4643V106L107.893 101.268Z" fill="#AE261D"/>
<rect x="58.6786" y="62.4642" width="43.5357" height="43.5357" fill="#EF3124"/>
<path d="M80.9197 94.6428L92.8044 74.058H69.0351L80.9197 94.6428Z" fill="white"/>
<path d="M64.3572 57.7322L58.6786 62.4643H102.214L107.893 57.7322H64.3572Z" fill="#D22B1F"/>
<path d="M107.893 43.5357V0L102.214 4.73214V48.2679L107.893 43.5357Z" fill="#AE261D"/>
<rect ref="twoRef" x="58.6786" y="4.73218" width="43.5357" height="43.5357" fill="#EF3124"/>
<path d="M80.9197 16.0892L69.0351 36.6741L92.8044 36.6741L80.9197 16.0892Z" fill="white"/>
<path d="M64.3572 0L58.6786 4.73214H102.214L107.893 0H64.3572Z" fill="#D22B1F"/>
<path d="M166.572 101.268V57.7322L160.893 62.4643V106L166.572 101.268Z" fill="#AE261D"/>
<rect ref="firstRef" x="117.357" y="62.4642" width="43.5357" height="43.5357" fill="#EF3124"/>
<path d="M151.429 85.6518L130.844 73.7671L130.844 97.5364L151.429 85.6518Z" fill="white"/>
<path d="M123.036 57.7322L117.357 62.4643H160.893L166.571 57.7322H123.036Z" fill="#D22B1F"/>
</svg>


</template>
<style scoped>
.arrows{
    height: calc(var(--app-width) * 28.5 / 100);
    width: calc(var(--app-width) * 44.5 / 100);
}
</style>