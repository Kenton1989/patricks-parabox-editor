<template>
  <div class="flex flex-col gap-2">
    <OptionButtonList>
      <OptionButton
        :selected="model.type === 'notPlayer'"
        :hint="t('playerSetting.notPlayer')"
        @click="() => update('notPlayer')"
      >
        <HollowBox class="aspect-square h-full" />
      </OptionButton>
      <OptionButton
        :selected="model.type === 'possessable'"
        :hint="t('playerSetting.possessable')"
        @click="() => update('possessable')"
      >
        <HollowPossessable class="aspect-square h-full" />
      </OptionButton>
      <OptionButton
        :selected="model.type === 'player'"
        :hint="t('playerSetting.player')"
        @click="() => update('player')"
      >
        <HollowPlayer class="aspect-square h-full" />
      </OptionButton>
    </OptionButtonList>
    <div v-if="model.type === 'player'" class="flex flex-row items-center justify-center gap-1">
      <span class="min-w-12">
        {{ t('playerSetting.order') }}
      </span>
      <InputNumber
        fluid
        size="small"
        :min="0"
        :modelValue="playerOrderBuffer"
        @update:modelValue="(playerOrder) => update(undefined, playerOrder)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ActivePlayerSetting, PlayerSetting, PlayerSettingType } from '@/models/level'
import HollowBox from '@/assets/hollow-box.svg'
import HollowPlayer from '@/assets/hollow-player.svg'
import HollowPossessable from '@/assets/hollow-possessable.svg'
import { OptionButton, OptionButtonList } from '@/components/templates'
import { InputNumber } from 'primevue'
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const model = defineModel<PlayerSetting>({ default: { type: 'notPlayer' } })
const { t } = useI18n()

const getPlayerOrder = () => (model.value as ActivePlayerSetting).playerOrder as number | undefined

const playerOrderBuffer = ref(getPlayerOrder())

const update = async (type?: PlayerSettingType, order?: number) => {
  const newVal = { ...model.value }
  if (type) newVal.type = type
  if (order !== undefined && newVal.type === 'player') {
    newVal.playerOrder = order
    playerOrderBuffer.value = order
  }
  model.value = newVal
  await nextTick()
  playerOrderBuffer.value = getPlayerOrder()
}
</script>
