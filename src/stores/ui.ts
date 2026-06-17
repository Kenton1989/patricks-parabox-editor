import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useLevelStore } from './level'
import { BASE_BRUSH, type Brush } from '@/models/brush'
import { useMousePressed, useStorage } from '@vueuse/core'
import { toObjsSortedByLayer, type BlockCell } from '@/models/level'
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

  const cursor = ref({
    inGrid: false,
    x: 0,
    y: 0,
    leftPressed: false,
    rightPressed: false,
  })

  const _focusedCellPos = ref<{ x: number; y: number }>()
  const focusCell = (x: number, y: number) => {
    _focusedCellPos.value = { x, y }
  }
  const unfocusCell = () => {
    _focusedCellPos.value = undefined
  }

  watch(focusedBlockId, () => {
    unfocusCell()
  })

  const exportEditorSaveData = () => ({
    focusedBlockId: focusedBlockId.value,
  })

  const initEditorSaveData = (data: { focusedBlockId: number }) => {
    focusedBlockId.value = data.focusedBlockId
    unfocusCell()
  }

  const focusedCell = computed<Immutable<BlockCell> | undefined>(() => {
    if (!_focusedCellPos.value) return
    const { x, y } = _focusedCellPos.value

    const cellObjects = levelStore.getObjectsByCell(focusedBlockId.value, x, y)
    if (cellObjects.length === 0) return undefined

    return {
      x: _focusedCellPos.value.x,
      y: _focusedCellPos.value.y,
      layeredObjects: toObjsSortedByLayer(cellObjects),
    }
  })

  const handleMousePressed = (e: MouseEvent) => {
    const leftPressed = Boolean(e.buttons & 1)
    const rightPressed = Boolean(e.buttons & 2)

    if (leftPressed === cursor.value.leftPressed && rightPressed === cursor.value.rightPressed) {
      return
    }

    cursor.value = {
      ...cursor.value,
      leftPressed,
      rightPressed,
    }
  }

  useMousePressed({
    onPressed(e) {
      if (e instanceof MouseEvent) {
        handleMousePressed(e)
        return
      }
      if (!cursor.value.leftPressed) {
        cursor.value = { ...cursor.value, leftPressed: true }
      }
    },
    onReleased(e) {
      if (e instanceof MouseEvent) {
        handleMousePressed(e)
        return
      }
      if (cursor.value.leftPressed) {
        cursor.value = { ...cursor.value, leftPressed: false }
      }
    },
  })

  return {
    _focusedCellPos,

    setUpDialogVisible,
    focusedBlockId,
    exportEditorSaveData,
    initEditorSaveData,
    currentBrush,
    focusedCell,
    focusCell,
    unfocusCell,
    cursor,
    handleMousePressed,
  }
})
