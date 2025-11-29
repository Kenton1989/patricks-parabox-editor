<template>
  <InfoCard title="Ref Info">
    <div class="flex flex-col gap-2">
      <InfoLine label="Link to">
        <div
          class="flex w-full flex-row items-center justify-start gap-2 rounded-sm"
          :class="{
            'hover:bg-emphasis': !isRecursive,
            'cursor-pointer': !isRecursive,
          }"
          @click="handleRefClicked"
        >
          <BlockCanvas :blockId="object.referToBlockId" class="size-8 rounded-sm" />
          <p>{{ block?.name }}</p>
        </div>
      </InfoLine>
      <InfoLine label="Clone?">
        <OptionButtonList>
          <OptionButton
            :hint="object.exitBlock ? undefined : 'will set other ref to clone'"
            :selected="object.exitBlock"
            @click="() => levelStore.setExitRef(object.objId)"
          >
            No
          </OptionButton>
          <OptionButton :selected="!object.exitBlock" @click="() => update({ exitBlock: false })">
            Yes
          </OptionButton>
        </OptionButtonList>
      </InfoLine>
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
import type { LevelRef } from '@/models/level'
import { InfoCard, InfoLine, OptionButton, OptionButtonList } from '@/components/templates'
import { PlayerSettingInput } from '@/components/inputs'
import useEditLevelObject from '@/composites/useEditLevelObject'
import BlockCanvas from '@/components/BlockCanvas.vue'
import { useBlock } from '@/composites'
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import SecondaryTags from './SecondaryTags.vue'
import { useLevelStore } from '@/stores/level'

const props = defineProps<{ object: LevelRef }>()
const uiStore = useUiStore()

const isRecursive = computed(() => props.object.parentId === props.object.referToBlockId)
const handleRefClicked = () => {
  if (!isRecursive.value) uiStore.focusedBlockId = props.object.referToBlockId
}

const { block } = useBlock(
  computed(() => props.object.referToBlockId),
  true,
)

const levelStore = useLevelStore()

// exitBlock: boolean
// infSetting: InfSetting
// playerSetting: PlayerSetting
// flipH: boolean
// floatInSpace: boolean
const { update } = useEditLevelObject(props.object)
</script>
