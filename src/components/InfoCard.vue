<template>
  <div class="info-card flex flex-col rounded-sm">
    <div class="info-card-header grow-0 font-bold">
      {{ props.title }}
    </div>
    <div class="info-card-body" :class="{ 'no-padding': bodyNoPadding }">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  title?: string
  bodyNoPadding?: boolean
}>()
</script>
