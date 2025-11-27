<template>
  <InfoCard v-if="focusedBlock" class="w-full" title="Block Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="ID">
        <p>{{ focusedBlock.blockId }}</p>
      </InfoLine>
      <InfoLine label="Name">
        <InputText :modelValue="focusedBlock.name" size="small" fluid />
      </InfoLine>
      <InfoLine label="Square">
        <ToggleSwitch v-model="enforceSquare" />
      </InfoLine>
      <InfoLine label="Width">
        <InputNumber v-model="focusedBlock.width" size="small" fluid showButtons :min="1" />
      </InfoLine>
      <InfoLine label="Height" v-if="!enforceSquare">
        <InputNumber v-model="focusedBlock.height" size="small" fluid showButtons :min="1" />
      </InfoLine>
      <InfoLine label="Zoom">
        <InputNumber v-model="focusedBlock.zoomFactor" size="small" fluid />
      </InfoLine>
      <InfoLine label="Color">
        <BlockColorPicker v-model="focusedBlock.color" />
      </InfoLine>
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import useFocusedBlock from '@/composites/useFocusedBlock'
import InfoCard from './InfoCard.vue'
import InfoLine from './InfoLine.vue'
import { InputNumber, InputText, ToggleSwitch } from 'primevue'
import { ref, watch } from 'vue'
import BlockColorPicker from './BlockColorPicker.vue'

const { focusedBlock } = useFocusedBlock()

const enforceSquare = ref(true)

watch(enforceSquare, (newVal) => {
  if (!focusedBlock.value || !newVal) return

  focusedBlock.value.width = focusedBlock.value.height = Math.max(
    focusedBlock.value.width,
    focusedBlock.value.height,
  )
})

watch(
  focusedBlock,
  (newVal, oldVal) => {
    // block switched
    if (oldVal?.blockId !== newVal?.blockId && newVal) {
      enforceSquare.value = newVal.width === newVal.height
    }

    if (!newVal) {
      return
    }

    // block not switched but resized
    if (newVal.width !== newVal.height && enforceSquare.value && focusedBlock.value) {
      focusedBlock.value.height = focusedBlock.value.width
    }
  },
  { immediate: true },
)
</script>
