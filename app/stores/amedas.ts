import { defineStore } from 'pinia'
import type { FeatureCollection, Stations, DataType, Feature, RankingItem, FeatureProperties } from '~/types'

export const useAmedasStore = defineStore('amedas', {
  state: () => ({
    currentDataType: 'temp' as DataType,
    isFavoriteMode: false,
    currentGeoData: null as FeatureCollection | null,
    amedasStations: null as Stations | null,
    observationTime: null as string | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    // 現在のデータ型設定を取得
    currentTypeConfig(state) {
      const { DATA_TYPES } = useDataTypes()
      return DATA_TYPES[state.currentDataType]
    },

    // フィルタリングされたFeatures
    filteredFeatures(state): Feature[] {
      if (!state.currentGeoData) return []
      
      const { isFavorite } = useFavorites()
      
      return state.currentGeoData.features.filter(feature => {
        const props = feature.properties
        const val = this.getValue(props)
        
        // 値がない、または無効な値は除外
        if (val === null || val === undefined) return false
        
        // 積雪深の欠測値除外
        if (state.currentDataType === 'snow' && val === 32767) return false
        
        // お気に入りモードの場合
        if (state.isFavoriteMode) {
          return isFavorite(props.code)
        }
        
        return true
      })
    },

    // ランキングデータ
    rankingItems(state): RankingItem[] {
      if (!state.currentGeoData) return []
      
      const { isFavorite } = useFavorites()
      const typeConfig = this.currentTypeConfig
      
      let items: RankingItem[] = state.currentGeoData.features
        .map(f => {
          const props = f.properties
          const val = this.getValue(props)
          const nameJP = props.nameJP || props.kjName || props.name || '地点'
          const code = String(props.code)
          
          return {
            code,
            name: nameJP,
            val,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0]
          }
        })
        .filter(item => {
          if (item.val === null || item.val === undefined) return false
          if (state.currentDataType === 'snow' && item.val === 32767) return false
          return true
        })
      
      // 並び替え
      items.sort((a, b) => {
        if (typeConfig.sortDesc) return (b.val || 0) - (a.val || 0)
        return (a.val || 0) - (b.val || 0)
      })
      
      // お気に入りモードかランキングモードか
      if (state.isFavoriteMode) {
        return items.filter(item => isFavorite(item.code))
      } else {
        return items.slice(0, 10)
      }
    }
  },

  actions: {
    // 観測所プロパティから現在のモードの値を取得
    getValue(props: FeatureProperties): number | null {
      let val: any = null
      
      // 積雪深モード
      if (this.currentDataType === 'snow') {
        if (props.snowd !== undefined) val = props.snowd
        else if (props.snow !== undefined) val = props.snow
        else if (props.val !== undefined) val = props.val
      } else {
        val = props[this.currentDataType]
      }
      
      if (val === undefined || val === null) return null
      
      // 配列の場合は[値, フラグ]
      if (Array.isArray(val)) {
        val = val[0]
      }
      
      const num = parseFloat(val)
      return isNaN(num) ? null : num
    },

    // 色を取得
    getColor(val: number | null): string {
      const typeConfig = this.currentTypeConfig
      if (val === null || val === undefined) return '#ccc'
      
      const config = typeConfig.colors.find(c => val >= c.min)
      return config ? config.color : '#ccc'
    },

    // データ種類を変更
    setDataType(type: DataType) {
      this.currentDataType = type
    },

    // モード切り替え
    toggleMode() {
      this.isFavoriteMode = !this.isFavoriteMode
    },

    setMode(isFavorite: boolean) {
      this.isFavoriteMode = isFavorite
    },

    // データ読み込み
    async loadData() {
      this.isLoading = true
      this.error = null
      
      try {
        const {
          fetchStations,
          getLatestAmedasTime,
          fetchAmedasMapData,
          getLatestSnowTimeData,
          fetchSnowGeoJSON,
          formatUtcToJst
        } = useAmedasData()
        
        // 観測所データ取得
        if (!this.amedasStations) {
          this.amedasStations = await fetchStations()
        }
        
        if (this.currentDataType === 'snow') {
          // 積雪深: GeoJSON APIを使用
          const timeData = await getLatestSnowTimeData()
          const geoJson = await fetchSnowGeoJSON(timeData)
          this.currentGeoData = geoJson
          
          // 時刻表示
          this.observationTime = timeData.obstimeJST || formatUtcToJst(timeData.validtime)
        } else {
          // その他: JSON APIを使用
          const latestTime = await getLatestAmedasTime()
          
          // 時刻表示
          const pad = (n: number) => n.toString().padStart(2, '0')
          this.observationTime = `${latestTime.getFullYear()}/${pad(latestTime.getMonth()+1)}/${pad(latestTime.getDate())} ${pad(latestTime.getHours())}:${pad(latestTime.getMinutes())}`
          
          // データ取得
          const mapData = await fetchAmedasMapData(latestTime)
          
          // GeoJSONに変換
          const features: Feature[] = []
          
          Object.keys(mapData).forEach(code => {
            const station = this.amedasStations![code]
            const data = mapData[code]
            
            if (station && data) {
              const lat = station.lat[0] + station.lat[1] / 60
              const lon = station.lon[0] + station.lon[1] / 60
              
              const props: FeatureProperties = {
                code,
                kjName: station.kjName,
                knName: station.knName,
                temp: data.temp ? data.temp[0] : undefined,
                precipitation1h: data.precipitation1h ? data.precipitation1h[0] : undefined,
                wind: data.wind ? data.wind[0] : undefined,
                windDirection: data.windDirection ? data.windDirection[0] : undefined,
                humidity: data.humidity ? data.humidity[0] : undefined,
                snow: data.snow ? data.snow[0] : undefined
              }
              
              features.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [lon, lat]
                },
                properties: props
              })
            }
          })
          
          this.currentGeoData = {
            type: 'FeatureCollection',
            features
          }
        }
      } catch (e: any) {
        console.error('データ取得エラー:', e)
        this.error = e.message || 'データの取得に失敗しました'
      } finally {
        this.isLoading = false
      }
    }
  }
})
