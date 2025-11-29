import { computed } from 'vue'
import { useLevelStore } from './level'
import { render } from '@/service/renderer'
import { defineStore } from 'pinia'
import type { LevelBlock } from '@/models/level'

export const useBlockPreviewsStore = defineStore('block-preview', () => {
  const levelScore = useLevelStore()

  const map = computed(() => render.blockPreviews(levelScore.levelBlocks as LevelBlock[]))

  return {
    map,
  }
})
