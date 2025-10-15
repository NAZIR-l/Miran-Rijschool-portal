<template>
  <div class="payment-return-page">
    <div class="container">
      <!-- Logo Header -->
      <div class="logo-header">
        <img src="../assets/Logo-test1.png" alt="Logo" class="logo" />
      </div>

      <q-card flat bordered class="q-pa-lg payment-card">
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
          </div>
        </div>

        <div class="q-mt-lg column items-center q-gutter-sm">
          <q-btn v-if="isSuccess" color="primary" size="lg" unelevated label="Portal" @click="goLogin" class="login-btn" />
          <q-btn v-if="!loading && !isSuccess && !isPending" color="primary" size="lg" unelevated label="Login to Retry" @click="goLogin" class="login-btn" />
          <q-btn v-if="isPending" outline color="warning" label="Refresh Status" @click="refresh" :loading="refreshing" />
          <div v-if="!loading" class="text-caption text-grey-7 q-mt-sm">
            Login to your portal to access your purchased course
          </div>
        </div>
      </q-card>
    </div>
  </div>
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

    const goLogin = () => {
      // Redirect to login page
      window.location.href = 'https://leren.miranrijschool.nl/'
    }
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
      goLogin,
      refresh,
      copyTxId,
    }
  }
})
</script>

<style scoped>
.payment-return-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  padding: 24px;
}

.container {
  width: 100%;
  max-width: 600px;
}

.logo-header {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.logo {
  height: 60px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.payment-card {
  border-top: 5px solid #2b3bff;
  border-radius: 16px;
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-btn {
  width: 100%;
  max-width: 320px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  font-size: 20px;
    background: #2b3bff !important;
    border-radius: 14px;
}

.bg-blue {
  background: #2b3bff !important;
}

@media (max-width: 600px) {
  .payment-return-page {
    padding: 16px;
  }
  
  .logo {
    height: 48px;
  }
  
  .login-btn {
    max-width: 100%;
  }
}
</style>


