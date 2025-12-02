<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<unknown>()
const errorHappened = ref(false)

onErrorCaptured((e) => {
  error.value = e
  errorHappened.value = true
})

const resetStorage = () => {
  localStorage.clear()
  window.location.reload()
}
</script>

<template>
  <div v-if="!errorHappened" error>
    <slot></slot>
  </div>
  <div v-else>
    <slot name="error">
      <p>Error: {{ `${error}` }}</p>
      <button @click="resetStorage">Reset Storage</button>
    </slot>
  </div>
</template>
