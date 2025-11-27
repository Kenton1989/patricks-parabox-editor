<template>
  <div class="flex h-full flex-row items-center justify-end py-1">
    <div
      class="aspect-square size-6 rounded-sm"
      :style="{ 'background-color': colorConvert.hsbToCss(hsbColorBuffer) }"
    ></div>
    <div class="flex flex-row gap-0 p-1 pr-0">
      <SelectableBox
        v-for="color in DEFAULT_COLORS"
        :key="color"
        class="m-0.5 rounded-full p-0.5 hover:outline"
        @click="() => (blockColorModel = color)"
      >
        <div
          class="aspect-square size-full min-w-3 rounded-full"
          :style="{ 'background-color': colorConvert.blockToCss(color) }"
        ></div>
      </SelectableBox>
    </div>

    <SelectableBox
      class="p-0"
      hint="other colors"
      @click="(e: Event) => colorPickerPopoverRef?.toggle(e)"
    >
      <div class="m-auto flex h-full items-center justify-center">
        <i class="pi pi-palette"></i>
      </div>
    </SelectableBox>

    <Popover ref="color-picker-popover" @hide="confirmColor">
      <div class="fixed top-0 right-0 bottom-0 left-0" @click="colorPickerPopoverRef?.hide"></div>
      <ColorPicker v-model="hsbColorBuffer" inline format="hsb" />
    </Popover>
  </div>
</template>
<script setup lang="ts">
import { DEFAULT_COLORS, type BlockColor } from '@/models/level'
import SelectableBox from './SelectableBox.vue'
import { color as colorConvert } from '@/service/convertors'
import { ref, useTemplateRef, watch } from 'vue'
import type { HsbColor } from '@/models/color'
import { ColorPicker, Popover, type PopoverMethods } from 'primevue'

const blockColorModel = defineModel<BlockColor>({ default: 'root' })

const hsbColorBuffer = ref<HsbColor>(colorConvert.blockToHsb(blockColorModel.value))

const confirmColor = () => {
  blockColorModel.value = colorConvert.hsbToBlock(hsbColorBuffer.value)
}

watch(
  blockColorModel,
  (newVal) => {
    hsbColorBuffer.value = colorConvert.blockToHsb(newVal)
  },
  { immediate: true },
)

const colorPickerPopoverRef = useTemplateRef<PopoverMethods>('color-picker-popover')
</script>
