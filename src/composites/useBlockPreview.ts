import { render } from '@/service/renderer'
import { useBlockPreviewsStore } from '@/stores/block-previews'
import { watch, type Ref } from 'vue'

export default function useBlockPreview(
  ref: Ref<HTMLCanvasElement | undefined | null>,
  blockId: number,
) {
  const blockPreviews = useBlockPreviewsStore()

  watch(
    () => [ref.value, blockPreviews.map.get(blockId)],
    ([newRef, newPreview]) => {
      if (!newRef || !newPreview) return
      render.copy(newRef, newPreview)
    },
  )
}
