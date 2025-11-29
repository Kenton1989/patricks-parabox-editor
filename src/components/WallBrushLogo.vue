<template>
  <WallSvg :style="`background-color: ${focusedBlockColor}`" />
</template>
<script setup lang="ts">
import WallSvg from '@/assets/wall.svg'
import { useFocusedBlock } from '@/composites'
import { color } from '@/service/convertors'
import { computed } from 'vue'

const { focusedBlock } = useFocusedBlock()

const focusedBlockColor = computed(() =>
  focusedBlock.value ? color.blockToColor(focusedBlock.value.color).toString() : 'white',
)
</script>
