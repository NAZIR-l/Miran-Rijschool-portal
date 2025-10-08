<template>
  <q-btn
    :icon="isFavorite(signal.signalId) ? 'favorite' : 'favorite_border'"
    :color="isFavorite(signal.signalId) ? 'red' : 'grey'"
    flat
    round
    dense
    :loading="loading"
    @click.stop="handleToggleFavorite"
    :title="isFavorite(signal.signalId) ? 'Remove from favorites' : 'Add to favorites'"
  >
    <q-tooltip>
      {{ isFavorite(signal.signalId) ? 'Remove from favorites' : 'Add to favorites' }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { useFavoriteTrafficSignals } from '../composables/useFavoriteTrafficSignals'

const props = defineProps({
  signal: {
    type: Object,
    required: true,
    validator: (signal) => {
      return signal.signalId && signal.signalName && signal.signalType
    }
  }
})

const { toggleFavorite, isFavorite, loading } = useFavoriteTrafficSignals()

const handleToggleFavorite = async () => {
  try {
    await toggleFavorite(props.signal)
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
  }
}
</script>

<style scoped>
.q-btn {
  transition: all 0.3s ease;
}
</style>

