import { readFileAsText } from '@/service/file'
import { parseEditorSaveFile } from '@/service/editor-save'
import { LevelParser as LevelParserV4 } from '@/service/game-level/v4'
import { useLevelStore } from '@/stores/level'
import { useUiStore } from '@/stores/ui'
import { useFileDialog } from '@vueuse/core'
import { useConfirm } from 'primevue/useconfirm'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useOpenLevel() {
  const fileDialog = useFileDialog()
  const levelStore = useLevelStore()
  const uiStore = useUiStore()
  const confirm = useConfirm()
  const { t } = useI18n()

  const open = () =>
    fileDialog.open({
      reset: true,
    })

  const defaultOnErrorCallback = (e: unknown) => {
    confirm.require({
      message: `${e}`,
      header: t('dialog.uploadFileError'),
      icon: 'pi pi-exclamation-triangle',
      acceptProps: {
        label: t('common.ok'),
      },
      rejectProps: {
        style: 'display: none',
      },
    })
  }

  const onSuccessCallback = ref<() => unknown>(() => {})
  const onErrorCallback = ref<(e: unknown) => unknown>(defaultOnErrorCallback)

  fileDialog.onChange(async (files) => {
    const file = files?.item(0)
    if (!file) return

    try {
      const levelData = await readFileAsText(file)

      if (file.name.toLocaleLowerCase().endsWith('.ppeproj')) {
        const saveFile = parseEditorSaveFile(levelData)
        levelStore.initEditorSaveData(saveFile.data.level)
        uiStore.initEditorSaveData(saveFile.data.ui)
      } else {
        const rawLevel = LevelParserV4.parse(levelData)
        levelStore.initLevelV4(rawLevel)
      }

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
    onErrorCallback.value = (e: unknown) => {
      defaultOnErrorCallback(e)
      callback(e)
    }
  }

  return {
    open,
    onSuccess,
    onError,
  }
}
