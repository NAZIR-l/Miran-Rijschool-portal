<template>
  <q-page class="home-bg">
    <div class="profile-purchases">


      <!-- Info grid -->
      <div class="info-grid">
        <div class="card card-surface">
          <div class="card-title with-badge">
            <span>Current package</span>
            <q-chip color="green-6" text-color="white" size="sm">{{ currentPackage.name }}</q-chip>
          </div>
          <div class="package-body">
            <div class="row-line">
              <span class="muted">Vehicle type</span>
              <span class="value">Automatic</span>
            </div>
            <div class="row-line">
              <span class="muted">Status</span>
              <span class="value success">Active</span>
            </div>
            <div class="row-line">
              <span class="muted">Lessons included</span>
              <span class="value">20</span>
            </div>
          </div>
          <div class="row-actions">
            <q-btn color="primary" unelevated no-caps icon="autorenew" label="Renew package" />
          </div>
        </div>


        <div class="card card-surface">
          <div class="card-title">Dates</div>
          <div class="dates">
            <div class="date-item">
              <q-icon name="event" size="20px" />
              <div class="contents">
                <div class="label">Start date</div>
                <div class="value">{{ currentPackage.startDate }}</div>
              </div>
            </div>
            <div class="date-item">
              <q-icon name="event_busy" size="20px" />
              <div class="contents">
                <div class="label">Expiry date</div>
                <div class="value">{{ currentPackage.expires }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices / payment history -->
      <div ref="invoicesRef" class="invoices card-surface">
        <div class="card-title">Payment history</div>
        <div class="invoice-list">
          <div class="invoice-row" v-for="inv in invoices" :key="inv.id">
            <div class="meta">
              <div class="id">#{{ inv.id }}</div>
              <div class="date">{{ inv.date }}</div>
            </div>
            <div class="amount">€ {{ inv.amount }}</div>
            <div class="status" :class="inv.status">{{ inv.status }}</div>
            <div class="actions">
              <q-btn flat color="primary" icon="download" no-caps label="Download" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "ProfilePurchases",
  setup() {
    const username = ref("Tareqyt01");
    const currentPackage = ref({
      name: "Auto Deluxe",
      startDate: "03-09-2025 10:00",
      expires: "26-10-2025 14:07",
      totalDays: 31,
      daysUsed: 8,
    });
    const daysLeft = computed(() => Math.max((currentPackage.value.totalDays || 0) - (currentPackage.value.daysUsed || 0), 0));
    const validityPercent = computed(() => Math.round((currentPackage.value.daysUsed / currentPackage.value.totalDays) * 100));

    const invoices = ref([
      { id: "2025-0012", date: "19-09-2025", amount: "149.00", status: "paid" },
      { id: "2025-0008", date: "12-08-2025", amount: "99.00", status: "paid" },
      { id: "2025-0005", date: "01-07-2025", amount: "249.00", status: "refunded" },
    ]);

    const invoicesRef = ref(null);
    function scrollToInvoices() {
      invoicesRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return { username, currentPackage, daysLeft, validityPercent, invoices, invoicesRef, scrollToInvoices };
  },
});
</script>

<style scoped lang="scss" src="../css/profile-purchases.scss">

</style>


