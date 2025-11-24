<template>
  <div class="info-card">
    <div class="info-card-header">
      {{ props.title }}
    </div>
    <div :class="{ 'info-card-body': true, 'no-padding': bodyNoPadding }">
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
