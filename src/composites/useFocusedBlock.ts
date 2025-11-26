import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { computed } from 'vue'

export default function useFocusedBlock() {
  const uiStore = useUiStore()
  const levelStore = useLevelStore()

  return computed(() => {
    console.log('compute focused block', uiStore.focusedBlockId)
    return levelStore.levelBlocks.find((b) => b.blockId === uiStore.focusedBlockId)
  })
}
