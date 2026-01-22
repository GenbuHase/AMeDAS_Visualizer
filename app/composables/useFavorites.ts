// お気に入り管理のComposable
export const useFavorites = () => {
  const STORAGE_KEY = 'amedas_favorites'
  const favorites = ref<string[]>([])

  // LocalStorageから読み込み
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        favorites.value = JSON.parse(stored).map(String)
      }
    } catch (e) {
      console.error('Failed to load favorites:', e)
      favorites.value = []
    }
  }

  // LocalStorageに保存
  const saveFavorites = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
    } catch (e) {
      console.error('Failed to save favorites:', e)
    }
  }

  // お気に入り登録/解除
  const toggleFavorite = (code: string) => {
    const strCode = String(code)
    const index = favorites.value.indexOf(strCode)
    
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(strCode)
    }
    
    saveFavorites()
  }

  // お気に入りかチェック
  const isFavorite = (code: string) => {
    return favorites.value.includes(String(code))
  }

  // 初期化時に読み込み
  if (favorites.value.length === 0) {
    loadFavorites()
  }

  return {
    favorites: readonly(favorites),
    toggleFavorite,
    isFavorite,
    loadFavorites
  }
}
