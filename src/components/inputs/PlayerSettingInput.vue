<template>
  <div class="flex flex-col gap-2">
    <OptionButtonList>
      <OptionButton
        :selected="model.type === 'notPlayer'"
        hint="Box"
        @click="model.type = 'notPlayer'"
      >
        <HollowBox class="aspect-square h-full" />
      </OptionButton>
      <OptionButton
        :selected="model.type === 'possessable'"
        hint="Possessable"
        @click="model.type = 'possessable'"
      >
        <HollowPossessable class="aspect-square h-full" />
      </OptionButton>
      <OptionButton
        :selected="model.type === 'player'"
        hint="Player"
        @click="model.type = 'player'"
      >
        <HollowPlayer class="aspect-square h-full" />
      </OptionButton>
    </OptionButtonList>
    <div v-if="model.type === 'player'" class="flex flex-row items-center justify-center gap-1">
      Order: <InputNumber fluid size="small" :min="1" v-model="model.playerOrder" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PlayerSetting } from '@/models/level'
import HollowBox from '@/assets/hollow-box.svg'
import HollowPlayer from '@/assets/hollow-player.svg'
import HollowPossessable from '@/assets/hollow-possessable.svg'
import { OptionButton } from '@/components/templates'
import OptionButtonList from '../templates/OptionButtonList.vue'
import { InputNumber } from 'primevue'

const model = defineModel<PlayerSetting>({ default: { type: 'notPlayer' } })
</script>
