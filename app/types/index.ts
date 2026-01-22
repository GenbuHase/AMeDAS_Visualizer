// TypeScript型定義

// データタイプ
export type DataType = 'temp' | 'precipitation1h' | 'wind' | 'snow' | 'humidity'

// 色設定
export interface ColorConfig {
  min: number
  color: string
  label: string
}

// データタイプ設定
export interface DataTypeConfig {
  name: string
  unit: string
  icon: string
  jmaElemCode: string
  colors: ColorConfig[]
  sortDesc: boolean
}

// GeoJSON Feature Properties
export interface FeatureProperties {
  code: string
  kjName?: string
  knName?: string
  nameJP?: string
  nameKana?: string
  name?: string
  // データ値
  temp?: number | [number, number]
  precipitation1h?: number | [number, number]
  wind?: number | [number, number]
  windDirection?: number | [number, number]
  humidity?: number | [number, number]
  snow?: number | [number, number]
  snowd?: number // GeoJSON (積雪深)
  val?: number
}

// GeoJSON Feature
export interface Feature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lon, lat]
  }
  properties: FeatureProperties
}

// GeoJSON FeatureCollection
export interface FeatureCollection {
  type: 'FeatureCollection'
  features: Feature[]
}

// 観測所データ
export interface Station {
  type: string
  elems: string
  lat: [number, number]
  lon: [number, number]
  alt: number
  kjName: string
  knName: string
  enName: string
  name: string
}

// 観測所リスト
export interface Stations {
  [code: string]: Station
}

// ランキングアイテム
export interface RankingItem {
  code: string
  name: string
  val: number | null
  lat: number
  lon: number
}

// 積雪深時刻データ
export interface SnowTimeData {
  basetime: string
  validtime: string
  elements: string[]
  obstimeJST?: string
}

// アメダスマップデータ
export interface AmedasMapData {
  [code: string]: {
    temp?: [number, number]
    precipitation1h?: [number, number]
    wind?: [number, number]
    windDirection?: [number, number]
    humidity?: [number, number]
    snow?: [number, number]
  }
}

// Leaflet Marker用
export interface MarkerData {
  latlng: [number, number]
  properties: FeatureProperties
}
