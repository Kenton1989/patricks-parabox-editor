<template>
  <span
    v-tooltip.top="brushName"
    class="hover:bg-emphasis aspect-square h-full p-2"
    :class="{ 'bg-highlight': selected }"
  >
    <span class="max-h-full max-w-full overflow-hidden rounded-xs">
      <slot></slot>
    </span>
  </span>
</template>
<script setup lang="ts">
defineProps<{
  brushName?: string
  selected?: boolean
}>()
</script>
