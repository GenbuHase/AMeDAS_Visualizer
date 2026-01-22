import type { DataTypeConfig } from '~/types'

// データ型設定の定義
export const useDataTypes = () => {
  const DATA_TYPES: Record<string, DataTypeConfig> = {
    temp: {
      name: '気温',
      unit: '℃',
      icon: '🌡️',
      jmaElemCode: 'temp',
      colors: [
        { min: 35, color: '#960018', label: '35℃ ～' },
        { min: 30, color: '#ff2800', label: '30℃ ～' },
        { min: 25, color: '#ff9900', label: '25℃ ～' },
        { min: 20, color: '#f2f200', label: '20℃ ～' },
        { min: 15, color: '#00ff00', label: '15℃ ～' },
        { min: 10, color: '#00cfff', label: '10℃ ～' },
        { min: 5, color: '#0041ff', label: '5℃ ～' },
        { min: 0, color: '#218cff', label: '0℃ ～' },
        { min: -100, color: '#a0d2ff', label: '0℃ 未満' }
      ],
      sortDesc: true
    },

    precipitation1h: {
      name: '降水量（1時間）',
      unit: 'mm',
      icon: '🌧️',
      jmaElemCode: 'precipitation1h',
      colors: [
        { min: 80, color: '#b40068', label: '80mm ～' },
        { min: 50, color: '#ff2800', label: '50mm ～' },
        { min: 30, color: '#ff9900', label: '30mm ～' },
        { min: 20, color: '#f2f200', label: '20mm ～' },
        { min: 10, color: '#218cff', label: '10mm ～' },
        { min: 5, color: '#0041ff', label: '5mm ～' },
        { min: 1, color: '#a0d2ff', label: '1mm ～' },
        { min: 0, color: '#cccccc', label: '0mm' }
      ],
      sortDesc: true
    },

    wind: {
      name: '風速',
      unit: 'm/s',
      icon: '💨',
      jmaElemCode: 'wind',
      colors: [
        { min: 25, color: '#ff0000', label: '25m/s ～' },
        { min: 20, color: '#ff5500', label: '20m/s ～' },
        { min: 15, color: '#ff9900', label: '15m/s ～' },
        { min: 10, color: '#f2f200', label: '10m/s ～' },
        { min: 5, color: '#00cf00', label: '5m/s ～' },
        { min: 3, color: '#00ff7f', label: '3m/s ～' },
        { min: 0, color: '#cccccc', label: '0m/s ～' }
      ],
      sortDesc: true
    },

    snow: {
      name: '積雪深',
      unit: 'cm',
      icon: '⛄',
      jmaElemCode: 'snow',
      colors: [
        { min: 200, color: '#e600ab', label: '200cm ～' },
        { min: 150, color: '#ff2800', label: '150cm ～' },
        { min: 100, color: '#ff9900', label: '100cm ～' },
        { min: 50, color: '#f2f200', label: '50cm ～' },
        { min: 20, color: '#0041ff', label: '20cm ～' },
        { min: 5, color: '#218cff', label: '5cm ～' },
        { min: 1, color: '#a0d2ff', label: '1cm ～' },
        { min: 0, color: '#cccccc', label: '0cm' }
      ],
      sortDesc: true
    },

    humidity: {
      name: '湿度',
      unit: '%',
      icon: '💧',
      jmaElemCode: 'humidity',
      colors: [
        { min: 90, color: '#0041ff', label: '90% ～' },
        { min: 70, color: '#00cfff', label: '70% ～' },
        { min: 50, color: '#00ff00', label: '50% ～' },
        { min: 30, color: '#f2f200', label: '30% ～' },
        { min: 0, color: '#ff9900', label: '0% ～' }
      ],
      sortDesc: true
    }
  }

  return {
    DATA_TYPES
  }
}
