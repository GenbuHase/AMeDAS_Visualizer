<template>
  <main id="map"></main>
</template>

<script setup lang="ts">
import { useAmedasStore } from '~/stores/amedas'
import type { FeatureProperties } from '~/types'
import L from 'leaflet'

const store = useAmedasStore()
const { isFavorite, toggleFavorite } = useFavorites()

// @nuxtjs/leaflet
let map: any = null
let geoJsonLayer: any = null
let currentPopupCode: string | null = null

// マップ初期化
onMounted(async () => {
  // @nuxtjs/leafletからLeafletを取得
  await nextTick()
  
  // Leaflet マップ初期化
  map = L.map('map', { zoomControl: false }).setView([38.0, 137.0], 6)
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  // 地理院地図タイル
  L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
    maxZoom: 18,
    minZoom: 5
  }).addTo(map)

  // ズームイベント
  map.on('zoomend', () => {
    if (!geoJsonLayer || !map) return
    const currentZoom = map.getZoom()
    
    geoJsonLayer.eachLayer((layer: any) => {
      if (layer instanceof L.CircleMarker && layer.feature) {
        const val = getValue(layer.feature.properties)
        layer.setRadius(calcRadius(currentZoom, val))
      }
    })
  })

  // 初回データ読み込み
  await store.loadData()
})

// データが変わったら再描画
watch([
  () => store.currentGeoData,
  () => store.currentDataType,
  () => store.isFavoriteMode
], () => {
  renderMap()
})

// 観測所プロパティから現在のモードの値を取得
const getValue = (props: FeatureProperties): number | null => {
  return store.getValue(props)
}

// ズームレベルに応じた半径計算
const calcRadius = (zoom: number, val: number | null): number => {
  if (val === null || val === undefined) val = 0
  if (val <= 0) return zoom < 7 ? 3 : 5

  let baseSize = (zoom - 4) * 1.2
  if (baseSize < 2) baseSize = 2

  let factor = 0
  if (val > 0) {
    factor = Math.sqrt(val) * 0.5
    if (store.currentDataType === 'snow' && val > 200) {
      factor += (val - 200) * 0.05
    }
  }

  return baseSize + factor
}

// マップ描画
const renderMap = () => {
  if (!map || !store.currentGeoData) return

  // 既存レイヤーを削除
  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer)
  }

  const typeConfig = store.currentTypeConfig

  geoJsonLayer = L.geoJSON(store.currentGeoData, {
    filter: (feature) => {
      const props = feature.properties
      const val = getValue(props)

      if (val === null || val === undefined) return false
      if (store.currentDataType === 'snow' && val === 32767) return false

      if (store.isFavoriteMode) {
        return isFavorite(props.code)
      }

      return true
    },

    pointToLayer: (feature, latlng) => {
      const props = feature.properties
      const val = getValue(props)

      let color = store.getColor(val)
      let opacity = 0.8
      let borderColor = '#fff'
      let weight = 1
      let radius = calcRadius(map!.getZoom(), val)

      if (!val) {
        color = '#cccccc'
        borderColor = '#666'
        opacity = 1.0
      }

      // お気に入り強調
      const isFav = isFavorite(props.code)
      if (isFav) {
        borderColor = '#ff0000'
        weight = 2
        opacity = 1.0
      }

      const marker = L.circleMarker(latlng, {
        radius,
        fillColor: color,
        color: borderColor,
        weight,
        opacity,
        fillOpacity: opacity
      })

      // ポップアップ設定
      const unit = typeConfig.unit
      const label = typeConfig.name
      const elemCode = typeConfig.jmaElemCode || 'snow'

      const nameJP = props.nameJP || props.kjName || props.name || '地点'
      const nameKana = props.nameKana || props.knName || ''
      let displayName = nameJP
      let subName = nameKana

      if (!displayName || displayName === '地点') {
        displayName = props.code || '地点'
        subName = ''
      }

      const code = props.code

      let graphLinkHtml = ''
      let favBtnHtml = ''

      if (code) {
        const jmaGraphUrl = `https://www.jma.go.jp/bosai/amedas/#amdno=${code}&format=graph&elem=${elemCode}`

        graphLinkHtml = `
          <a
            href="${jmaGraphUrl}" target="_blank" rel="noopener noreferrer"
            class="flex-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-600 text-sm font-bold py-2 px-3 rounded text-center transition no-underline flex items-center justify-center" style="color: #2563eb !important; text-decoration: none !important;">
            📊 推移グラフ
          </a>
        `

        const btnText = isFav ? '★ 解除' : '☆ お気に入り'
        const btnClass = isFav
          ? 'flex-1 bg-yellow-50 text-yellow-700 border border-yellow-300 text-sm font-bold py-2 px-3 rounded cursor-pointer hover:bg-yellow-100 transition flex items-center justify-center'
          : 'flex-1 bg-white text-gray-600 border border-gray-300 text-sm font-bold py-2 px-3 rounded cursor-pointer hover:bg-gray-50 transition flex items-center justify-center'

        favBtnHtml = `
          <button onclick="window.toggleFavorite('${code}')" class="${btnClass}">
            ${btnText}
          </button>
        `

        // お気に入り地点のTooltip
        if (isFav && val !== null) {
          const tooltipHtml = `
            <div style="background-color: ${color}; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 12px; text-shadow: 0 0 2px #000;">
              ${formatValue(val)}${unit}
            </div>
          `
          marker.bindTooltip(tooltipHtml, { permanent: true, direction: 'right', offset: [8, 0], className: 'fav-label', opacity: 1 })
        }
      }

      const popupContent = `
        <div class="font-sans min-w-[240px]">
          <div class="font-bold text-lg mb-1">${displayName}</div>
          ${subName ? `<div class="text-xs text-gray-600 mb-1">${subName}</div>` : ''}
          <hr class="my-2 border-gray-300">
          <div class="mb-3">
            <span class="text-sm text-gray-600">${label}:</span>
            <span class="font-bold text-2xl ml-1" style="color:${color}">${formatValue(val)}</span>
            <span class="text-sm ml-1">${unit}</span>
          </div>
          <div class="flex gap-2">
            ${graphLinkHtml}
            ${favBtnHtml}
          </div>
        </div>
      `

      marker.bindPopup(popupContent, { minWidth: 240 })

      // ポップアップ復元
      if (currentPopupCode && String(props.code) === String(currentPopupCode)) {
        setTimeout(() => marker.openPopup(), 100)
        currentPopupCode = null
      }

      return marker
    }
  }).addTo(map)
}

// 値のフォーマット
const formatValue = (val: number | null) => {
  if (val === null || val === undefined) return '-'
  return val.toLocaleString()
}

// 地点へ移動してポップアップを開く
const flyToPoint = (lat: number, lon: number, code: string) => {
  if (!map) return
  
  map.flyTo([lat, lon], 12, { duration: 1.5 })
  
  // ポップアップを開くために少し待つ (移動完了後)
  setTimeout(() => {
    if (geoJsonLayer) {
      geoJsonLayer.eachLayer((layer: any) => {
        const props = layer.feature?.properties || {}
        if (String(props.code) === String(code)) {
          layer.openPopup()
        }
      })
    }
  }, 1600)
}

// グローバル関数として公開（ポップアップから呼ばれる）
(window as any).toggleFavorite = (code: string) => {
  toggleFavorite(code)
  currentPopupCode = code
  renderMap()
}

(window as any).flyToPoint = (lat: number, lon: number, code: string) => {
  flyToPoint(lat, lon, code)
}
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100vw;
}
</style>
