<template>
  <div class="page-section">
    <div class="page-section-header">
      {{ props.title }}
    </div>
    <div :class="{ 'page-section-body': true, 'no-padding': bodyNoPadding }">
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
