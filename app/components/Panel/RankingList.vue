<template>
  <div class="pt-4 pb-4">
    <h3 class="text-sm font-bold text-gray-700 mb-2">{{ title }}</h3>
    
    <div v-if="items.length === 0" class="text-sm text-gray-500 text-center py-2 bg-gray-50 rounded">
      {{ store.isFavoriteMode ? '登録がありません' : 'データなし' }}
    </div>
    
    <ul v-else class="text-sm space-y-1 max-h-60 overflow-y-auto pr-1">
      <li 
        v-for="(item, index) in items" 
        :key="item.code"
        class="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
        @click="flyToPoint(item)"
      >
        <div class="truncate flex-1 flex items-center">
          <span class="inline-block w-5 text-center font-bold text-gray-500 mr-1">{{ index + 1 }}.</span>
          <span class="font-medium text-gray-800 truncate">{{ item.name }}</span>
        </div>
        <div class="font-bold whitespace-nowrap ml-2" :style="{ color: store.getColor(item.val) }">
          {{ formatValue(item.val) }} <span class="text-xs text-black">{{ typeConfig.unit }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAmedasStore } from '~/stores/amedas'
import type { RankingItem } from '~/types'

const store = useAmedasStore()

const title = computed(() => {
  const typeConfig = store.currentTypeConfig
  return store.isFavoriteMode ? '⭐️ お気に入り地点' : `🏆️ ${typeConfig.name}ランキング`
})

const items = computed(() => store.rankingItems)
const typeConfig = computed(() => store.currentTypeConfig)

const formatValue = (val: number | null) => {
  if (val === null || val === undefined) return '-'
  return val.toLocaleString()
}

const emit = defineEmits<{
  flyTo: [item: RankingItem]
}>()

const flyToPoint = (item: RankingItem) => {
  emit('flyTo', item)
}
</script>
