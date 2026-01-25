<template>
  <div>
    <!-- 情報パネル -->
    <aside id="info-panel"
      class="absolute top-4 left-4 right-4 md:right-auto md:w-96 info-panel rounded-lg shadow-xl overflow-hidden transition-all duration-300 flex flex-col max-h-[calc(100dvh-2rem)]">
      <!-- ヘッダー -->
      <header
        class="panel-header p-4 flex justify-between items-center cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors flex-none"
        @click="togglePanel">
        <h1 class="text-xl font-bold text-gray-800 m-0">🗾 アメダスマップ</h1>
        <button class="text-gray-500 hover:text-gray-700 font-bold transform transition-transform duration-300 p-1"
          :class="{ 'rotate-[-90deg]': !isPanelOpen }">
          ▼
        </button>
      </header>

      <!-- パネルコンテンツ -->
      <article v-show="isPanelOpen" class="panel-body p-4 pt-2 flex-1 overflow-y-auto overscroll-contain">
        <PanelTabSelector />

        <!-- 観測日時 -->
        <div class="pt-4">
          <h2 class="text-sm font-bold text-gray-700 mb-2">📅 観測日時</h2>
          <p class="text-lg font-mono text-gray-900">
            {{ store.observationTime || '----/--/-- --:--' }}
          </p>
        </div>

        <button @click="handleRefresh" :disabled="store.isLoading"
          class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
          {{ store.isLoading ? '読み込み中...' : 'データを更新' }}
        </button>

        <PanelDataTypeSelect />
        <PanelRankingList />
        <PanelLegend />

        <!-- フッター -->
        <div class="border-t mt-4 pt-4 text-xs text-gray-500">
          データ出典: <a href="https://www.jma.go.jp/" target="_blank" class="underline hover:text-blue-600">気象庁</a>
        </div>
      </article>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { useAmedasStore } from '~/stores/amedas'
const isMobile = useMediaQuery('(max-width: 767px)')
const store = useAmedasStore()
const isPanelOpen = ref(!isMobile.value)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const handleRefresh = () => {
  store.loadData()
}
</script>
