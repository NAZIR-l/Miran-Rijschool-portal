<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h2>Programs</h2>
      </div>
      <div v-for="p in programs" :key="p.id" class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ p.name }}</div>
            <div class="text-subtitle2">€ {{ formatAmount(p.price) }}</div>
            <div class="q-mt-sm">{{ p.description }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" no-caps label="View" :to="{ name: 'ProgramDetail', params: { id: p.id } }" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'ProgramsPage',
  setup() {
    const programs = ref([])
    function formatAmount(value) {
      const n = Number(value || 0)
      return n.toFixed(2)
    }
    onMounted(async () => {
      try {
        const res = await api.get('/programs')
        programs.value = res?.data || []
      } catch (_) {}
    })
    return { programs, formatAmount }
  }
})
</script>

<style scoped>
</style>


