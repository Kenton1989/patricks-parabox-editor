<template>
  <div
    @click="(e) => emit('click', e)"
    v-tooltip.top="hint"
    class="flex grow cursor-pointer justify-center p-1 transition"
    :class="{
      'hover:bg-emphasis': !selected,
      'bg-primary': selected,
      'text-primary-contrast': selected,
    }"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  selected?: boolean
  hint?: string
}>()

const emit = defineEmits<{
  click: [payload: PointerEvent]
}>()
</script>
