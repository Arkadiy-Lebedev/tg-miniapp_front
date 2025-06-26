<script setup lang="ts">
defineProps<{
    text: string;
    outline?: boolean;
    disabled?: boolean;
}>()
</script>

<template>
    <div class="btn" :class="{ outline: outline, disabled:disabled }">
        <p class="btn-text">{{ text }}</p>{{  }}
    </div>
</template>

<style scoped>
.btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
width: 100%;
    background-image: url('@/UI/Button/bg.svg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: calc(var(--app-width)* 12.7 / 100);

    cursor: pointer;
    transition: all 0.3s ease;

}

.disabled{
   filter: contrast(0.4);
   pointer-events: none;
}

.btn.outline{
    border: 2px solid #0056D1;
    background-color: transparent;
}

.btn-text {
    display: block;
    color: white;
    font-weight: 800;
    font-size: calc(var(--app-width)* 4.25 / 100);
    text-transform: uppercase;
    color: #181717;        
    padding-top: calc(var(--app-width)* 1.35 / 100);
}

.outline .btn-text{
    color: #0056D1;
    transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .btn:not(.disabled):hover{
filter: brightness(0.9);
  }

  .outline.btn:hover{
    border: 2px solid #092348;
    background-color: transparent;
    
  }

  .outline.btn:hover .btn-text{
    color: #092348;
  
  }

}
</style>