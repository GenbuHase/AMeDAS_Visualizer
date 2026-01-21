const fs = require('fs');
const data = JSON.parse(fs.readFileSync('real_amedastable.json', 'utf8'));

// 検索ワード
const keywords = ["新潟", "秋田", "仙台", "東京", "大阪"];

Object.keys(data).forEach(code => {
  const st = data[code];
  if (keywords.some(k => st.kjName && st.kjName.includes(k))) {
    console.log(`${code}: ${st.kjName}`);
  }
});
