<template>
  <div 
    class="game-container" 
    ref="gameContainer" 
    @mousedown="handleClick"
    @touchstart.passive="handleClick"
  >
  <Blink v-if="isBlink"/>

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
import Balls from '../components/Balls.vue'
import Blink from '@/components/Blink.vue'
import Pizza from '../assets/images/pizza.svg'
import PizzaBal from '../assets/images/pizza-bal.svg'
import Bomb from '../assets/images/bomb.svg'

const CLICK_TOLERANCE = 15;
const MAX_ITEMS = 100;
const GAME_DURATION = 90; // 90 секунд

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

const items = ref<FallingItem[]>([]);
const balls = ref<IBalls[]>([]);
const score = ref(0);
const gameContainer = shallowRef<HTMLElement | null>(null);
const gameWidth = ref(0);
const gameHeight = ref(0);
const isBlink = ref(false)
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
  { color: 'red', points: 10, weight: 45, bg:Pizza },
  { color: 'yellow', points: 20, weight: 45,  bg:Pizza  },
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

const handleClick = (event: MouseEvent | TouchEvent) => {
   if (!isGameRunning.value || !gameContainer.value || items.value.length === 0) return;

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

  const rect = gameContainer.value.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const clickY = clientY - rect.top;

  const isClickOutsideAllItems = items.value.every(item => 
    clickX < item.x - CLICK_TOLERANCE || 
    clickX > item.x + item.width + CLICK_TOLERANCE ||
    clickY < item.y - CLICK_TOLERANCE || 
    clickY > item.y + item.height + CLICK_TOLERANCE
  );

  if (isClickOutsideAllItems) return;

  for (let i = items.value.length - 1; i >= 0; i--) {
    const item = items.value[i];
    const predictedY = item.y - item.speed * 0.1;

    if (
      clickX >= item.x - CLICK_TOLERANCE && 
      clickX <= item.x + item.width + CLICK_TOLERANCE &&
      clickY >= predictedY - CLICK_TOLERANCE && 
      clickY <= predictedY + item.height + CLICK_TOLERANCE
    ) {
      console.log(item)
      item.active = true;
      const colorData = colors.find(c => c.color === item.color);
      if (colorData) {
        // если цвет черный, очищаем все предметы и выводим -3 балла
        if(item.color == 'black')  {
          blink()
          items.value = []
          score.value += colorData.points;
        if(score.value<0) score.value =0
        addBallToGame(clickX, clickY, colorData?.points)
          // сюда вставить вывод -3 балла, после удаления всех предметов
        return}

        score.value += colorData.points;
        addBallToGame(clickX, clickY, colorData?.points)
    
      items.value.splice(i, 1);
      break;
    }
  }
}
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
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100vh; 
  overflow: hidden;
  pointer-events: none;
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

</style>