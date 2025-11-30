<template>
  <InfoCard title="Floor Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="Type">
        <OptionButtonList>
          <OptionButton
            :selected="object.floorType === 'Button'"
            hint="target of blocks"
            @click="() => update({ floorType: 'Button' })"
          >
            <HollowBox class="aspect-square h-full" />
          </OptionButton>
          <OptionButton
            :selected="object.floorType === 'PlayerButton'"
            hint="target of player"
            @click="() => update({ floorType: 'PlayerButton' })"
          >
            <HollowPlayer class="aspect-square h-full" />
          </OptionButton>
        </OptionButtonList>
      </InfoLine>
      <SecondaryTags :object="object" />
    </div>
  </InfoCard>
</template>
<script setup lang="ts">
import type { LevelFloor } from '@/models/level'
import { InfoCard, OptionButton, OptionButtonList } from '@/components/templates'
import InfoLine from '@/components/templates/InfoLine.vue'
import SecondaryTags from './SecondaryTags.vue'
import HollowBox from '@/assets/hollow-box.svg'
import HollowPlayer from '@/assets/hollow-player.svg'
import useEditLevelObject from '@/composites/useEditLevelObject'

const props = defineProps<{ object: LevelFloor }>()

const { update } = useEditLevelObject(props.object)
</script>
