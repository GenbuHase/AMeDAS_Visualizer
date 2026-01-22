# ⛅ アメダスマップ (AMeDAS Visualizer)

気象庁の公開データを利用して、日本全国のアメダス観測所における現在の気象状況（気温、降水量、風向・風速、日照時間、積雪深、湿度）を地図上に可視化するWebアプリケーションです。

Nuxt 3 と Leaflet を使用して構築されており、SPA（Single Page Application）として設計されています。

[🌐 デモサイト (GitHub Pages)](https://genbuhase.github.io/AMeDAS_Visualizer/)

## ✨ 主な機能

### 🗺️ 多彩なデータの可視化

以下の気象データを地図上で確認できます。データ種別を切り替えると、地図上のマーカーの色や大きさが変化し、状況を一目で把握できます。

*   🌡️ **気温**: 暑い場所・寒い場所をグラデーションで表示
*   ☔ **降水量**: 雨の強さを色とサイズで表現
*   🍃 **風向・風速**: 風の強さと向きを矢印で表示
*   ⛄ **積雪深**: 積雪量を円の大きさで表現
*   💧 **湿度**: 空気の乾燥具合を表示

### 📊 詳細情報の確認

地図上の観測所マーカーをクリックすると、以下の詳細情報が表示されます。

*   観測所名（読み仮名）
*   現在の測定値
*   📈 **推移グラフリンク**: 気象庁公式サイトの詳細グラフへ一発アクセス
*   ⭐️ **お気に入り登録**: よく見る地点を登録

### 🏆 ランキングとリスト

*   **ランキング**: 現在のデータ値が高い順（または低い順）に全国トップ20を表示します。
*   **お気に入り**: 登録した地点の最新データを一覧で確認できます。

リストの項目をクリックすると、地図がその地点へ自動的に移動します。

## 🛠️ 技術スタック

*   **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, TypeScript)
*   **Map Library**: [Leaflet](https://leafletjs.com/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment**: GitHub Pages (GitHub Actionsによる自動デプロイ)

## 🚀 ローカルでの開発・実行

### 前提条件

*   Node.js (v18以上推奨)
*   npm

### 手順

1.  **リポジトリのクローン**
    ```bash
    git clone https://github.com/GenbuHase/AMeDAS_Visualizer.git
    cd AMeDAS_Visualizer
    ```

2.  **依存関係のインストール**
    ```bash
    npm install
    ```

3.  **開発サーバーの起動**
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:3000` にアクセスしてください。

4.  **静的サイトの生成**
    ```bash
    npm run generate
    ```
    `.output/public` ディレクトリに静的ファイルが生成されます。

## ⚠️ 注意事項

### データ出典について
本アプリケーションは、気象庁のWebサイトで公開されているデータを利用しています。
> 出典: [気象庁 Japan Meteorological Agency](https://www.jma.go.jp/)

本アプリは気象庁の公認アプリではありません。また、気象庁APIおよびデータ形式は変更される可能性があるため、将来的に動作しなくなる可能性があります。

## 📄 ライセンス

[MIT License](./LICENSE)