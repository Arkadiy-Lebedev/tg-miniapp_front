import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useHelperStore = defineStore('helperStore', () => {
  const isInstruction = ref(false)
  const isShowRole= ref(false)
  

  return { isInstruction, isShowRole  }
})
