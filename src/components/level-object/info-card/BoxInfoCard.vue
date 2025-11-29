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
import InfoCard from '@/components/InfoCard.vue'
import { Badge } from 'primevue'
import InfoLine from '@/components/InfoLine.vue'
import BlockColorPicker from '@/components/BlockColorPicker.vue'
import useEditLevelObject from '@/composites/useEditLevelObject'

const props = defineProps<{ object: LevelBox }>()

const { update } = useEditLevelObject(props.object)
</script>
