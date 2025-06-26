<script setup lang="ts">
const modelValue = defineModel()

defineProps<{

  validate: boolean
}>()
</script>

<template>
  <input
    class="input-email"
    :class="{ error: !validate }"
    type="email"
    v-model="modelValue"
 
  />
</template>

<style scoped>
.input-email {
  padding: calc(var(--app-width) * 3.2 / 100);
  padding-top: calc(var(--app-width)* 2.7 / 100);
padding-bottom: calc(var(--app-width)* 2.7 / 100);
  font-weight: normal;
  color: var(--color-text);
  font-size: clamp(14px, 2.1dvh, 16px);

  width: 100%;
background-color: #F2EFEF;
}

/* .input-email::placeholder {
  font-weight: normal;
  color: #E5E5E5;
  font-size: clamp(14px, 2.6dvh, 19px);
  font-weight: 300;
} */

.error {
  background-color: #ff9a9a;
}
</style>
