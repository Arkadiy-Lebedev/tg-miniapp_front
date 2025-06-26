import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface IUser {
  name: string,
  winStreak?: number,
  userId: number,
  currentEnergy: number,
  ticket: number,
  avatar?: string | null
}

export const useUserStore = defineStore('userStore', () => {
  const user = ref<IUser>({
    name: "",
    winStreak: 0,
    userId: 0,
    currentEnergy: 0,
    ticket: 0,
    avatar: null,
  })

  const initData = ref<string>('')
 
  

  return { user  }
})
