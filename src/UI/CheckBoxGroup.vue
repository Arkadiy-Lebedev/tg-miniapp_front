<script setup lang="ts">
const modelValue = defineModel()
</script>

<template>
  <div class="wrapper__check">
    <div class="input-block">
          <input
      v-model="modelValue"
      class="check"
      type="checkbox"
      id="first_solution"
      name="solution"
      checked
      required
    />
    </div>

    <label class="label-check" for="first_solution">
      Я согласен(а) на <a target="_blank" class="label-check link" href="https://fut.ru/personal-data">обработку персональных данных</a> и получение информационных сообщений, а также с     <a target="_blank" class="label-check link" href="https://run-away-from-fear-alfa.ru.fut.ru/agreement.pdf">правилами проведения акции</a>.
</label >
  </div>
</template>

<style scoped>

.black{
  color: var(--color-text);
}


.check {
  flex-shrink: 0;
}

.input-block{

border: 01 solid #EF3124;

height: 20px;
width:20px;
display: flex;
justify-content: center;
align-items: center;
}

input[type='checkbox'] {
appearance: none;
background: transparent;
border: 1px solid #EF3124;
height: 15px;
width:15px;

vertical-align: text-bottom;
position: relative;
}

input[type='checkbox']::before {
  content: '';
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  top: 0;

  background-repeat: no-repeat;
  background-position: center center;

}

input[type='checkbox']:checked::before {
  /* transform: rotate(50deg) translateY(-20%) translateX(-10%); */
  background-image: url('@/assets/images/finish/check.svg');
}

input[type='checkbox']:checked {

  background: #EF3124;

}

.wrapper__check {
  display: flex;
  gap: 7px;
  justify-content: flex-start;
}

.label-check {
  cursor: pointer;
  color:#000000;
  font-size: calc(var(--app-width)* 3.5 / 100);
    line-height: calc(var(--app-height)* 1.9 / 100);
}

.link {
color:#000000;
text-decoration: underline;
}


</style>
