<template>
  <div class="flex flex-row gap-4">
    <div class="flex w-1/4 min-w-20 flex-row items-start justify-start py-1 font-bold">
      <div class="grow">
        {{ label }}
      </div>
      <div>:</div>
    </div>
    <div class="flex grow flex-row items-center justify-start gap-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>
