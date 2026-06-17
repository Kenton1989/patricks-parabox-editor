<template>
  <OptionButtonList>
    <OptionButton :hint="hintForNo" :selected="!model" @click="model = false">
      {{ $t('common.no') }}
    </OptionButton>
    <OptionButton :hint="hintForYes" :selected="model" @click="model = true">
      {{ $t('common.yes') }}
    </OptionButton>
  </OptionButtonList>
</template>
<script setup lang="ts">
import { OptionButton, OptionButtonList } from '@/components/templates'

defineProps<{
  hintForNo?: string
  hintForYes?: string
}>()
const model = defineModel<boolean>({ default: false })
</script>
