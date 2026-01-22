<template>
  <div class="h-screen w-screen overflow-hidden">
    <PanelInfoPanel />
    <MapLeafletMap />
  </div>
</template>

<script setup lang="ts">
// CSS インポート
import '~/assets/css/main.css'

// アプリケーションのルートコンポーネント
// お気に入りデータを初期化
const { loadFavorites } = useFavorites()
loadFavorites()
</script>
