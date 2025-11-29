<template>
  <InfoCard title="Blocks" bodyNoPadding>
    <div class="flex h-full w-full flex-col items-stretch overflow-auto" ref="block-list-ref">
      <BlockListItem
        v-for="block in levelStore.levelBlocks"
        :key="block.blockId"
        :block="block"
        class="shrink-0 grow-0"
      />
      <Button
        icon="pi pi-plus"
        class="mx-auto my-4 shrink-0 grow-0"
        label="Create New Block"
        @click="createBlock"
      />
    </div>
  </InfoCard>
</template>
<script lang="ts" setup>
import { useLevelStore } from '@/stores/level'
import InfoCard from './InfoCard.vue'
import BlockListItem from './BlockListItem.vue'
import { Button } from 'primevue'
import { useUiStore } from '@/stores/ui'
import { useScroll } from '@vueuse/core'
import { nextTick, useTemplateRef } from 'vue'

const levelStore = useLevelStore()
const uiStore = useUiStore()

const blockListRef = useTemplateRef('block-list-ref')
const scroll = useScroll(blockListRef)

const createBlock = async () => {
  const newBlockId = levelStore.createBlock()
  uiStore.focusedBlockId = newBlockId
  await nextTick()
  scroll.y.value += 100
}
</script>
