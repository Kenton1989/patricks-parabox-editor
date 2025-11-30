<template>
  <div class="flex flex-col gap-2">
    <OptionButtonList>
      <OptionButton :selected="model.type === 'noInf'" @click="() => update('noInf')">
        No
      </OptionButton>
      <OptionButton
        hint="infinity"
        :selected="model.type === 'infExit'"
        @click="() => update('infExit')"
      >
        ∞
      </OptionButton>
      <OptionButton
        hint="epsilon"
        :selected="model.type === 'infEnter'"
        @click="() => update('infEnter')"
      >
        ε
      </OptionButton>
    </OptionButtonList>
    <div v-if="model.type !== 'noInf'" class="flex flex-row items-center justify-center gap-1">
      Level:
      <InputNumber
        fluid
        size="small"
        :min="1"
        :modelValue="model.level"
        showButtons
        @update:modelValue="(level) => update(undefined, level)"
      />
    </div>
    <p v-if="model.type === 'infEnter'">ε enter from:</p>
    <div v-if="model.type === 'infEnter'" class="flex flex-row items-center justify-center gap-1">
      <InputNumber
        fluid
        size="small"
        :modelValue="model.enterFromBlockId"
        @update:modelValue="(enterFromBlockId) => update(undefined, undefined, enterFromBlockId)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { NO_INF, type InfSetting, type InfType } from '@/models/level'
import OptionButton from '@/components/templates/OptionButton.vue'
import OptionButtonList from '@/components/templates/OptionButtonList.vue'
import { InputNumber } from 'primevue'

const model = defineModel<InfSetting>({ default: NO_INF })

const update = (type?: InfType, level?: number, infEnterFrom?: number) => {
  const newVal = { ...model.value }

  if (type) newVal.type = type

  if (newVal.type !== 'noInf') {
    newVal.level = level ?? newVal.level ?? 1
  }

  if (newVal.type === 'infEnter') {
    newVal.enterFromBlockId = infEnterFrom ?? newVal.enterFromBlockId ?? 0
  }

  model.value = newVal
}
</script>
