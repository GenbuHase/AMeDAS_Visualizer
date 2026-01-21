import json
import os

# 出力ディレクトリ
OUTPUT_DIR = 'test_data'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# 色区分の定義 (index.htmlから抽出・整理)
# 各ランクの代表値を設定
TEST_CASES = [
    # 1. 最上位ランク (Extreme High)
    {
        "temp": 36.0,   # >= 35
        "precip": 85.0, # >= 80
        "wind": 30.0,   # >= 25
        "humid": 95,    # >= 90
        "snow": 250,    # >= 200
        "desc": "Rank 1 (Max)"
    },
    # 2.
    {
        "temp": 32.0,   # >= 30
        "precip": 60.0, # >= 50
        "wind": 22.0,   # >= 20
        "humid": 75,    # >= 70
        "snow": 180,    # >= 150
        "desc": "Rank 2"
    },
    # 3.
    {
        "temp": 27.0,   # >= 25
        "precip": 40.0, # >= 30
        "wind": 17.0,   # >= 15
        "humid": 55,    # >= 50
        "snow": 120,    # >= 100
        "desc": "Rank 3"
    },
    # 4.
    {
        "temp": 22.0,   # >= 20
        "precip": 25.0, # >= 20
        "wind": 12.0,   # >= 10
        "humid": 35,    # >= 30
        "snow": 80,     # >= 50
        "desc": "Rank 4"
    },
    # 5.
    {
        "temp": 17.0,   # >= 15
        "precip": 15.0, # >= 10
        "wind": 7.0,    # >= 5
        "humid": 10,    # >= 0 (Lowest for humidity)
        "snow": 30,     # >= 20
        "desc": "Rank 5"
    },
    # 6.
    {
        "temp": 12.0,   # >= 10
        "precip": 7.0,  # >= 5
        "wind": 4.0,    # >= 3
        "humid": 0,     # Fallback
        "snow": 10,     # >= 5
        "desc": "Rank 6"
    },
    # 7.
    {
        "temp": 7.0,    # >= 5
        "precip": 3.0,  # >= 1
        "wind": 1.0,    # >= 0
        "humid": 0,     # Fallback
        "snow": 3,      # >= 1
        "desc": "Rank 7"
    },
    # 8.
    {
        "temp": 2.0,    # >= 0
        "precip": 0.0,  # 0
        "wind": 0.0,    # 0
        "humid": 0,     # Fallback
        "snow": 0,      # 0
        "desc": "Rank 8"
    },
    # 9. 最下位ランク (Low Temp)
    {
        "temp": -5.0,   # < 0
        "precip": 0.0,
        "wind": 0.0,
        "humid": 0,
        "snow": 0,
        "desc": "Rank 9 (Min Temp)"
    }
]

stations = {}
map_data = {}
snow_features = []

# 地点を生成 (北から南へ緯度をずらして配置)
# 北海道(45N) 〜 九州(31N) くらいの間
start_lat = 45.0
lat_step = (45.0 - 30.0) / len(TEST_CASES)
fixed_lon = 138.0 # 中部地方くらいの経度

for i, case in enumerate(TEST_CASES):
    code = str(90001 + i) # ID: 90001 ~
    lat = start_lat - (lat_step * i)
    lon = fixed_lon + (i % 2) * 2.0 # 少しジグザグにする (138, 140, 138...)
    
    name = f"テスト地点{i+1}"
    
    # 1. amedastable.json 用データ
    stations[code] = {
        "kjName": name,
        "knName": f"テスト{i+1}",
        "lat": [int(lat), (lat % 1) * 60], # 度分形式 (簡易計算)
        "lon": [int(lon), (lon % 1) * 60],
        "alt": 10,
        "type": "C"
    }
    
    # 2. map_data.json 用データ (Temp, Precip, Wind, Humidity, Snow)
    # 値は配列 [value, flag] 形式
    map_data[code] = {
        "temp": [case["temp"], 0],
        "precipitation1h": [case["precip"], 0],
        "wind": [case["wind"], 0],
        "windDirection": [1, 0],
        "humidity": [case["humid"], 0],
        "snow": [case["snow"], 0]
    }
    
    # 3. snow_data.geojson 用データ
    snow_features.append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon, lat] # GeoJSONは [lon, lat]
        },
        "properties": {
            "code": code,
            "snowd": case["snow"],
            "kjName": name,
            "knName": f"テスト{i+1}"
        }
    })

# ファイル書き込み
with open(os.path.join(OUTPUT_DIR, 'amedastable.json'), 'w', encoding='utf-8') as f:
    json.dump(stations, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, 'map_data.json'), 'w', encoding='utf-8') as f:
    json.dump(map_data, f, ensure_ascii=False, indent=2)

snow_geojson = {
    "type": "FeatureCollection",
    "features": snow_features
}

with open(os.path.join(OUTPUT_DIR, 'snow_data.geojson'), 'w', encoding='utf-8') as f:
    json.dump(snow_geojson, f, ensure_ascii=False, indent=2)

print("Test data generated successfully.")
