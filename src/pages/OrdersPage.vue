<template>
  <q-page class="orders-page">
    <div class="card orders">
      <div class="card-header">
        <h2>{{ $t('orders.title') }}</h2>
      </div>
      
      <div v-if="loading" class="card-body text-center q-pa-xl">
        <q-spinner color="primary" size="50px" />
      </div>

      <div v-else-if="orders.length === 0" class="card-body text-center q-pa-xl">
        <q-icon name="receipt_long" size="64px" color="grey-4" />
        <p class="text-grey-6 q-mt-md">No orders found</p>
      </div>

      <div v-else class="card-body">
        <div class="order-item" v-for="order in orders" :key="order.id">
          <div class="orders-row" :class="{ collapsed: !expanded[order.id] }">
            <div class="col package">
              <div class="label">
                {{ order.courseName }} - 
                <span class="muted">{{ order.courseCode }}</span> 
                <span class="chip">{{ $t('orders.package') }}</span>
              </div>
            </div>
            <div class="col status">
              <span class="badge success" v-if="order.status === 'paid'">{{ $t('orders.paid') }}</span>
              <span class="badge warning" v-else-if="order.status === 'pending'">Pending</span>
              <span class="badge error" v-else-if="order.status === 'failed'">Failed</span>
              <span class="badge" v-else>{{ order.status }}</span>
            </div>
            <div class="col caret">
              <q-btn flat round dense :icon="expanded[order.id] ? 'expand_less' : 'expand_more'" @click="toggle(order.id)" />
            </div>
          </div>
          <q-slide-transition>
            <div v-show="expanded[order.id]" class="order-extra">
              <div class="extra-card grid">
                <div class="block">
                  <div class="block-title"><strong>{{ $t('orders.products') }}</strong></div>
                  <ul>
                    <li>{{ order.courseName }}</li>
                    <li>{{ order.amount }} {{ order.currency }}</li>
                  </ul>
                </div>
                <div class="block">
                  <div class="block-title"><strong>{{ $t('orders.order_details') }}</strong></div>
                  <div class="kv">{{ $t('orders.order_id') }}: <span class="order-id">{{ order.id.substring(0, 8) }}...</span></div>
                  <div class="kv">{{ $t('orders.date') }}: <span>{{ formatDate(order.createdAt) }}</span></div>
                  <div class="kv">{{ $t('orders.total') }}: <strong>{{ order.currency }} {{ order.amount }}</strong></div>
                  <div class="kv">{{ $t('orders.payment_method') }}: <span class="text-capitalize">{{ order.provider }}</span></div>
                  <div class="kv" v-if="order.providerPaymentId">Provider ID: <span class="text-grey-7">{{ order.providerPaymentId }}</span></div>
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'OrdersPage',
  setup(){
    const $q = useQuasar()
    const { locale } = useI18n()
    const orders = ref([])
    const loading = ref(true)
    const expanded = reactive({})

    async function fetchTransactions() {
      try {
        loading.value = true
        const response = await api.get('/exams/transactions')
        
        // Transform data
        orders.value = response.data.map(tx => ({
          id: tx.id,
          courseId: tx.courseId,
          courseCode: tx.courseCode,
          courseName: getCourseName(tx.courseName),
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status,
          provider: tx.provider,
          providerPaymentId: tx.providerPaymentId,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
        }))
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load orders',
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    }

    function getCourseName(courseName) {
      if (!courseName) return 'Course'
      
      // If courseName is an object with locale keys
      if (typeof courseName === 'object') {
        const currentLocale = locale.value || 'nl'
        return courseName[currentLocale] || courseName.nl || courseName.en || 'Course'
      }
      
      return courseName
    }

    function formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    function toggle(id) {
      expanded[id] = !expanded[id]
    }

    onMounted(() => {
      fetchTransactions()
    })

    return {
      orders,
      loading,
      expanded,
      toggle,
      formatDate
    }
  }
})
</script>

<style scoped lang="scss" src="../css/orders.scss"></style>


