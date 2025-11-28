<template>
  <InfoCard v-if="focusedBlock" class="w-full" title="Block Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="ID">
        <p>{{ focusedBlock.blockId }}</p>
      </InfoLine>
      <InfoLine label="Name">
        <InputText
          :modelValue="focusedBlock.name"
          @update:modelValue="(name) => updateNoCommit({ name })"
          @blur="commit"
          size="small"
          fluid
        />
      </InfoLine>
      <InfoLine label="Square">
        <ToggleSwitch v-model="enforceSquare" />
      </InfoLine>
      <InfoLine label="Width">
        <InputNumber
          :modelValue="focusedBlock.width"
          @update:modelValue="
            (width) => (enforceSquare ? update({ width, height: width }) : update({ width }))
          "
          size="small"
          fluid
          showButtons
          :min="1"
        />
      </InfoLine>
      <InfoLine label="Height" v-if="!enforceSquare">
        <InputNumber
          :modelValue="focusedBlock.width"
          @update:modelValue="(height) => update({ height })"
          size="small"
          fluid
          showButtons
          :min="1"
        />
      </InfoLine>
      <InfoLine label="Zoom">
        <InputNumber
          :modelValue="focusedBlock.zoomFactor"
          @update:modelValue="(zoomFactor) => updateNoCommit({ zoomFactor })"
          @blur="commit"
          size="small"
          fluid
        />
      </InfoLine>
      <InfoLine label="Color">
        <BlockColorPicker
          :modelValue="focusedBlock.color"
          @update:modelValue="(color) => update({ color })"
        />
      </InfoLine>
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import useFocusedBlock from '@/composites/useFocusedBlock'
import InfoCard from './InfoCard.vue'
import InfoLine from './InfoLine.vue'
import { InputNumber, InputText, ToggleSwitch } from 'primevue'
import { ref } from 'vue'
import BlockColorPicker from './BlockColorPicker.vue'
import { watchImmediate } from '@vueuse/core'

const { focusedBlock, updateNoCommit, update, commit } = useFocusedBlock()

const enforceSquare = ref(true)

watchImmediate(enforceSquare, (newVal) => {
  if (!focusedBlock.value || !newVal) return

  const newSize = Math.max(focusedBlock.value.width, focusedBlock.value.height)
  update({ width: newSize, height: newSize })
})

watchImmediate(focusedBlock, (newVal, oldVal) => {
  // block switched
  if (newVal?.blockId !== oldVal?.blockId && newVal) {
    enforceSquare.value = newVal.width === newVal.height
  }
})
</script>
