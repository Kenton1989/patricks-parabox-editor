<template>
  <div class="brush-bar flex h-12 w-full items-center justify-start gap-4 px-4 py-3">
    <span
      v-for="brush in defaultBrushes"
      :key="brush.name"
      v-tooltip.top="brush.name"
      class="aspect-square h-full"
      :style="brush.style"
    >
      <component :is="brush.logoSvg" class="h-full" />
    </span>

    <Divider layout="vertical" style="margin: 0" />
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
import { Divider } from 'primevue'
import type { StyleValue } from 'vue'

const defaultBrushes: {
  logoSvg: string
  name: string
  style?: StyleValue
}[] = [
  {
    logoSvg: SelectSvg,
    name: 'Select',
  },
  {
    logoSvg: EraserSvg,
    name: 'Eraser',
  },
  {
    logoSvg: WallSvg,
    name: 'Wall',
    style: 'background-color: lightblue',
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
</script>
