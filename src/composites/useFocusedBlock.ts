import type { UpdateBlockProps } from '@/models/edit'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { createSharedComposable } from '@vueuse/core'
import { computed } from 'vue'

function useFocusedBlockImpl() {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()

  const focusedBlock = computed(() => {
    return levelStore.getBlock(uiStore.focusedBlockId)
  })

  const update = (values: UpdateBlockProps) => {
    if (uiStore.focusedBlockId === undefined) return

    levelStore.updateBlock(uiStore.focusedBlockId, values)
  }

  const updateNoCommit = (values: UpdateBlockProps) => {
    if (uiStore.focusedBlockId === undefined) return

    levelStore.updateBlock(uiStore.focusedBlockId, values, true)
  }

  return { focusedBlock, update, commit: levelStore.commitEditHistory, updateNoCommit }
}

const useFocusedBlock = createSharedComposable(useFocusedBlockImpl)

export default useFocusedBlock
