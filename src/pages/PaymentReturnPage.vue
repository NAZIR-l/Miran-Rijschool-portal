<template>
  <q-page class="q-pa-md flex flex-center column">
    <q-spinner color="primary" size="2em" class="q-mb-md" />
    <div class="text-h6 q-mb-sm">Finalizing payment...</div>
    <div class="text-subtitle2">You will be redirected shortly.</div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PaymentReturnPage',
  setup() {
    const router = useRouter()
    onMounted(async () => {
      setTimeout(() => {
        try { router.replace({ name: 'Dashboard' }) } catch (_) {}
      }, 1500)
    })
    return {}
  }
})
</script>

<style scoped>
</style>


