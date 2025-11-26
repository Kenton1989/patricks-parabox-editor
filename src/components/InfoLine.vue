<template>
  <div class="flex flex-row gap-4">
    <div class="flex w-1/4 min-w-20 flex-col items-end justify-center-safe font-bold">
      {{ label }} :
    </div>
    <div class="flex grow flex-col items-start justify-center-safe">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>
