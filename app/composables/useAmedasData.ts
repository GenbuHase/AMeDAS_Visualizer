import type { Stations, FeatureCollection, AmedasMapData, SnowTimeData } from '~/types'

// AMeDASデータ取得のComposable
export const useAmedasData = () => {
  const PROXY_URL = 'https://corsproxy.io/?'
  const JMA_TILE_BASE = 'https://www.jma.go.jp/bosai/jmatile/data/snow'
  
  // URLパラメータからテストモード判定
  const route = useRoute()
  const TEST_MODE = route.query.test === 'true'

  // プロキシ経由でデータ取得
  const fetchWithProxy = async (url: string) => {
    if (TEST_MODE) {
      console.log(`[Test Mode] Fetching: ${url}`)
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    }

    try {
      const targetUrl = PROXY_URL + encodeURIComponent(url)
      const response = await fetch(targetUrl)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (e) {
      console.error('Fetch failed (Proxy):', e)
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        return await response.json()
      } catch (e2) {
        throw new Error(`データ取得エラー: ${e.message}`)
      }
    }
  }

  // 観測所データ取得
  const fetchStations = async (): Promise<Stations> => {
    const url = TEST_MODE 
      ? '/test_data/amedastable.json'
      : 'https://www.jma.go.jp/bosai/amedas/const/amedastable.json'
      
    return await fetchWithProxy(url)
  }

  // 最新時刻取得 (その他のデータ用)
  const getLatestAmedasTime = async (): Promise<Date> => {
    const url = TEST_MODE
      ? '/test_data/latest_time.txt'
      : 'https://www.jma.go.jp/bosai/amedas/data/latest_time.txt'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const text = await response.text()
    return new Date(text.trim())
  }

  // 全国マップデータ取得 (JSON形式)
  const fetchAmedasMapData = async (dateObj: Date): Promise<AmedasMapData> => {
    if (TEST_MODE) {
      return (await fetch('/test_data/map_data.json')).json()
    }

    const pad = (n: number) => n.toString().padStart(2, '0')
    const yyyy = dateObj.getFullYear()
    const mm = pad(dateObj.getMonth() + 1)
    const dd = pad(dateObj.getDate())
    const hh = pad(dateObj.getHours())
    const mi = pad(Math.floor(dateObj.getMinutes() / 10) * 10)
    const ss = '00'
    
    const timeStr = `${yyyy}${mm}${dd}${hh}${mi}${ss}`
    const url = `https://www.jma.go.jp/bosai/amedas/data/map/${timeStr}.json`
    
    return await fetchWithProxy(url)
  }

  // 積雪深の最新時刻データ取得
  const getLatestSnowTimeData = async (): Promise<SnowTimeData> => {
    const url = TEST_MODE
      ? '/test_data/targetTimes.json'
      : `${JMA_TILE_BASE}/targetTimes.json`
    
    const data = await (await fetch(url)).json()
    if (!Array.isArray(data)) throw new Error('targetTimes is not an array')

    const latestValid = data.find((item: SnowTimeData) =>
      item.elements && item.elements.includes('amds_snowd')
    )

    if (latestValid) return latestValid
    throw new Error('Valid snow data (amds_snowd) not found in targetTimes')
  }

  // GeoJSONデータ取得 (積雪深用)
  const fetchSnowGeoJSON = async (timeData: SnowTimeData): Promise<FeatureCollection> => {
    const { basetime, validtime } = timeData
    let url = `${JMA_TILE_BASE}/${basetime}/none/${validtime}/surf/amds_snowd/data.geojson`
    
    if (TEST_MODE) {
      url = '/test_data/snow_data.geojson'
    }
    
    return await fetchWithProxy(url)
  }

  // UTC文字列をJST文字列に変換
  const formatUtcToJst = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 12) return '--/-- --:--'
    
    const year = parseInt(dateStr.substring(0, 4), 10)
    const month = parseInt(dateStr.substring(4, 6), 10) - 1
    const day = parseInt(dateStr.substring(6, 8), 10)
    const hour = parseInt(dateStr.substring(8, 10), 10)
    const min = parseInt(dateStr.substring(10, 12), 10)

    const utcDate = new Date(Date.UTC(year, month, day, hour, min))
    const JST_OFFSET = 9 * 60 * 60 * 1000
    const jstDate = new Date(utcDate.getTime() + JST_OFFSET)

    const y = jstDate.getUTCFullYear()
    const m = String(jstDate.getUTCMonth() + 1).padStart(2, '0')
    const d = String(jstDate.getUTCDate()).padStart(2, '0')
    const h = String(jstDate.getUTCHours()).padStart(2, '0')
    const mi = String(jstDate.getUTCMinutes()).padStart(2, '0')

    return `${y}/${m}/${d} ${h}:${mi}`
  }

  return {
    fetchWithProxy,
    fetchStations,
    getLatestAmedasTime,
    fetchAmedasMapData,
    getLatestSnowTimeData,
    fetchSnowGeoJSON,
    formatUtcToJst
  }
}
