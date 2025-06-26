<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { gsap } from 'gsap'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{
    color: string;
    page:string
}>()

const screentRef = ref<HTMLElement | null>(null)
    onMounted(() => {
if(!screentRef.value )return
    gsap.from(screentRef.value, { duration: 0.3, autoAlpha: 0, ease: 'power1.out' })
    setTimeout(()=>{
        router.push({ name: props.page })
    },300)

})

</script>

<template>
    <div ref="screentRef" class="screen" :style="{background:color}" >

    </div>
</template>

<style scoped>
.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    z-index: 9;
}
</style>