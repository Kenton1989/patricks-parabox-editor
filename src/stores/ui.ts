import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLevelStore } from './level'

export const useUiStore = defineStore(
  'ui',
  () => {
    const levelStore = useLevelStore()

    const setUpDialogVisible = ref(!levelStore.isInitialized)
    watch(
      () => [setUpDialogVisible.value, levelStore.isInitialized],
      ([newVisible, isInitialized]) => {
        if (!isInitialized && !newVisible) setUpDialogVisible.value = true
      },
      { immediate: true },
    )

    return {
      setUpDialogVisible,
    }
  },
  {
    undo: { disable: true },
  },
)
