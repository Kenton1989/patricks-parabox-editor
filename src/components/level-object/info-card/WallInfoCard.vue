<template>
  <InfoCard title="Wall Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="Player?">
        <PlayerSettingInput
          class="w-full"
          :modelValue="object.playerSetting"
          @update:modelValue="(playerSetting) => update({ playerSetting })"
        />
      </InfoLine>
      <SecondaryTags :object="object" />
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelWall } from '@/models/level'
import { InfoCard, InfoLine } from '@/components/templates'
import { PlayerSettingInput } from '@/components/inputs'
import SecondaryTags from './SecondaryTags.vue'
import useEditLevelObject from '@/composites/useEditLevelObject'

const props = defineProps<{ object: LevelWall }>()

const { update } = useEditLevelObject(props.object)
</script>
