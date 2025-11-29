<template>
  <InfoCard title="Box Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="Color">
        <BlockColorPicker
          :modelValue="object.color"
          @update:modelValue="(color) => update({ color })"
        />
      </InfoLine>

      <Badge :value="`ID: ${props.object.objId}`" class="self-end" severity="secondary" />
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelBox } from '@/models/level'
import { InfoCard, InfoLine } from '@/components/templates'
import { Badge } from 'primevue'
import { BlockColorPicker } from '@/components/inputs'
import useEditLevelObject from '@/composites/useEditLevelObject'

const props = defineProps<{ object: LevelBox }>()

const { update } = useEditLevelObject(props.object)
</script>
