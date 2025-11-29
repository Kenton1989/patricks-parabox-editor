<template>
  <span
    v-tooltip.top="hint"
    class="aspect-square h-full transition hover:cursor-pointer"
    :class="{ 'bg-highlight': selected, 'hover:bg-emphasis': !selected }"
  >
    <div class="size-full rounded-xs">
      <slot></slot>
    </div>
  </span>
</template>
<script setup lang="ts">
defineProps<{
  hint?: string
  selected?: boolean
}>()
</script>
