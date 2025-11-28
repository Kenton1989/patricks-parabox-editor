import { createSharedComposable, useActiveElement } from '@vueuse/core'
import { computed, onUnmounted } from 'vue'
import useEditorActions from './useEditorActions'

function useHotkeys() {
  const activeElement = useActiveElement()
  const usingInput = computed(
    () => activeElement.value?.tagName === 'INPUT' || activeElement.value?.tagName === 'TEXTAREA',
  )

  const actions = useEditorActions()

  const triggerAction = (e: KeyboardEvent) => {
    Object.values(actions).forEach((action) => {
      if (usingInput.value) return

      if (!action.hotkeyPressed(e)) return

      action.command()

      e.preventDefault()
    })
  }

  document.addEventListener('keydown', triggerAction)
  onUnmounted(() => {
    document.removeEventListener('keydown', triggerAction)
  })
}

const useGlobalHotkeys = createSharedComposable(useHotkeys)

export default useGlobalHotkeys
