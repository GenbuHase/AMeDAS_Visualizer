<template>
  <div class="border-t pt-4">
    <h2 class="text-sm font-bold text-gray-700 mb-2">凡例</h2>
    
    <div class="grid grid-cols-2 gap-2">
      <div 
        v-for="item in typeConfig.colors"
        :key="item.label"
        class="legend-item"
      >
        <div 
          class="legend-color"
          :style="{ 
            background: item.color,
            border: (item.min === 0 || item.label.includes('0mm')) ? '1px solid #999' : '1px solid rgba(0,0,0,0.2)'
          }"
        ></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAmedasStore } from '~/stores/amedas'

const store = useAmedasStore()
const typeConfig = computed(() => store.currentTypeConfig)
</script>
