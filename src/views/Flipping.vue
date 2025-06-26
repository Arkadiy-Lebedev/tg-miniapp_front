
<script setup lang="ts">
import Header from '@/components/Header.vue';
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {useUserStore} from '@/stores/user' 
import { io } from 'socket.io-client';
import { gsap } from 'gsap'

const userStore = useUserStore()
const router = useRouter()

interface Player {
  id: string;
  username: string;
  score: number;
}

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

const socket = io('http://localhost:3000');
const username = ref('');
const roomId = ref('');
const joinRoomId = ref('');
const rooms = ref<{roomId:string, name:string}[]>([]);
const players = ref<Player[]>([]);
const cards = ref<Card[]>([]);
const currentPlayer = ref(0);
const gameStarted = ref(false);
const gameOver = ref(false);
const winner = ref(-1);
const isCreate = ref(false)
const myIdRoom = ref('')
const gameScreen = ref<HTMLElement | null>(null)
const textStep = ref('')

const isYourTurn = computed(() => {
  if (!gameStarted.value || !players.value.length) return false;
  return players.value[currentPlayer.value]?.id === socket.id;
});


let animationTimeout: ReturnType<typeof setTimeout>;

watch(currentPlayer, (newVal, oldVal) => {
  if (!gameStarted.value || !players.value.length) return;

  // Очищаем предыдущий таймаут
  clearTimeout(animationTimeout);
  
  // Останавливаем текущие анимации элемента
  gsap.killTweensOf(gameScreen.value);

  if (players.value[currentPlayer.value]?.id === socket.id) {
    console.log("ваш ход");
    textStep.value = "Ваш ход";
  } else {
    textStep.value = "ход противника";
    console.log("ход противника");
  }

  // Запускаем новую анимацию
  gsap.fromTo(gameScreen.value, 
    { autoAlpha: 0 },
    { 
      autoAlpha: 1, 
      duration: 1, 
      ease: 'power2.inOut',
      onComplete: () => {
        animationTimeout = setTimeout(() => {
          gsap.to(gameScreen.value, { 
            autoAlpha: 0, 
            duration: 1, 
            ease: 'power2.inOut' 
          });
        }, 1000);
      }
    }
  );
});



const createRoom = () => {
  // if (!username.value.trim()) return;
  isCreate.value = true
  socket.emit('createRoom', "Имя InitData");
};


const joinRoom = (idRoom:string) => {
  // if (!username.value.trim() || !joinRoomId.value.trim()) return;
  // roomId.value = joinRoomId.value
  socket.emit('joinRoom', { 
    roomId: idRoom, 
    username: "имя телеграмм"
  });
};

const leaveRoom = () => {
  socket.emit('leaveRoom');
  resetGame();
};

const stopFind = () => {
  socket.emit('stopFind', myIdRoom.value, (response: { success: boolean }) => {
    if (response.success) {
      isCreate.value = false;
      console.log('Поиск успешно остановлен');
    } else {
      console.error('Неизвестная ошибка');
      // Можно показать пользователю сообщение об ошибке
    }
  });
};

const countClick = ref(0)

const onCardClick = (cardId: number) => {
  if(countClick.value==2)return
    console.log(cardId)
  if (!isYourTurn.value || gameOver.value) return;
  console.log(cardId)
  countClick.value++
  socket.emit('flipCard', { roomId: roomId.value, cardId });
};

const resetGame = () => {
  roomId.value = '';
  joinRoomId.value = '';
  players.value = [];
  cards.value = [];
  currentPlayer.value = 0;
  gameStarted.value = false;
  gameOver.value = false;
  winner.value = -1;
};

// Socket event listeners

socket.on('updateData', (data: {rooms:{roomId:string, name:string}[]}) => {
  rooms.value = data.rooms 
});

socket.on('roomIdInCreate', (data: {id:string}) => {
  myIdRoom.value = data.id 
});

socket.on('roomCreated', (data: {rooms:{roomId:string, name:string}[]}) => {
  // roomId.value = id;
  console.log(data)
  rooms.value = data.rooms
 
});

socket.on('playerJoined', (data: {players:Player[], roomId:string}) => {
  console.log( data.players)
  players.value = data.players;
  roomId.value = data.roomId
  isCreate.value = false
});

socket.on('gameStarted', (data: { cards: Card[], currentPlayer: number }) => {
  console.log("старт")
   console.log(data)
      console.log(currentPlayer)
  cards.value = data.cards;
  currentPlayer.value = data.currentPlayer;
  gameStarted.value = true;
});

socket.on('cardFlipped', (data: { cardId: number, playerIndex: number }) => {
  const card = cards.value.find(c => c.id === data.cardId);
  if (card) card.flipped = true;
});

socket.on('matchFound', (data: { 
  cardIds: number[], 
  playerIndex: number,
  scores: number[]
}) => {
  countClick.value=0
  data.cardIds.forEach(id => {
    const card = cards.value.find(c => c.id === id);
    if (card) card.matched = true;
  });
  players.value.forEach((player, index) => {
    player.score = data.scores[index];
  });
});

socket.on('switchPlayer', (data: { 
  cardIds: number[], 
  currentPlayer: number 
}) => {
  countClick.value=0
  data.cardIds.forEach(id => {
    const card = cards.value.find(c => c.id === id);
    if (card) card.flipped = false;
  });
  currentPlayer.value = data.currentPlayer;
});

socket.on('gameOver', (data: { winner: number }) => {
  gameOver.value = true;
  winner.value = data.winner;
});

socket.on('playerLeft', (roomPlayers: Player[]) => {
  players.value = roomPlayers;
  if (players.value.length < 2) {
    gameStarted.value = false;
  }
});

socket.on('error', (message: string) => {
  alert(message);
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<template> 
  <div class="wrapper">

    <Header :name="userStore.user.name" :count="userStore.user.currentEnergy"/>
    
    <div class="content">

<div  class="main">
  <!-- <p class="mainTitle">Найди пару</p> -->
  <div v-if="isCreate" > 
    <div class="loading">
          <p class="text-find title">
        Поиск соперника
    </p>    
      <svg class="loading-svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" 
viewBox="0 0 128 128" xml:space="preserve">
<rect x="0" y="0" width="100%" height="100%" fill="none" /><g><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#000000"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(45 64 64)"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(90 64 64)"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(135 64 64)"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(180 64 64)"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(225 64 64)"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(270 64 64)"/>
<path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" transform="rotate(315 64 64)"/>
<animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg>
    </div>
    <button class="cancel" @click="stopFind">Отмена</button>
    </div>


  <div v-else>
      <div v-if="!gameStarted" class="menu">
        <button @click="createRoom">Найти соперника</button>
        <!-- <div class="or-divider">или</div>
        <input v-model="joinRoomId" placeholder="Код комнаты" />
        <button @click="joinRoom">Присоединиться</button> -->
      </div>
    </div>

  <div class="" v-if="!gameStarted">
  <div v-if="!isCreate && rooms.length>0" class="find-room">
      <h2 class="title">Ищут игру:</h2>
      <div class="waiting-room">     
        <div class="players-list">          

          <table class="table">

<tbody>
  <tr  v-for="(room, index) in rooms" :key="index" 

      >
    <td>{{ index + 1 }}</td>
    <td >
      <div class="name-block">
      <img   alt="" class="avatar">
      {{ room.name }}  
    </div>
    </td>
    <td>
      <div class="name-block">
        <button class="button" @click="joinRoom(room.roomId)">принять </button>
      </div>
 
    </td>		
  </tr>
</tbody>
</table>


        </div>

      </div>
    </div>



    
</div>
    <div  v-else>
      <div class="game-header">
        <div class="players-info">
          <div v-for="(player, index) in players" :key="index" 
              >
               <p class="name"  :class="{ 'active-player': currentPlayer === index }">
                 {{ player.username }}:  {{ player.score }}
               </p>
            
        
          </div>
        </div>
        <!-- <div v-if="isYourTurn" class="your-turn">Ваш ход!</div> -->
      </div>

      <div class="game-board" :style="`grid-template-columns: repeat(4, 1fr)`">
        <div v-for="card in cards" :key="card.id" 
             class="card" 
             :class="{ 
               'flipped': card.flipped, 
               'matched': card.matched 
             }"
             @click="onCardClick(card.id)">
          <div class="card-front"></div>
          <div class="card-back">{{ card.value }}</div>
        </div>

        <div v-if="textStep!=''" ref="gameScreen" class="screen-step">
{{ textStep }}
        </div>
      </div>

      <div v-if="gameOver" class="game-over">
        <h2>Игра окончена!</h2>
        <p v-if="winner === -1">Ничья!</p>
        <p v-else>Победитель: {{ players[winner].username }} с {{ players[winner].score }} очками!</p>
        <button @click="leaveRoom">Выйти в меню</button>
      </div>
    </div>
  
</div>
    </div>   
      </div>
    </template>
  
   
    <style scoped>

    .screen-step{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .name{
      font-size: calc(var(--app-width)* 4 / 100);
      color: #a0a0a0;
      transition: color 0.3s ease;
    }
    
  .counter{
      font-size: calc(var(--app-width)* 4 / 100);
      color: #a0a0a0;
    }

    .players-info{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .cancel{    
      display: block;
      margin: 0 auto;
        margin-top: calc(var(--app-width)* 10.5 / 100);
    }

    .loading{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: calc(var(--app-width)* 3 / 100);;
    }

    .loading-svg{
      width:  calc(var(--app-width)* 6.5 / 100);
      height: calc(var(--app-width)* 6.5 / 100);
    }

    .back-group{
      display: flex;
      align-items: center;
      gap: calc(var(--app-width)*5.5 / 100);;
    }

.back{
  width: calc(var(--app-width)* 8.5 / 100);
  height: calc(var(--app-width)*8.5 / 100);
  margin-right: calc(var(--app-width)* 1.5 / 100);
}

.find-room{
  margin-top: calc(var(--app-width)* 8.5 / 100);
}

.modal-content{
    width: 87%;

}

  .wrapper{
  width: 100%;
    height:100%;
  padding-top: calc(var(--app-width)* 19 / 100);;
  }
  

  .content{

    width: 87%;
    margin: 0 auto;
    height:100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }



  .title{
    color: seashell;
    font-weight: 500;
    font-size: calc(var(--app-width)* 4 / 100);
    line-height: calc(var(--app-height)* 3.2 / 100);
  }
  
  .mainTitle{
    color: seashell;
    font-weight: 500;
    font-size: calc(var(--app-width)* 8 / 100);
    line-height: calc(var(--app-height)* 3.2 / 100);
    text-align: center;  
      margin-bottom: calc(var(--app-width)* 8 / 100);
  }


  .text{
    margin-top: calc(var(--app-width)* 4.58 / 100);
  }

  .main{
    /* background-image: url("@/assets/images/modal-bg.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%; */
    border-radius: 0px;
background: #04482f;
box-shadow:  13px 13px 26px #03301f,
             -13px -13px 26px #05603f;
    padding: calc(var(--app-width)* 11.28 / 100) calc(var(--app-width)* 0.58 / 100) calc(var(--app-width)* 7.28 / 100) calc(var(--app-width)* 4.38 / 100);
    height: 90%;
    overflow: auto;
  }


  
.player-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 18px;
}

.active-player {
  font-weight: bold;
  color: #ffffff;
}

.game-board {
  display: grid;
  grid-gap: 10px;
  margin-bottom: 20px;
}

.card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
}

.card-front {
  background: #42b983;
}

.card-back {
  background: #fff;
  color: #2c3e50;
  transform: rotateY(180deg);
  border: 2px solid #2c3e50;
}

.card.flipped .card-front {
  transform: rotateY(180deg);
}

.card.flipped .card-back {
  transform: rotateY(0deg);
}

.card.matched {
  opacity: 0.5;
  cursor: default;
}

.game-over {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #3aa876;
}



.table {
	width: 100%;
	border: none;
  margin-bottom: calc(var(--app-width)* 7 / 100) ;
  margin-top: calc(var(--app-width)* 2 / 100) ;
}
.table thead th {
	padding: calc(var(--app-width)* 7 / 100) ;
	font-weight: 500;
	text-align: left;
	color: #ffffff;

}
.table tbody td {
	padding: calc(var(--app-width)* 1.1 / 100) ;
  text-align: center;
	color: #ffffff;
	border-bottom: 1px solid #716561;
}
    </style>