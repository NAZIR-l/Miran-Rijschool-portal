<template>
  <q-page class="home-bg">
    <div class="profile-purchases">


      <!-- Info grid -->
      <div class="info-grid">
        <div class="card card-surface">
          <div class="card-title with-badge">
            <span>{{ $t('profile.current_package') }}</span>
            <q-chip color="green-6" text-color="white" size="sm">{{ currentPackage.name }}</q-chip>
          </div>
          <div class="package-body">
            <div class="row-line">
              <span class="muted">{{ $t('profile.vehicle_type') }}</span>
              <span class="value">Automatic</span>
            </div>
            <div class="row-line">
              <span class="muted">{{ $t('profile.status') }}</span>
              <span class="value success">{{ $t('profile.active') }}</span>
            </div>
            <div class="row-line">
              <span class="muted">{{ $t('profile.lessons_included') }}</span>
              <span class="value">20</span>
            </div>
          </div>
          <div class="row-actions">
            <q-btn color="primary" unelevated no-caps icon="autorenew" :label="$t('profile.renew_package')" />
          </div>
        </div>


        <div class="card card-surface">
          <div class="card-title">{{ $t('profile.dates') }}</div>
          <div class="dates">
            <div class="date-item">
              <div class="icon-wrap">
                <q-icon name="event" size="18px" />
              </div>
              <div class="contents">
                <div class="label">{{ $t('profile.start_date') }}</div>
                <div class="value">{{ currentPackage.startDate }}</div>
              </div>
            </div>
            <div class="date-item">
              <div class="icon-wrap warning">
                <q-icon name="event_busy" size="18px" />
              </div>
              <div class="contents">
                <div class="label">{{ $t('profile.expiry_date') }}</div>
                <div class="value">{{ currentPackage.expires }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices / payment history -->
      <div ref="invoicesRef" class="invoices card-surface">
        <div class="card-title">{{ $t('profile.payment_history') }}</div>
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

      <!-- Previous packages (collapsible) -->
      <div class="previous-packages card-surface">
        <div class="card-title">{{ $t('profile.previous_packages') }}</div>
        <q-expansion-item
          v-for="pkg in previousPackages"
          :key="pkg.id"
          expand-separator
          dense
          class="pkg-item"
        >
          <template #header>
            <div class="pkg-header">
              <div class="title">
                <q-icon name="inventory_2" size="18px" />
                <span>{{ pkg.name }}</span>
              </div>
              <div class="meta">
                <q-chip outline color="grey-7" size="sm">{{ pkg.vehicleType }}</q-chip>
                <span class="dates">{{ pkg.startDate }} → {{ pkg.endDate }}</span>
              </div>
            </div>
          </template>

          <div class="pkg-body">
            <div class="rows">
              <div class="row"><span class="label">{{ $t('profile.lessons') }}</span><span class="value">{{ pkg.lessons }}</span></div>
              <div class="row"><span class="label">{{ $t('profile.status') }}</span><span class="value">{{ pkg.status }}</span></div>
            </div>
            <div class="actions">
              <q-btn flat color="primary" icon="receipt_long" no-caps :label="$t('profile.view_invoice')" />
            </div>
          </div>
        </q-expansion-item>
        <div v-if="previousPackages.length === 0" class="empty-state">{{ $t('profile.no_previous_packages') }}</div>
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

    const previousPackages = ref([
      { id: 'pkg-2025-01', name: 'Auto Standard', vehicleType: 'Automatic', startDate: '01-06-2025', endDate: '30-06-2025', lessons: 15, status: 'Expired' },
      { id: 'pkg-2025-02', name: 'Auto Pro', vehicleType: 'Manual', startDate: '01-03-2025', endDate: '31-03-2025', lessons: 20, status: 'Expired' },
    ]);

    const invoicesRef = ref(null);
    function scrollToInvoices() {
      invoicesRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return { username, currentPackage, daysLeft, validityPercent, invoices, invoicesRef, scrollToInvoices, previousPackages };
  },
});
</script>

<style scoped lang="scss" src="../css/profile-purchases.scss">

</style>


