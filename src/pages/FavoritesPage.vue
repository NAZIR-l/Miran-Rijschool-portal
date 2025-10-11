<template>
  <q-page class="favorites-page q-pa-md">
    <div class="page-header q-mb-lg">
      <h4 class="text-h4 q-my-none">
        <q-icon name="favorite" color="red" size="md" class="q-mr-sm" />
        My Favorite Traffic Signals
      </h4>
      <p class="text-subtitle1 text-grey-7 q-mt-sm">
        {{ favoritesCount }} favorite{{ favoritesCount !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasFavorites" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !hasFavorites" class="empty-state">
      <q-card flat bordered class="text-center q-pa-xl">
        <q-icon name="favorite_border" size="5em" color="grey-5" />
        <h5 class="text-h5 q-mt-md q-mb-sm">No favorites yet</h5>
        <p class="text-body1 text-grey-7 q-mb-lg">
          Start adding traffic signals to your favorites from the Traffic Signs page!
        </p>
        <q-btn
          color="primary"
          label="Browse Traffic Signs"
          icon="traffic"
          unelevated
          to="/traffic-signs"
        />
      </q-card>
    </div>

    <!-- Favorites Grid -->
    <div v-else class="favorites-grid">
      <!-- Filter by Type -->
      <div class="filter-section q-mb-md">
        <q-btn-toggle
          v-model="selectedType"
          spread
          no-caps
          unelevated
          toggle-color="primary"
          :options="typeOptions"
          class="q-mb-md"
        />
      </div>

      <!-- Favorites List -->
      <div class="row q-col-gutter-md">
        <div
          v-for="favorite in filteredFavorites"
          :key="favorite.id"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card class="favorite-card">
            <q-img
              v-if="getImageUrl(favorite.signalId, favorite.signalType)"
              :src="getImageUrl(favorite.signalId, favorite.signalType)"
              :alt="favorite.signalName"
              ratio="1"
              class="signal-image"
            >
              <div class="absolute-top-right q-pa-xs">
                <q-btn
                  icon="close"
                  color="red"
                  round
                  dense
                  size="sm"
                  @click="handleRemove(favorite.signalId)"
                  :loading="loading"
                >
                  <q-tooltip>Remove from favorites</q-tooltip>
                </q-btn>
              </div>
            </q-img>

            <q-card-section>
              <div class="text-h6">{{ favorite.signalName }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                <q-chip
                  :label="favorite.signalType"
                  size="sm"
                  color="primary"
                  text-color="white"
                  dense
                />
              </div>
              <div class="text-caption text-grey-6 q-mt-sm">
                Added {{ formatDate(favorite.createdAt) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavoriteTrafficSignals } from '../composables/useFavoriteTrafficSignals'

const {
  favorites,
  loading,
  hasFavorites,
  favoritesCount,
  fetchFavorites,
  removeFromFavorites,
  getFavoritesByType
} = useFavoriteTrafficSignals()

const selectedType = ref('all')

// Helper function to get image URL from signalId and signalType
const getImageUrl = (signalId, signalType) => {
  try {
    // Map signal types to their asset folders
    const folderMap = {
      'warnings': 'Waarschuwingsborden',
      'speed': 'Snelheidsborden',
      'priority': 'Voorrangsborden',
      'info': 'Informatieborden',
      'prohibition': 'Geboden en verboden',
      'direction': 'Rijrichtingen',
      'parking': 'Parkeren'
    }

    const folder = folderMap[signalType] || 'Waarschuwingsborden'

    // Use relative path instead of @ alias for require
    try {
      return require(`../assets/${folder}/${signalId}.webp`)
    } catch (e) {
      // Try other extensions if webp fails
      try {
        return require(`../assets/${folder}/${signalId}.png`)
      } catch (e2) {
        try {
          return require(`../assets/${folder}/${signalId}.jpg`)
        } catch (e3) {
          return null
        }
      }
    }
  } catch (error) {
    console.error('Failed to load image:', signalId, error)
    return null
  }
}

// Get unique types from favorites
const availableTypes = computed(() => {
  const types = new Set(favorites.value.map(f => f.signalType))
  return Array.from(types)
})

const typeOptions = computed(() => {
  const options = [{ label: 'All', value: 'all' }]
  availableTypes.value.forEach(type => {
    options.push({ label: type, value: type })
  })
  return options
})

const filteredFavorites = computed(() => {
  if (selectedType.value === 'all') {
    return favorites.value
  }
  return getFavoritesByType(selectedType.value)
})

const handleRemove = async (signalId) => {
  try {
    await removeFromFavorites(signalId)
  } catch (error) {
    console.error('Failed to remove favorite:', error)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'today'
  } else if (diffDays === 1) {
    return 'yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

onMounted(async () => {
  await fetchFavorites()
})
</script>

<style lang="scss" scoped>
.favorites-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  h4 {
    display: flex;
    align-items: center;
  }
}

.favorite-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

.signal-image {
  background-color: #f5f5f5;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.filter-section {
  width: 100%;
  max-width: 600px;
}
</style>

