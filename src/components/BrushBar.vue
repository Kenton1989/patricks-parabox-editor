<template>
  <div class="brush-bar flex h-12 w-full items-center justify-start px-2 py-1">
    <p class="px-2">Brush</p>
    <BrushBox
      v-for="brush in defaultBrushes"
      :key="brush.name"
      :brushName="brush.name"
      :selected="brush.isSelected"
      @click="() => (uiStore.currentBrush = { ...brush.baseBrush })"
    >
      <component :is="brush.logoComponent" class="h-full w-full transition" />
    </BrushBox>

    <Divider layout="vertical" style="margin: 0.5rem" />

    <BrushBox
      v-for="block in levelStore.levelBlocks"
      :key="block.blockId"
      :brushName="`Ref to ${block.name}`"
      :selected="isRefBrushSelected(block.blockId)"
      @click="() => selectRefBrush(block.blockId)"
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
import WallBrushLogo from './WallBrushLogo.vue'
import { useLevelStore } from '@/stores/level'
import { Divider } from 'primevue'
import BlockCanvas from './BlockCanvas.vue'
import BrushBox from './BrushBox.vue'
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { BASE_BRUSH } from '@/models/brush'

const levelStore = useLevelStore()
const uiStore = useUiStore()

const isRefBrushSelected = (refBrushBlockId: number) =>
  uiStore.currentBrush.type === 'ref' && uiStore.currentBrush.blockId === refBrushBlockId

const selectRefBrush = (refBrushBlockId: number) => {
  uiStore.currentBrush = { type: 'ref', blockId: refBrushBlockId }
}

const defaultBrushes = computed(() => {
  const brush = uiStore.currentBrush

  return [
    {
      logoComponent: SelectSvg,
      name: 'Select',
      isSelected: brush.type === 'select',
      baseBrush: BASE_BRUSH.select,
    },
    {
      logoComponent: EraserSvg,
      name: 'Erase',
      isSelected: brush.type === 'erase',
      baseBrush: BASE_BRUSH.erase,
    },
    {
      logoComponent: WallBrushLogo,
      name: 'Wall',
      isSelected: brush.type === 'wall',
      baseBrush: BASE_BRUSH.wall,
    },
    {
      logoComponent: BoxSvg,
      name: 'Box',
      isSelected: brush.type === 'box' && !brush.player,
      baseBrush: BASE_BRUSH.box,
    },
    {
      logoComponent: PlayerSvg,
      name: 'Player',
      isSelected: brush.type === 'box' && brush.player,
      baseBrush: BASE_BRUSH.player,
    },
    {
      logoComponent: FloorSvg,
      name: 'Floor',
      isSelected: brush.type === 'floor' && !brush.playerFloor,
      baseBrush: BASE_BRUSH.floor,
    },
    {
      logoComponent: PlayerFloorSvg,
      name: 'Player Floor',
      isSelected: brush.type === 'floor' && brush.playerFloor,
      baseBrush: BASE_BRUSH.playerFloor,
    },
  ]
})
</script>
