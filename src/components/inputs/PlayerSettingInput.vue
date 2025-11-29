<template>
  <div class="flex flex-col gap-2">
    <OptionButtonList>
      <OptionButton
        :selected="model.type === 'notPlayer'"
        hint="Box"
        @click="() => update('notPlayer')"
      >
        <HollowBox class="aspect-square h-full" />
      </OptionButton>
      <OptionButton
        :selected="model.type === 'possessable'"
        hint="Possessable"
        @click="() => update('possessable')"
      >
        <HollowPossessable class="aspect-square h-full" />
      </OptionButton>
      <OptionButton
        :selected="model.type === 'player'"
        hint="Player"
        @click="() => update('player')"
      >
        <HollowPlayer class="aspect-square h-full" />
      </OptionButton>
    </OptionButtonList>
    <div v-if="model.type === 'player'" class="flex flex-row items-center justify-center gap-1">
      Order:
      <InputNumber
        fluid
        size="small"
        :min="1"
        :modelValue="model.playerOrder"
        @update:modelValue="(playerOrder) => update(undefined, playerOrder)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PlayerSetting, PlayerSettingType } from '@/models/level'
import HollowBox from '@/assets/hollow-box.svg'
import HollowPlayer from '@/assets/hollow-player.svg'
import HollowPossessable from '@/assets/hollow-possessable.svg'
import { OptionButton, OptionButtonList } from '@/components/templates'
import { InputNumber } from 'primevue'

const model = defineModel<PlayerSetting>({ default: { type: 'notPlayer' } })

const update = (type?: PlayerSettingType, order?: number) => {
  const newVal = { ...model.value }
  if (type) newVal.type = type
  if (order !== undefined && newVal.type === 'player') newVal.playerOrder = order
  model.value = newVal
}
</script>
