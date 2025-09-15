<template>
  <q-page class=" orders-page">
    <div class="card orders">
      <div class="card-header">
        <h2>{{ $t('orders.title') }}</h2>
      </div>
      <div class="card-body">
        <div class="order-item" v-for="order in orders" :key="order.id">
          <div class="orders-row" :class="{ collapsed: !expanded[order.id] }">
            <div class="col package">
              <div class="label">Car - <span class="muted">{{ order.plan }}</span> <span class="chip">{{ $t('orders.package') }}</span></div>
            </div>
            <div class="col status">
              <span class="badge success" v-if="order.paid">{{ $t('orders.paid') }}</span>
              <span class="badge" v-else>{{ $t('orders.unpaid') }}</span>
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
                    <li v-for="p in order.items" :key="p">{{ p }}</li>
                  </ul>
                </div>
                <div class="block">
                  <div class="block-title"><strong>{{ $t('orders.order_details') }}</strong></div>
                  <div class="kv">{{ $t('orders.order_id') }}: <a href="#">{{ order.id }}</a></div>
                  <div class="kv">{{ $t('orders.date') }}: <span>{{ order.date }}</span></div>
                  <div class="kv">{{ $t('orders.total') }}: <strong>€ {{ order.total }}</strong></div>
                  <div class="kv">{{ $t('orders.payment_method') }}: <img :src="order.pmLogo" class="pm" alt="pm" /></div>
                </div>
              </div>
              <q-btn flat color="primary" :label="$t('orders.view_invoice')" class="mt-8" />
            </div>
          </q-slide-transition>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'OrdersPage',
  setup(){
    const orders = [
      { id: '69696', plan: 'Lite', date: 'September 2, 2025', total: '69.99', paid: true, pmLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Mastercard_2019_logo.svg', items: ['Car Theory Lite - 7 days access'] },
      { id: '70231', plan: 'Deluxe', date: 'September 8, 2025', total: '69.99', paid: true, pmLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Mastercard_2019_logo.svg', items: ['Car Theory Deluxe - 31 days access', '7 CBR modules'] },
      { id: '71202', plan: 'Premium', date: 'September 20, 2025', total: '59.99', paid: false, pmLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Mastercard_2019_logo.svg', items: ['Car Theory Premium - 21 days access'] },
    ]
    const expanded = reactive({})
    function toggle(id){ expanded[id] = !expanded[id] }
    return { orders, expanded, toggle }
  }
})
</script>

<style scoped lang="scss" src="./orders.scss"></style>


