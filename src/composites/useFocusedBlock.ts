import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { computed } from 'vue'

export default function useFocusedBlock() {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()

  return computed(() => {
    return levelStore.levelBlocks.find((b) => b.blockId === uiStore.focusedBlockId)
  })
}
