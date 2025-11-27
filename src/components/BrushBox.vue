<template>
  <span
    v-tooltip.top="brushName"
    class="aspect-square h-full p-2"
    :class="{ 'bg-highlight': selected, 'hover:bg-emphasis': !selected }"
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
