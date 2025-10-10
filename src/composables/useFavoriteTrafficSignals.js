import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios.js'

const favorites = ref([])
const loading = ref(false)
const error = ref(null)

export function useFavoriteTrafficSignals() {
  const $q = useQuasar()

  // Computed properties
  const favoritesCount = computed(() => favorites.value.length)
  
  const favoriteSignalIds = computed(() => 
    favorites.value.map(f => f.signalId)
  )

  const hasFavorites = computed(() => favorites.value.length > 0)

  /**
   * Check if a signal is in favorites
   * @param {string} signalId - The ID of the signal
   * @returns {boolean}
   */
  function isFavorite(signalId) {
    return favoriteSignalIds.value.includes(signalId)
  }

  /**
   * Fetch all favorites from the API
   */
  async function fetchFavorites() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/favorite-traffic-signals')
      favorites.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch favorites'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a traffic signal to favorites
   * @param {Object} signal - The signal object
   * @param {string} signal.signalId - Unique identifier for the signal
   * @param {string} signal.signalName - Name of the signal
   * @param {string} signal.signalType - Type/category of the signal
   * @param {string} [signal.signalImageUrl] - Optional image URL
   */
  async function addToFavorites(signal) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/favorite-traffic-signals', {
        signalId: signal.signalId,
        signalName: signal.signalName,
        signalType: signal.signalType,
        signalImageUrl: signal.signalImageUrl || null
      })
      
      // Add to local state
      favorites.value.unshift(response.data)
      
      $q.notify({
        type: 'positive',
        message: 'Added to favorites',
        icon: 'favorite',
        position: 'top',
        timeout: 2000
      })
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add to favorites'
      
      if (err.response?.status === 409) {
        $q.notify({
          type: 'warning',
          message: 'This signal is already in your favorites',
          position: 'top'
        })
      } else {
        $q.notify({
          type: 'negative',
          message: error.value,
          position: 'top'
        })
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove a traffic signal from favorites by signal ID
   * @param {string} signalId - The signal ID to remove
   */
  async function removeFromFavorites(signalId) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/favorite-traffic-signals/by-signal/${signalId}`)
      
      // Remove from local state
      const index = favorites.value.findIndex(f => f.signalId === signalId)
      if (index > -1) {
        favorites.value.splice(index, 1)
      }
      
      $q.notify({
        type: 'info',
        message: 'Removed from favorites',
        icon: 'heart_broken',
        position: 'top',
        timeout: 2000
      })
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove from favorites'
      $q.notify({
        type: 'negative',
        message: error.value,
        position: 'top'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle a signal's favorite status
   * @param {Object} signal - The signal object
   */
  async function toggleFavorite(signal) {
    if (isFavorite(signal.signalId)) {
      await removeFromFavorites(signal.signalId)
    } else {
      await addToFavorites(signal)
    }
  }

  /**
   * Check if a specific signal is in favorites (API call)
   * @param {string} signalId - The signal ID to check
   * @returns {Promise<boolean>}
   */
  async function checkIsFavorite(signalId) {
    try {
      const response = await api.get(`/favorite-traffic-signals/by-signal/${signalId}`)
      return !!response.data
    } catch (err) {
      if (err.response?.status === 404) {
        return false
      }
      throw err
    }
  }

  /**
   * Get favorites count from API
   */
  async function fetchFavoritesCount() {
    try {
      const response = await api.get('/favorite-traffic-signals/count')
      return response.data
    } catch (err) {
      console.error('Failed to fetch favorites count:', err)
      return 0
    }
  }

  /**
   * Filter favorites by type
   * @param {string} type - The signal type to filter by
   * @returns {Array}
   */
  function getFavoritesByType(type) {
    return favorites.value.filter(f => f.signalType === type)
  }

  /**
   * Clear all favorites (local state only)
   */
  function clearFavorites() {
    favorites.value = []
  }

  return {
    // State
    favorites: computed(() => favorites.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Computed
    favoritesCount,
    favoriteSignalIds,
    hasFavorites,
    
    // Methods
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    checkIsFavorite,
    fetchFavoritesCount,
    getFavoritesByType,
    clearFavorites
  }
}

