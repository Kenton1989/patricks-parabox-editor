<template>
  <div class="page-section">
    <div class="page-section-header">
      {{ props.sectionTitle }}
    </div>
    <div class="page-section-body">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  sectionTitle: string
}>()
</script>
