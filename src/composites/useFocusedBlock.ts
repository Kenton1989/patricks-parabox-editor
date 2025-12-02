import { useUiStore } from '@/stores/ui'
import { createSharedComposable } from '@vueuse/core'
import { computed } from 'vue'
import useBlock from './useBlock'

function useFocusedBlockImpl() {
  const uiStore = useUiStore()

  const { block, update, updateNoCommit, commit, grid } = useBlock(
    computed(() => uiStore.focusedBlockId),
  )

  return { focusedBlock: block, update, commit, updateNoCommit, grid }
}

const useFocusedBlock = createSharedComposable(useFocusedBlockImpl)

export default useFocusedBlock
