// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  
  app: {
    baseURL: './',

    head: {
      title: 'アメダスマップ | 全国のアメダスデータを可視化',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'description', content: '気象庁のアメダスデータを利用して、日本全国の現在の気温、降水量、風速、積雪深、湿度を地図上に可視化するWebアプリケーションです。' },
        { name: 'keywords', content: 'アメダス, 天気, 気象庁, 気温, 降水量, 風速, 積雪深, 湿度, 可視化, マップ' },
        { name: 'author', content: 'Genbu Hase' },
        // OGP
        { property: 'og:title', content: 'アメダスマップ | 全国のアメダスデータを可視化' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://genbuhase.github.io/AMeDAS_Visualizer/' },
        { property: 'og:description', content: '気象庁のアメダスデータを利用して、日本全国の現在の気象状況（気温、降水量など）を地図上に可視化するWebアプリケーションです。' },
        { property: 'og:site_name', content: 'アメダスマップ' },
        { property: 'og:locale', content: 'ja_JP' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'アメダスマップ' },
        { name: 'twitter:description', content: '日本全国のアメダスデータ（気温、降水量、積雪深など）をリアルタイムで地図上に表示します。' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' },
      ],
      script: [
        { src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', defer: true },
      ],
    },
  },
  
  ssr: false
})
