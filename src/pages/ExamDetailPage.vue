<template>
  <q-page class="q-pa-md">
    <div v-if="program">
      <div class="row">
        <div class="col-12 col-md-8">
          <h2>{{ program.name }}</h2>
          <div class="text-subtitle2 q-mb-md">€ {{ formatAmount(program.price) }}</div>
          <p>{{ program.description }}</p>
          <div class="q-mt-lg">
            <h5>Examples</h5>
            <q-list bordered separator>
              <q-item v-for="ex in program.examples" :key="ex.id">
                <q-item-section>{{ ex.title }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6">Enroll</div>
              <div class="text-subtitle2">Price: € {{ formatAmount(program.price) }}</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn color="primary" no-caps label="Pay & Enroll" @click="startPayment" :loading="loading" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'ProgramDetailPage',
  setup() {
    const route = useRoute()
    const program = ref(null)
    const loading = ref(false)

    function formatAmount(value) { return Number(value || 0).toFixed(2) }

    async function load() {
      try {
        const id = route.params.id
        // This endpoint is for course details, not exam attempts
        const res = await api.get(`/exams/courses/${id}`)
        program.value = res?.data || null
      } catch (error) {
        console.error('Failed to load course:', error)
      }
    }

    async function startPayment() {
      try {
        loading.value = true
        const id = route.params.id
        const res = await api.post(`/payments/enroll/${id}`)
        const checkoutUrl = res?.data?.checkoutUrl
        if (checkoutUrl) window.location.assign(checkoutUrl)
      } catch (error) {
        console.error('Payment failed:', error)
      } finally { 
        loading.value = false 
      }
    }

    onMounted(load)
    return { program, loading, startPayment, formatAmount }
  }
})
</script>

<style scoped>
</style>


