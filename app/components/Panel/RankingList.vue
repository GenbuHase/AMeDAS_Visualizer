<template>
  <div class="pt-4 pb-4">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-bold text-gray-700">{{ title }}</h3>
      <button
        @click="store.toggleSortOrder()"
        class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        :title="sortButtonTitle"
      >
        <span>{{ store.isSortDescending ? '降順' : '昇順' }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-3.5 w-3.5 transition-transform" 
          :class="{ 'rotate-180': !store.isSortDescending }"
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
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

const sortButtonTitle = computed(() => {
  return store.isSortDescending 
    ? 'クリックして昇順に切り替え' 
    : 'クリックして降順に切り替え'
})

const items = computed(() => store.rankingItems)
const typeConfig = computed(() => store.currentTypeConfig)

const formatValue = (val: number | null) => {
  if (val === null || val === undefined) return '-'
  return val.toLocaleString()
}

const flyToPoint = (item: RankingItem) => {
  if ((window as any).flyToPoint) {
    (window as any).flyToPoint(item.lat, item.lon, item.code)
  }
}
</script>

