import { useFileDialog } from '@vueuse/core'
import { computed } from 'vue'

export default function useOpenLevelDialog() {
  const fileDialog = useFileDialog()

  const open = () =>
    fileDialog.open({
      accept: 'text/plain,.ppbox',
      reset: true,
    })

  const file = computed(() => fileDialog.files.value?.item(0) ?? undefined)

  const onChange = (callback: (file?: File) => void) => {
    fileDialog.onChange((files) => {
      callback(files?.item(0) ?? undefined)
    })
  }

  return {
    open,
    file,
    onChange,
  }
}
