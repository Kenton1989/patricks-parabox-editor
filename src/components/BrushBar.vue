<template>
  <div class="brush-bar flex h-12 w-full max-w-full items-center justify-start px-2 py-1">
    <p class="px-2">Brush</p>
    <SelectableBox
      v-for="brush in defaultBrushes"
      :key="brush.name"
      :hint="brush.name"
      :selected="brush.isSelected"
      @click="() => brush.isSelected || (uiStore.currentBrush = { ...brush.baseBrush })"
      class="p-2"
    >
      <component :is="brush.logoComponent" class="h-full w-full transition" />
    </SelectableBox>

    <Divider layout="vertical" style="margin: 0.5rem" />

    <div class="flex h-full grow items-center justify-start wrap-normal">
      <SelectableBox
        v-for="block in levelStore.levelBlocks"
        :key="block.blockId"
        :hint="`Ref to ${block.name}`"
        :selected="isRefBrushSelected(block.blockId)"
        @click="() => selectRefBrush(block.blockId)"
        class="p-2"
      >
        <BlockCanvas :blockId="block.blockId" class="h-full w-full rounded-xs border" />
      </SelectableBox>
    </div>

    <Divider layout="vertical" style="margin: 0.5rem" v-if="brushHasColor" />

    <BlockColorPicker v-if="brushHasColor" v-model="brushColor" class="pl-2" />
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
import { SelectableBox } from '@/components/templates'
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { BASE_BRUSH, createRefBrush } from '@/models/brush'
import { BlockColorPicker } from '@/components/inputs'

const levelStore = useLevelStore()
const uiStore = useUiStore()

const isRefBrushSelected = (refBrushBlockId: number) =>
  uiStore.currentBrush.type === 'Ref' && uiStore.currentBrush.referToBlockId === refBrushBlockId

const selectRefBrush = (refBrushBlockId: number) => {
  uiStore.currentBrush = createRefBrush(refBrushBlockId)
}

const brushHasColor = computed(() => !!uiStore.currentBrush.color)

const brushColor = computed({
  get() {
    return uiStore.currentBrush.color ?? 'root'
  },
  set(value) {
    if (!value || !uiStore.currentBrush.color) return
    uiStore.currentBrush.color = value
  },
})

const defaultBrushes = computed(() => {
  const brush = uiStore.currentBrush

  return [
    {
      logoComponent: SelectSvg,
      name: 'Select',
      isSelected: brush.type === 'Select',
      baseBrush: BASE_BRUSH.select,
    },
    {
      logoComponent: EraserSvg,
      name: 'Erase',
      isSelected: brush.type === 'Erase',
      baseBrush: BASE_BRUSH.erase,
    },
    {
      logoComponent: WallBrushLogo,
      name: 'Wall',
      isSelected: brush.type === 'Wall',
      baseBrush: BASE_BRUSH.wall,
    },
    {
      logoComponent: BoxSvg,
      name: 'Box',
      isSelected: brush.type === 'Box' && brush.playerSetting.type === 'notPlayer',
      baseBrush: BASE_BRUSH.box,
    },
    {
      logoComponent: PlayerSvg,
      name: 'Player',
      isSelected: brush.type === 'Box' && brush.playerSetting.type !== 'notPlayer',
      baseBrush: BASE_BRUSH.player,
    },
    {
      logoComponent: FloorSvg,
      name: 'Floor',
      isSelected: brush.type === 'Floor' && brush.floorType === 'Button',
      baseBrush: BASE_BRUSH.floor,
    },
    {
      logoComponent: PlayerFloorSvg,
      name: 'Player Floor',
      isSelected: brush.type === 'Floor' && brush.floorType === 'PlayerButton',
      baseBrush: BASE_BRUSH.playerFloor,
    },
  ]
})
</script>
