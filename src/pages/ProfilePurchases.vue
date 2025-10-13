<template>
  <q-page class="home-bg">
    <div class="profile-purchases">

      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="50px" />
        <p class="text-grey-6 q-mt-md">{{ $t('profile.loading') }}</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Current Package (First Active Program) -->
        <div v-if="currentProgram" class="info-grid">
        <div class="card card-surface">
          <div class="card-title with-badge">
            <span>{{ $t('profile.current_package') }}</span>
              <q-chip 
                :color="getStatusColor(currentProgram)" 
                text-color="white" 
                size="sm"
              >
                {{ getPackageName(currentProgram.course) }}
              </q-chip>
          </div>
          <div class="package-body">
            <div class="row-line">
                <span class="muted">{{ $t('profile.package_code') }}</span>
                <span class="value">{{ currentProgram.course?.code || '-' }}</span>
            </div>
            <div class="row-line">
              <span class="muted">{{ $t('profile.status') }}</span>
                <span class="value success">{{ getStatusText(currentProgram) }}</span>
            </div>
            <div class="row-line">
              <span class="muted">{{ $t('profile.lessons_included') }}</span>
                <span class="value">{{ currentProgram.course?.lessonCount || 0 }}</span>
              </div>
            </div>
            <div class="row-actions">
              <q-btn 
                color="primary" 
                unelevated 
                no-caps 
                icon="school" 
                :label="$t('profile.view_programs')"
                @click="goToMyPrograms" 
              />
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
                  <div class="value">{{ formatDate(currentProgram.createdAt) }}</div>
                </div>
            </div>
            <div class="date-item">
              <div class="icon-wrap warning">
                <q-icon name="event_busy" size="18px" />
              </div>
              <div class="contents">
                <div class="label">{{ $t('profile.expiry_date') }}</div>
                  <div class="value">{{ formatDate(currentProgram.expiresAt) }}</div>
                </div>
              </div>
            </div>
            
            <!-- Days Left -->
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #eef2f7;">
              <div class="row-line">
                <span class="muted">{{ $t('profile.days_remaining') }}</span>
                <span class="value">{{ getDaysLeft(currentProgram.expiresAt) }} {{ $t('profile.days') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Active Program Message -->
        <div v-else class="card card-surface" style="padding: 40px; text-align: center;">
          <q-icon name="info" size="48px" color="grey-5" />
          <h3 style="margin: 16px 0 8px 0; color: #64748b;">{{ $t('profile.no_active_program') }}</h3>
          <p style="color: #94a3b8; margin-bottom: 16px;">{{ $t('profile.no_active_program_text') }}</p>
          <q-btn 
            color="primary" 
            unelevated 
            no-caps 
            icon="shopping_bag" 
            :label="$t('profile.browse_packages')"
            @click="goToPackages" 
          />
      </div>

        <!-- Invoices / Payment History -->
      <div ref="invoicesRef" class="invoices card-surface">
        <div class="card-title">{{ $t('profile.payment_history') }}</div>
          
          <div v-if="transactions.length === 0" class="empty-state">
            {{ $t('profile.no_transactions') }}
          </div>
          
          <div v-else class="invoice-list">
            <div class="invoice-row" v-for="tx in transactions" :key="tx.id">
            <div class="meta">
                <div class="id">#{{ tx.id.substring(0, 8) }}</div>
                <div class="date">{{ formatDate(tx.createdAt) }}</div>
              </div>
              <div class="amount">{{ tx.currency }} {{ tx.amount }}</div>
              <div class="status" :class="getTransactionStatusClass(tx.status)">
                {{ getTransactionStatusText(tx.status) }}
            </div>
            <div class="actions">
                <q-btn 
                  flat 
                  color="primary" 
                  icon="receipt" 
                  no-caps 
                  :label="$t('profile.view_details')" 
                  size="sm"
                />
              </div>
            </div>
          </div>
          
          <div style="margin-top: 16px; text-align: center;">
            <q-btn 
              flat 
              color="primary" 
              icon="receipt_long" 
              no-caps 
              :label="$t('profile.view_all_orders')"
              @click="goToOrders" 
            />
        </div>
      </div>

        <!-- Summary: Total Programs -->
        <div class="card card-surface" style="margin-top: 18px; padding: 16px;">
          <div class="card-title">{{ $t('profile.program_summary') }}</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 12px;">
            <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 10px;">
              <div style="font-size: 32px; font-weight: 800; color: #16a34a;">{{ activeCount }}</div>
              <div style="font-size: 14px; color: #64748b;">{{ $t('profile.active_programs') }}</div>
            </div>
            <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 10px;">
              <div style="font-size: 32px; font-weight: 800; color: #64748b;">{{ previousCount }}</div>
              <div style="font-size: 14px; color: #64748b;">{{ $t('profile.completed_programs') }}</div>
            </div>
            <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 10px;">
              <div style="font-size: 32px; font-weight: 800; color: #2563eb;">{{ totalTransactions }}</div>
              <div style="font-size: 14px; color: #64748b;">{{ $t('profile.total_purchases') }}</div>
            </div>
          </div>
          
          <div style="margin-top: 16px; text-align: center;">
            <q-btn 
              unelevated
              color="primary" 
              icon="school" 
              no-caps 
              :label="$t('profile.view_all_programs')"
              @click="goToMyPrograms" 
            />
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ProfilePurchases",
  setup() {
    const $q = useQuasar();
    const { locale, t } = useI18n();
    const router = useRouter();
    const programs = ref([]);
    const transactions = ref([]);
    const loading = ref(true);
    const invoicesRef = ref(null);

    // Computed: Active Programs
    const activePrograms = computed(() => {
      return programs.value.filter(program => {
        if (program.status === 'cancelled') return false;
        if (!program.expiresAt) return true;
        const daysLeft = getDaysLeft(program.expiresAt);
        return daysLeft > 0;
      });
    });

    // Computed: Previous Programs
    const previousPrograms = computed(() => {
      return programs.value.filter(program => {
        if (program.status === 'cancelled') return true;
        if (!program.expiresAt) return false;
        const daysLeft = getDaysLeft(program.expiresAt);
        return daysLeft <= 0;
      });
    });

    // Computed: Current Program (first active)
    const currentProgram = computed(() => {
      return activePrograms.value.length > 0 ? activePrograms.value[0] : null;
    });

    // Computed: Counts
    const activeCount = computed(() => activePrograms.value.length);
    const previousCount = computed(() => previousPrograms.value.length);
    const totalTransactions = computed(() => transactions.value.length);

    async function fetchData() {
      try {
        loading.value = true;
        
        // Fetch programs and transactions in parallel
        const [programsRes, transactionsRes] = await Promise.all([
          api.get('/exams/me'),
          api.get('/exams/transactions')
        ]);
        
        programs.value = programsRes.data || [];
        transactions.value = transactionsRes.data || [];
      } catch (error) {
        console.error('Failed to fetch data:', error);
        $q.notify({
          type: 'negative',
          message: t('profile.error_loading'),
          position: 'top'
        });
      } finally {
        loading.value = false;
      }
    }

    function getPackageName(course) {
      if (!course || !course.name) return 'Course';
      
      if (typeof course.name === 'object') {
        const currentLocale = locale.value || 'nl';
        return course.name[currentLocale] || course.name.nl || course.name.en || 'Course';
      }
      
      return course.name;
    }

    function formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString(locale.value || 'nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function getDaysLeft(expiresAt) {
      if (!expiresAt) return 0;
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }

    function getStatusColor(program) {
      const daysLeft = getDaysLeft(program.expiresAt);
      if (daysLeft <= 0) return 'red-6';
      if (daysLeft <= 30) return 'orange-6';
      return 'green-6';
    }

    function getStatusText(program) {
      const daysLeft = getDaysLeft(program.expiresAt);
      if (program.status === 'cancelled') return t('profile.status_cancelled');
      if (daysLeft <= 0) return t('profile.status_expired');
      if (daysLeft <= 30) return t('profile.status_expiring');
      return t('profile.status_active');
    }

    function getTransactionStatusClass(status) {
      const statusMap = {
        'paid': 'paid',
        'pending': 'pending',
        'failed': 'refunded',
        'cancelled': 'refunded',
        'expired': 'refunded'
      };
      return statusMap[status] || 'pending';
    }

    function getTransactionStatusText(status) {
      const textMap = {
        'paid': t('profile.tx_paid'),
        'pending': t('profile.tx_pending'),
        'failed': t('profile.tx_failed'),
        'cancelled': t('profile.tx_cancelled'),
        'expired': t('profile.tx_expired')
      };
      return textMap[status] || status;
    }

    function goToMyPrograms() {
      router.push('/my-exams');
    }

    function goToOrders() {
      router.push('/orders');
    }

    function goToPackages() {
      router.push('/courses');
    }

    function scrollToInvoices() {
      invoicesRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      currentProgram,
      transactions,
      activeCount,
      previousCount,
      totalTransactions,
      invoicesRef,
      getPackageName,
      formatDate,
      getDaysLeft,
      getStatusColor,
      getStatusText,
      getTransactionStatusClass,
      getTransactionStatusText,
      goToMyPrograms,
      goToOrders,
      goToPackages,
      scrollToInvoices
    };
  },
});
</script>

<style scoped lang="scss" src="../css/profile-purchases.scss">

</style>
