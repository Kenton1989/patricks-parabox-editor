import { computed } from 'vue'
import { useLevelStore } from './level'
import { render } from '@/service/renderer'
import { defineStore } from 'pinia'

export const useBlockPreviewsStore = defineStore(
  'block-preview',
  () => {
    const levelScore = useLevelStore()

    const map = computed(() => render.blockPreviews(levelScore.levelBlocks))

    return {
      map,
    }
  },
  {
    undo: { disable: true },
  },
)
