import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLevelStore } from './level'
import { BASE_BRUSH, type Brush } from '@/models/brush'
import { useMousePressed, useStorage } from '@vueuse/core'
import type { BlockCell } from '@/models/level'
import { type Immutable } from '@/models/utils'

export const useUiStore = defineStore('ui', () => {
  const levelStore = useLevelStore()

  const setUpDialogVisible = ref(!levelStore.isInitialized)
  watch(
    () => [setUpDialogVisible.value, levelStore.isInitialized],
    ([newVisible, isInitialized]) => {
      if (!isInitialized && !newVisible) setUpDialogVisible.value = true
    },
    { immediate: true },
  )

  const focusedBlockId = useStorage<number>('ui.focusedBlockId', 0)

  const currentBrush = ref<Brush>(BASE_BRUSH.select)

  const focusedCell = ref<Immutable<BlockCell>>()

  const cursor = ref({
    inGrid: false,
    x: 0,
    y: 0,
    isPressed: false,
  })

  watch(focusedBlockId, () => {
    focusedCell.value = undefined
  })

  const handleMousePressed = (e: MouseEvent) => {
    const leftButtonPressed = Boolean(e.buttons & 1)

    if (leftButtonPressed === cursor.value.isPressed) return

    cursor.value = {
      ...cursor.value,
      isPressed: leftButtonPressed,
    }
  }

  useMousePressed({
    onPressed(e) {
      if (e instanceof MouseEvent) {
        handleMousePressed(e)
        return
      }
      if (!cursor.value.isPressed) {
        cursor.value = { ...cursor.value, isPressed: true }
      }
    },
    onReleased(e) {
      if (e instanceof MouseEvent) {
        handleMousePressed(e)
        return
      }
      if (cursor.value.isPressed) {
        cursor.value = { ...cursor.value, isPressed: false }
      }
    },
  })

  return {
    setUpDialogVisible,
    focusedBlockId,
    currentBrush,
    focusedCell,
    cursor,
    handleMousePressed,
  }
})
