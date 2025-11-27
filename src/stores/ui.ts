import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLevelStore } from './level'
import { BASE_BRUSH, type Brush } from '@/models/brush'

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

    const focusedBlockId = ref<number>()

    const currentBrush = ref<Brush>(BASE_BRUSH.select)

    return {
      setUpDialogVisible,
      focusedBlockId,
      currentBrush,
    }
  },
  {
    undo: { disable: true },
  },
)
