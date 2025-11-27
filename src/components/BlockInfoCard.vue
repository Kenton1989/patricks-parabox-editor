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
        <InputNumber :modelValue="focusedBlock.width" size="small" fluid />
      </InfoLine>
      <InfoLine label="Height" v-if="!enforceSquare">
        <InputNumber :modelValue="focusedBlock.height" size="small" fluid />
      </InfoLine>
      <InfoLine label="Zoom">
        <InputNumber :modelValue="focusedBlock.zoomFactor" size="small" fluid />
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
import { nextTick, ref, watch } from 'vue'
import BlockColorPicker from './BlockColorPicker.vue'

const focusedBlock = useFocusedBlock()

const enforceSquare = ref(true)
watch(
  focusedBlock,
  async (newVal, oldVal) => {
    if (oldVal?.blockId !== newVal?.blockId && newVal) {
      enforceSquare.value = newVal.width === newVal.height
    }
    await nextTick()
  },
  { immediate: true },
)
</script>
