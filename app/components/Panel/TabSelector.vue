<template>
  <div class="flex border-b border-gray-200">
    <div 
      class="flex-1 py-2 text-sm font-bold text-center cursor-pointer transition-colors border-b-2"
      :class="store.isFavoriteMode ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50' : 'border-blue-600 text-blue-600'"
      @click="switchMode(false)"
    >
      📌 すべての地点
    </div>
    <div 
      class="flex-1 py-2 text-sm font-bold text-center cursor-pointer transition-colors border-b-2"
      :class="store.isFavoriteMode ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
      @click="switchMode(true)"
    >
      ⭐️ お気に入り
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAmedasStore } from '~/stores/amedas'

const store = useAmedasStore()

const switchMode = (toFavorite: boolean) => {
  store.setMode(toFavorite)
}
</script>
