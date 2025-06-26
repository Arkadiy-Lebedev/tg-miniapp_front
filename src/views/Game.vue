<template>
  <div 
    class="game-container" 
    ref="gameContainer" 
    @click="handleClick"
  @touchstart="handleTouch"
  >
  <Blink v-if="isBlink"/>
  <div v-if="isModal" class="wrapper-modal">
      <div class="modal-content">
        <div class="modal-block">
           <p class="text-winner text"> Поздравляем!</p>       
           <p class=" text"> Вы заработали</p>   
           <div class="ticket_block">
                      <p class="text-ticket text"> {{ score }}</p>    
          <img :src="PizzaBal" alt="" class="modal-ticket">
           </div>         
        </div>
<div ref="btnRef" class="btn-wrapper">
  <ButtonAlfa @click="endGames" text="ЗАБРАТЬ"/>
</div>
      </div>
    </div>

        <Balls 
      v-for="(item, index) in balls" 
      :key="index"
     class="balls-item"
    :x="item.x"
    :y="item.y"
    :bal="item.bal"
    >

</Balls>

  <div class="timer"> {{ formattedTime }}</div>
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="falling-item"
      :style="{
        left: `${item.x}px`,
        top: `${item.y}px`,      
        width: `${item.width}px`,
        height: `${item.height}px`
      }"
    ><img :src="item.bg" alt="" class="item"></div>
    <div class="score"><img :src="PizzaBal" alt="" class="pizza-bal"> {{ score }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, computed  } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router'
import {baseUrl} from '@/API/api' 
import ButtonAlfa from '@/UI/Button/ButtonAlfa.vue';
import Balls from '../components/Balls.vue'
import Blink from '@/components/Blink.vue'
import Pizza from '../assets/images/pizza.svg'
import PizzaBal from '../assets/images/pizza-bal.svg'
import Bomb from '../assets/images/chil.svg'
import {useUserStore} from '@/stores/user' 


const userStore = useUserStore()
const router = useRouter()

const CLICK_TOLERANCE = 15;
const MAX_ITEMS = 100;
const GAME_DURATION = 30; // 30 секунд

interface FallingItem {
  x: number;
  y: number;
  color: string;
  speed: number;
  width: number;
  height: number;
  active: boolean;
  bg: string;
}

interface IBalls {
  x: number;
  y: number;
  bal: number;
}

interface IEndGameData {
  status: boolean;
  ticket: number;
  currentEnergy: number;
}

const items = ref<FallingItem[]>([]);
const balls = ref<IBalls[]>([]);
const score = ref(0);
const gameContainer = shallowRef<HTMLElement | null>(null);
const gameWidth = ref(0);
const gameHeight = ref(0);
const isBlink = ref(false)
const isModal = ref(false)
// Таймер
const timeLeft = ref(GAME_DURATION);
const isGameRunning = ref(true);

let animationFrameId: number;
let spawnInterval: number;
let resizeObserver: ResizeObserver | null = null;

const getSpawnRate = () => Math.random() * 200 + 200;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

const colors = [
  { color: 'red', points: 5, weight: 45, bg:Pizza },
  { color: 'yellow', points: 10, weight: 45,  bg:Pizza  },
  { color: 'black', points: -100, weight: 10, bg:Bomb },
];

const blink = () => {
  isBlink.value = true
  setTimeout(() => {
    isBlink.value = false
  }, 300)
}

const updateTimer = () => {
  if (!isGameRunning.value) return;
  
  timeLeft.value -= 1;
  
  if (timeLeft.value <= 0) {
    endGame();
  }
};

const endGame = () => {
  isGameRunning.value = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(animationFrameId);
  console.log('Game over! Final score:', score.value);
  isModal.value = true
};


const getRandomColor = () => {
  const totalWeight = colors.reduce((sum, color) => sum + color.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const color of colors) {
    if (random < color.weight) return color;
    random -= color.weight;
  }
  
  return colors[0];
};

const updateGameSize = () => {
  if (gameContainer.value) {
    gameWidth.value = gameContainer.value.clientWidth;
    gameHeight.value = gameContainer.value.clientHeight;
  }
};

const createItem = (): FallingItem => {
const colorData = getRandomColor();
  const width = colorData.color == 'red' ? 20 + Math.random() * 10 : colorData.color == 'yellow' ? 30 + Math.random() * 20 :  35 + Math.random() * 25;
  const height = width;
  
  return {
    x: Math.random() * (gameWidth.value - width),
    y: -height,
    color: colorData.color,
    speed: 2 + Math.random() * 1,
    width,
    height,
    active:false,
    bg:colorData.bg
  };
};

const updateGame = () => {
   if (!isGameRunning.value) return;
  items.value = items.value.filter(item => {
    item.y += item.speed;
    return item.y < gameHeight.value;
  });
};

// const spawnItem = () => {
//   if (gameWidth.value > 0 && gameHeight.value > 0 && items.value.length < MAX_ITEMS) {
//     items.value.push(createItem());
//   }
// };

const spawnItem = () => {
  if (gameWidth.value > 0 && gameHeight.value > 0 && items.value.length < MAX_ITEMS) {
    items.value.push(createItem());
    // Устанавливаем следующий интервал с небольшим случайным разбросом
    clearInterval(spawnInterval);
    spawnInterval = window.setInterval(spawnItem, getSpawnRate());
  }
};

const addBallToGame = (x :number, y:number, bal:number) => {
              //вставляем отображение очков на месте клика
              balls.value.push(
              {x:  x,
              y: y,
              bal:bal }
            )
        //удаляем отображение очков через 1 секунду
    setTimeout(()=>{ balls.value.shift()}, 1000)
      }


      const handleTouch = (event: TouchEvent) => {
  if (!isGameRunning.value || !gameContainer.value) return;
  
  const rect = gameContainer.value.getBoundingClientRect();
  // Обрабатываем все касания
  for (let i = 0; i < event.touches.length; i++) {
    const touch = event.touches[i];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    checkCollision(touchX, touchY);
  }
};

const checkCollision = (x: number, y: number) => {
  // Идём с конца для корректного удаления
  for (let i = items.value.length - 1; i >= 0; i--) {
    const item = items.value[i];
    const predictedY = item.y - item.speed * 0.1;
    
    if (
      x >= item.x - CLICK_TOLERANCE &&
      x <= item.x + item.width + CLICK_TOLERANCE &&
      y >= predictedY - CLICK_TOLERANCE &&
      y <= predictedY + item.height + CLICK_TOLERANCE
    ) {
      const colorData = colors.find(c => c.color === item.color);
      if (colorData) {
        // если цвет черный, очищаем все предметы и выводим -3 балла
        if(item.color == 'black')  {
          blink()
          items.value = []
          score.value += colorData.points;
        if(score.value<0) score.value =0
        addBallToGame(x, y, colorData?.points)
          // сюда вставить вывод -3 балла, после удаления всех предметов
        return}

        score.value += colorData.points;
        addBallToGame(x, y, colorData?.points)
    
      items.value.splice(i, 1);
      break;
    } // Прерываем после первого попадания для этого касания
    }
  }
};

const handleClick = (event: MouseEvent) => {
  if (!isGameRunning.value || !gameContainer.value) return;
  
  const rect = gameContainer.value.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  
  checkCollision(clickX, clickY);
};



const gameLoop = () => {
  updateGame();
  animationFrameId = requestAnimationFrame(gameLoop);
};

onMounted(() => {
  if (gameContainer.value) {
    updateGameSize();
    resizeObserver = new ResizeObserver(updateGameSize);
    resizeObserver.observe(gameContainer.value);
    gameLoop();
spawnInterval = window.setInterval(spawnItem, getSpawnRate());
  }

      // Запускаем таймер
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Очищаем таймер при уничтожении компонента
    onUnmounted(() => {
      clearInterval(timerInterval);
    });
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
  cancelAnimationFrame(animationFrameId);
  clearInterval(spawnInterval);
});

const endGames = async() => {
  console.log(666)
  try {
      const { data } = await axios.post<IEndGameData>(`${baseUrl}/api/game/end`, {
  "userId": userStore.user.userId,
  "energy":score.value,
});
if(data.status){
  userStore.user.ticket = data.ticket
  userStore.user.currentEnergy=data.currentEnergy
}
router.push({ name: 'index' })
  } 
  catch (error) {
    console.error(error);
    router.push({ name: 'index' })
  }

}


</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100vh; 
  overflow: hidden;
  /* pointer-events: none; */
  background-image: url("@/assets/images/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

.falling-item {
  position: absolute;
  border-radius: 50%;
  pointer-events: auto;
  will-change: transform;
  transition: transform 0.1s ease;
   will-change: transform; 

}

.item{
  width: 100%;
  height: 100%;
}

.balls-item {
  position: absolute;

  pointer-events: none;

}

/* .falling-item:active {
  transform: scale(0.2);
} */

.score {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
}

.pizza-bal{
  width: calc(var(--app-width)* 6 / 100);
  margin-right: calc(var(--app-width)* 3 / 100);
}


.ticket_block{
  margin-top:calc(var(--app-width)* 7 / 100);
  display: flex;
gap: calc(var(--app-width)* 4 / 100);
justify-content: center;
}

    .modal-ticket{
      width: calc(var(--app-width)* 15 / 100);

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
.text{
    margin-top: calc(var(--app-width)* 4.58 / 100);
  }

  .btn-wrapper{
    margin-top: calc(var(--app-width)* 6 / 100) ;
    width: 100%;
  }
</style>