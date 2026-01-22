<template>
  <div class="pt-4">
    <h2 class="text-sm font-bold text-gray-700 mb-2">📊 データ種類</h2>
    <select 
      v-model="selectedType"
      @change="handleChange"
      class="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="temp">🌡️ 気温</option>
      <option value="precipitation1h">☔ 降水量（1時間）</option>
      <option value="wind">🍃 風速</option>
      <option value="snow">⛄️ 積雪深</option>
      <option value="humidity">💧 湿度</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useAmedasStore } from '~/stores/amedas'
import type { DataType } from '~/types'

const store = useAmedasStore()
const selectedType = ref<DataType>(store.currentDataType)

watch(() => store.currentDataType, (newType) => {
  selectedType.value = newType
})

const handleChange = () => {
  store.setDataType(selectedType.value)
  store.loadData()
}
</script>
