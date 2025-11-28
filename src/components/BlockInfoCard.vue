<template>
  <InfoCard v-if="focusedBlock" class="w-full" title="Block Info">
    <div class="flex flex-col gap-2">
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
          @update:modelValue="(width) => resize(width, undefined)"
          size="small"
          fluid
          showButtons
          :min="1"
        />
      </InfoLine>
      <InfoLine label="Height" v-if="!enforceSquare">
        <InputNumber
          :modelValue="focusedBlock.height"
          @update:modelValue="(height) => resize(undefined, height)"
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
          :maxFractionDigits="4"
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

      <Badge :value="`ID: ${focusedBlock.blockId}`" class="self-end" severity="secondary" />
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import useFocusedBlock from '@/composites/useFocusedBlock'
import InfoCard from './InfoCard.vue'
import InfoLine from './InfoLine.vue'
import { Badge, InputNumber, InputText, ToggleSwitch } from 'primevue'
import { ref, watch } from 'vue'
import BlockColorPicker from './BlockColorPicker.vue'
import { watchImmediate } from '@vueuse/core'

const { focusedBlock, updateNoCommit, update, commit } = useFocusedBlock()

const enforceSquare = ref(true)

const resize = (width?: number, height?: number) => {
  console.log('resize to', width, height)
  if (enforceSquare.value) height = width

  width ??= focusedBlock.value?.width
  height ??= focusedBlock.value?.height

  update({ width, height })
}

watch(enforceSquare, (newVal) => {
  console.log('enforce square', enforceSquare.value)

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
