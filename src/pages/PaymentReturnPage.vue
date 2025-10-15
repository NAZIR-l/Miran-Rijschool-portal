<template>
  <q-page class="q-pa-lg flex flex-center payment-return-page">
    <div class="container">
      <q-card flat bordered class="q-pa-lg">
        <div class="column items-center q-gutter-sm q-mb-md">
          <q-avatar v-if="loading" size="64px" color="bg-blue" text-color="white">
            <q-spinner size="lg" />
          </q-avatar>

          <q-avatar v-else-if="isSuccess" size="64px" color="positive" text-color="white">
            <q-icon name="check_circle" size="42px" />
          </q-avatar>

          <q-avatar v-else-if="isPending" size="64px" color="warning" text-color="white">
            <q-icon name="hourglass_top" size="36px" />
          </q-avatar>

          <q-avatar v-else size="64px" color="negative" text-color="white">
            <q-icon name="error" size="42px" />
          </q-avatar>

          <div class="text-h5 text-center">
            <span v-if="loading">Finalizing payment...</span>
            <span v-else-if="isSuccess">Payment successful</span>
            <span v-else-if="isPending">Payment is processing</span>
            <span v-else>Payment failed</span>
          </div>
          <div v-if="!loading" class="text-subtitle2 text-center text-secondary">
            <span v-if="isSuccess && result?.enrolled">You have been enrolled in your course.</span>
            <span v-else-if="isSuccess">Your payment was verified.</span>
            <span v-else-if="isPending">We are still confirming your payment. You can refresh in a moment.</span>
            <span v-else>We couldn't complete your payment. You can try again from the orders page.</span>
          </div>
        </div>

        <q-separator inset class="q-my-md" />

        <div v-if="!loading" class="q-gutter-y-sm">
          <div class="row items-center no-wrap q-col-gutter-sm">
            <div class="col-auto text-grey-7">Status:</div>
            <div class="col text-weight-medium">
              <q-badge :color="isSuccess ? 'positive' : (isPending ? 'warning' : 'negative')" outline>
                {{ (result?.status || 'unknown').toUpperCase() }}
              </q-badge>
            </div>
          </div>
          <div class="row items-center no-wrap q-col-gutter-sm">
            <div class="col-auto text-grey-7">Payment method:</div>
            <div class="col text-weight-medium">{{ prettyMethod }}</div>
          </div>
          <div class="row items-center no-wrap q-col-gutter-sm">
            <div class="col-auto text-grey-7">Transaction ID:</div>
            <div class="col ellipsis text-weight-medium" :title="result?.transactionId">
              {{ result?.transactionId || '-' }}
            </div>
            <div class="col-auto">
              <q-btn dense flat icon="content_copy" @click="copyTxId" :disable="!result?.transactionId" :title="'Copy'" />
            </div>
          </div>
        </div>

        <div class="q-mt-lg row justify-center q-gutter-sm">
          <q-btn v-if="isSuccess" color="primary" unelevated label="Go to My Exams" @click="goMyExams" />
          <q-btn v-if="isSuccess" outline color="primary" label="Go to Dashboard" @click="goDashboard" />
          <q-btn v-if="!loading && !isSuccess && !isPending" color="primary" unelevated label="Go to Orders" @click="goOrders" />
          <q-btn v-if="isPending" outline color="warning" label="Refresh status" @click="refresh" :loading="refreshing" />
        </div>
      </q-card>
    </div>
  </q-page>
  
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'PaymentReturnPage',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const loading = ref(true)
    const refreshing = ref(false)
    const result = ref(null)

    const isSuccess = computed(() => result.value?.status === 'paid')
    const isPending = computed(() => ['pending', 'open', 'authorized'].includes(result.value?.status))
    const prettyMethod = computed(() => {
      const method = result.value?.method || '-'
      return String(method).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    })

    const fetchStatus = async () => {
      const transactionId = route.query?.transactionId
      if (!transactionId) {
        result.value = { status: 'failed', method: '-', transactionId: null }
        loading.value = false
        return
      }
      try {
        const { data } = await api.get('/payments/return', { params: { transactionId } })
        result.value = data
      } catch (e) {
        result.value = { status: 'failed', method: '-', transactionId }
      } finally {
        loading.value = false
      }
    }

    const refresh = async () => {
      refreshing.value = true
      try { await fetchStatus() } finally { refreshing.value = false }
    }

    const goDashboard = () => router.replace({ name: 'Dashboard' })
    const goMyExams = () => router.replace({ name: 'MyExams' })
    const goOrders = () => router.replace({ name: 'Orders' })
    const copyTxId = async () => {
      if (!result.value?.transactionId) return
      try { await navigator.clipboard.writeText(result.value.transactionId) } catch (_) {}
    }

    onMounted(fetchStatus)

    return {
      loading,
      refreshing,
      result,
      isSuccess,
      isPending,
      prettyMethod,
      goDashboard,
      goMyExams,
      goOrders,
      refresh,
      copyTxId,
    }
  }
})
</script>

<style scoped>
.payment-return-page {
  min-height: 824px;
    display: flex
;
    align-items: flex-start;
    width: 100%;
} 
.container {
  border-top: 5px solid #2b3bff !important;
    width: 100%;
    border-radius: 12px;
}
.bg-blue {
  background: #2b3bff !important;
}
</style>


