<template>
  <InfoCard title="Box Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="Player?">
        <PlayerSettingInput
          class="w-full"
          :modelValue="object.playerSetting"
          @update:modelValue="(playerSetting) => update({ playerSetting })"
        />
      </InfoLine>
      <InfoLine label="Color">
        <BlockColorPicker
          :modelValue="object.color"
          @update:modelValue="(color) => update({ color })"
        />
      </InfoLine>

      <SecondaryTags :object="object" />
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelBox } from '@/models/level'
import { InfoCard, InfoLine } from '@/components/templates'
import { BlockColorPicker, PlayerSettingInput } from '@/components/inputs'
import useEditLevelObject from '@/composites/useEditLevelObject'
import SecondaryTags from './SecondaryTags.vue'

const props = defineProps<{ object: LevelBox }>()

const { update } = useEditLevelObject(props.object)
</script>
