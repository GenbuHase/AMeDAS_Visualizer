const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'test_data';
const REAL_DATA_PATH = 'real_amedastable.json';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// 実際の観測所データを読み込み
if (!fs.existsSync(REAL_DATA_PATH)) {
    console.error("Error: real_amedastable.json not found.");
    process.exit(1);
}
const realStations = JSON.parse(fs.readFileSync(REAL_DATA_PATH, 'utf8'));

// テストに使用するターゲット観測所 (北から南へ)
// 正しいコードを使用 (デバッグ結果に基づく)
const TARGET_CODES = [
  "11001", // 稚内 (Rank 1)
  "14163", // 札幌 (Rank 2)
  "32402", // 秋田 (Rank 3) - 32402
  "34392", // 仙台 (Rank 4) - 34392
  "54232", // 新潟 (Rank 5) - 54232
  "44132", // 東京 (Rank 6) - 44132
  "62078", // 大阪 (Rank 7) - 62078
  "67437", // 広島 (Rank 8) - 広島
  "82182", // 福岡 (Rank 9) - 福岡
  "88317"  // 鹿児島 (Rank 10) - 鹿児島
];

// テストケース定義
const TEST_CASES = [
  { temp: 36.5, precip: 85.0, wind: 30.0, humid: 95, snow: 250 }, // Rank 1 (稚内)
  { temp: 32.0, precip: 60.0, wind: 22.0, humid: 75, snow: 180 }, // Rank 2 (札幌)
  { temp: 27.0, precip: 40.0, wind: 17.0, humid: 55, snow: 120 }, // Rank 3 (秋田)
  { temp: 22.0, precip: 25.0, wind: 12.0, humid: 35, snow: 80 },  // Rank 4 (仙台)
  { temp: 17.0, precip: 15.0, wind: 7.0,  humid: 10, snow: 30 },  // Rank 5 (新潟)
  { temp: 12.0, precip: 7.0,  wind: 4.0,  humid: 0,  snow: 10 },  // Rank 6 (東京)
  { temp: 7.0,  precip: 3.0,  wind: 3.0,  humid: 0,  snow: 3 },   // Rank 7 (大阪)
  { temp: 2.0,  precip: 1.0,  wind: 1.0,  humid: 0,  snow: 1 },   // Rank 8 (広島)
  { temp: 0.0,  precip: 0.0,  wind: 0.0,  humid: 0,  snow: 0 },   // Rank 9 (福岡)
  { temp: -5.0, precip: 0.0,  wind: 0.0,  humid: 0,  snow: 0 }    // Rank 10 (鹿児島)
];

const stations = {};
const mapData = {};
const snowFeatures = [];

TARGET_CODES.forEach((code, i) => {
  if (!realStations[code]) {
    console.warn(`Station code ${code} not found in real data. Skipping.`);
    return;
  }
  
  const c = TEST_CASES[i] || TEST_CASES[TEST_CASES.length - 1];

  // 1. amedastable.json
  stations[code] = realStations[code];
  
  // 2. map_data.json
  mapData[code] = {
    temp: [c.temp, 0],
    precipitation1h: [c.precip, 0],
    wind: [c.wind, 0],
    windDirection: [1, 0],
    humidity: [c.humid, 0],
    snow: [c.snow, 0]
  };
  
  // 3. snow_data.geojson
  const st = realStations[code];
  const latDec = st.lat[0] + st.lat[1] / 60;
  const lonDec = st.lon[0] + st.lon[1] / 60;

  snowFeatures.push({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lonDec, latDec]
    },
    properties: {
      code: code,
      snowd: c.snow,
      kjName: st.kjName,
      knName: st.knName
    }
  });
});

// ファイル書き込み
fs.writeFileSync(path.join(OUTPUT_DIR, 'amedastable.json'), JSON.stringify(stations, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'map_data.json'), JSON.stringify(mapData, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, 'snow_data.geojson'), JSON.stringify({
  type: "FeatureCollection",
  features: snowFeatures
}, null, 2));

console.log("Real-station based test data generated (Final).");
