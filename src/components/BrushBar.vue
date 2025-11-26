<template>
  <div class="brush-bar flex h-12 w-full items-center justify-start px-2 py-1">
    <p class="px-2">Brush</p>
    <BrushBox v-for="brush in defaultBrushes" :key="brush.name" :brushName="brush.name">
      <component :is="brush.logoSvg" class="h-full w-full transition" :style="brush.style" />
    </BrushBox>

    <Divider layout="vertical" style="margin: 0.5rem" />

    <BrushBox
      v-for="block in levelStore.levelBlocks"
      :key="block.blockId"
      :brushName="`Ref to ${block.name}`"
    >
      <BlockCanvas :blockId="block.blockId" class="h-full w-full rounded-xs border" />
    </BrushBox>
  </div>
</template>
<script setup lang="ts">
import BoxSvg from '@/assets/box.svg'
import EraserSvg from '@/assets/eraser.svg'
import FloorSvg from '@/assets/floor.svg'
import PlayerFloorSvg from '@/assets/player-floor.svg'
import PlayerSvg from '@/assets/player.svg'
import SelectSvg from '@/assets/select.svg'
import WallSvg from '@/assets/wall.svg'
import { useLevelStore } from '@/stores/level'
import { Divider } from 'primevue'
import { computed } from 'vue'
import BlockCanvas from './BlockCanvas.vue'
import useFocusedBlock from '@/composites/useFocusedBlock'
import { color } from '@/service/convertors'
import BrushBox from './BrushBox.vue'

const levelStore = useLevelStore()
const focusedBlock = useFocusedBlock()

const defaultBrushes = computed(() => {
  const block = focusedBlock.value

  const focusedBlockColor = block ? color.blockToColor(block.color).toString() : 'white'

  return [
    {
      logoSvg: SelectSvg,
      name: 'Select',
    },
    {
      logoSvg: EraserSvg,
      name: 'Erase',
    },
    {
      logoSvg: WallSvg,
      name: 'Wall',
      style: `background-color: ${focusedBlockColor}`,
    },
    {
      logoSvg: BoxSvg,
      name: 'Box',
    },
    {
      logoSvg: PlayerSvg,
      name: 'Player',
    },
    {
      logoSvg: FloorSvg,
      name: 'Floor',
    },
    {
      logoSvg: PlayerFloorSvg,
      name: 'Player Floor',
    },
  ]
})
</script>
