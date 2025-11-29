import { readFileAsText } from '@/service/file'
import { LevelParser as LevelParserV4 } from '@/service/game-level/v4'
import { useLevelStore } from '@/stores/level'
import { useFileDialog } from '@vueuse/core'
import { ref } from 'vue'

export default function useOpenLevel() {
  const fileDialog = useFileDialog()
  const levelStore = useLevelStore()

  const open = () =>
    fileDialog.open({
      accept: 'text/plain,.ppbox',
      reset: true,
    })

  const onSuccessCallback = ref<() => unknown>(() => {})
  const onErrorCallback = ref<(e: unknown) => unknown>(() => {})

  fileDialog.onChange(async (files) => {
    const file = files?.item(0)
    if (!file) return

    try {
      const levelData = await readFileAsText(file)
      const rawLevel = LevelParserV4.parse(levelData)
      levelStore.initLevelV4(rawLevel)

      onSuccessCallback.value()
    } catch (e: unknown) {
      console.error(e)
      onErrorCallback.value(e)
    }
  })

  const onSuccess = (callback: () => unknown) => {
    onSuccessCallback.value = callback
  }

  const onError = (callback: (e: unknown) => unknown) => {
    onErrorCallback.value = callback
  }

  return {
    open,
    onSuccess,
    onError,
  }
}
