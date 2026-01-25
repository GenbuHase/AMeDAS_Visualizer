// TypeScript型定義

// データタイプ
export type DataType = 
  | 'temp'
  | 'wind'
  | 'precipitation10m'
  | 'precipitation1h'
  | 'precipitation3h'
  | 'precipitation24h'
  | 'snow'
  | 'snow6h'
  | 'snow12h'
  | 'snow24h'
  | 'humidity'
  | 'sun1h'

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
  wind?: number | [number, number]
  windDirection?: number | [number, number]
  precipitation10m?: number | [number, number]
  precipitation1h?: number | [number, number]
  precipitation3h?: number | [number, number]
  precipitation24h?: number | [number, number]
  snow?: number | [number, number]
  snowd?: number // GeoJSON (積雪深)
  snow1h?: number | [number, number]
  snow6h?: number | [number, number]
  snow12h?: number | [number, number]
  snow24h?: number | [number, number]
  humidity?: number | [number, number]
  sun1h?: number | [number, number]
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
    wind?: [number, number]
    windDirection?: [number, number]
    precipitation10m?: [number, number]
    precipitation1h?: [number, number]
    precipitation3h?: [number, number]
    precipitation24h?: [number, number]
    snow?: [number, number]
    snow1h?: [number, number]
    snow6h?: [number, number]
    snow12h?: [number, number]
    snow24h?: [number, number]
    humidity?: [number, number]
    sun1h?: [number, number]
  }
}

// Leaflet Marker用
export interface MarkerData {
  latlng: [number, number]
  properties: FeatureProperties
}
