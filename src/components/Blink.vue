<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const blinkRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!blinkRef.value) {
    return
  }
  gsap.to(blinkRef.value, { duration: 0.3, autoAlpha: 0, ease: 'power1.in' })

})
</script>

<template>
  <div ref="blinkRef" class="blink">
   
  </div>
</template>
<style scoped>

.blink{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(255,255,255);
  background: radial-gradient(circle, rgba(252,70,107,0) 0%, rgba(254,254,254,1) 78%);
z-index: 8;
pointer-events: none;
}

</style>