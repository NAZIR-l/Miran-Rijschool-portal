<template>
  <q-page class="home-bg">
    <div class="profile-container">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="50px" />
        <p class="text-grey-6 q-mt-md">{{ $t("profilePurchases.loading") }}</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Active Programs Swiper -->

        <div v-if="activePrograms.length > 0" class="active-programs-section">

          <div class="programs-grid">
            <div 
              v-for="program in activePrograms" 
              :key="program.id"
              class="program-card-modern card-surface"
            >
              <div class="program-card-content">
                  <!-- Header with Badge -->
                  <div class="card-header-large">
                    <div class="header-content">
                      <q-icon name="school" size="32px" color="primary" />
                      <div class="header-text">
                        <h3>{{ getCourseName(program.course) }}</h3>
                        <p class="package-code">{{ program.course?.code }}</p>
                      </div>
                    </div>
                    <q-chip
                      :color="getStatusColor(program)"
                      text-color="white"
                      size="md"
                      icon="check_circle"
                    >
                      {{ getStatusText(program) }}
                    </q-chip>
                  </div>

                  <!-- Stats Grid -->
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-icon" style="background: #e0f2fe">
                        <q-icon name="event" size="24px" color="blue-7" />
                      </div>
                      <div class="stat-content">
                        <div class="stat-label">
                          {{ $t("profilePurchases.startDate") }}
                        </div>
                        <div class="stat-value">
                          {{ formatDateShort(program.enrolledAt) }}
                        </div>
                      </div>
                    </div>

                    <div class="stat-item">
                      <div class="stat-icon" style="background: #fef3c7">
                        <q-icon
                          name="event_busy"
                          size="24px"
                          color="orange-7"
                        />
                      </div>
                      <div class="stat-content">
                        <div class="stat-label">
                          {{ $t("profilePurchases.expiresOn") }}
                        </div>
                        <div class="stat-value">
                          {{ formatDateShort(program.expiresAt) }}
                        </div>
                      </div>
                    </div>

                    <div class="stat-item">
                      <div class="stat-icon" style="background: #dcfce7">
                        <q-icon name="schedule" size="24px" color="green-7" />
                      </div>
                      <div class="stat-content">
                        <div class="stat-label">
                          {{ $t("profilePurchases.daysLeft") }}
                        </div>
                        <div class="stat-value">
                          {{ getDaysLeft(program.expiresAt) }}
                          {{ $t("profilePurchases.days") }}
                        </div>
                      </div>
                    </div>

                    <div class="stat-item">
                      <div class="stat-icon" style="background: #e9d5ff">
                        <q-icon name="book" size="24px" color="purple-7" />
                      </div>
                      <div class="stat-content">
                        <div class="stat-label">
                          {{ $t("profilePurchases.lessons") }}
                        </div>
                        <div class="stat-value">
                          {{ program.course?.lessonCount || 0 }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Progress Section -->
                  <div class="progress-section-large">
                    <div class="progress-header">
                      <span class="progress-label">{{
                        $t("profilePurchases.timeRemaining")
                      }}</span>
                      <span class="progress-percentage"
                        >{{ getProgressPercentage(program) }}%</span
                      >
                    </div>
                    <q-linear-progress
                      :value="getProgressPercentage(program) / 100"
                      :color="getProgressColor(program)"
                      size="12px"
                      rounded
                      class="progress-bar-large"
                    />
                  </div>

                  <!-- Action Buttons -->
                  <div class="card-actions-large">
                    <q-btn
                      unelevated
                      color="primary"
                      icon="visibility"
                      :label="$t('profilePurchases.viewDetails')"
                      @click="openDetailsDialog(program)"
                      no-caps
                      class="action-btn"
                    />
                    <q-btn
                      outline
                      color="primary"
                      icon="play_arrow"
                      :label="$t('profilePurchases.startPractice')"
                      @click="startPractice(program.course?.id)"
                      no-caps
                      class="action-btn"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
       

        <!-- No Active Programs -->
        <div
          v-else
          class="card card-surface"
          style="padding: 40px; text-align: center"
        >
            <q-icon name="info" size="64px" color="grey-5" />
            <h3 style="margin: 16px 0 8px 0; color: #64748b; font-size: 22px">
              {{ $t("profilePurchases.noActiveProgram") }}
            </h3>
            <p style="color: #94a3b8; margin-bottom: 24px; font-size: 16px">
              {{ $t("profilePurchases.noActiveProgramText") }}
            </p>
            <q-btn
              color="primary"
              unelevated
              size="md"
              no-caps
              icon="shopping_bag"
              :label="$t('profilePurchases.browsePackages')"
              @click="goToPackages"
            />
        </div>


        <!-- Summary Cards -->

        <!-- Transactions History -->
        <div class="transactions-section card-surface">
          <div class="section-header-inline">
            <div>
              <h2 class="section-title">
                {{ $t("profilePurchases.paymentHistory") }}
              </h2>
              <p class="section-subtitle">
                {{ $t("profilePurchases.historySubtitle") }}
              </p>
            </div>
            <q-btn
              flat
              color="primary"
              icon="receipt_long"
              :label="$t('profilePurchases.viewAll')"
              @click="goToOrders"
              no-caps
            />
          </div>

          <div v-if="transactions.length === 0" class="empty-state">
            <q-icon name="receipt_long" size="48px" color="grey-4" />
            <p>{{ $t("profilePurchases.noTransactions") }}</p>
          </div>

          <div v-else class="transactions-list">
            <div
              v-for="tx in recentTransactions"
              :key="tx.id"
              class="transaction-item"
            >
              <div class="tx-icon">
                <q-icon name="shopping_bag" size="20px" />
              </div>
              <div class="tx-details">
                <div class="tx-name">{{ getPackageNameFromTx(tx) }}</div>
                <div class="tx-date">{{ formatDate(tx.createdAt) }}</div>
              </div>
              <div class="tx-amount">
                <div class="amount-value">
                  {{ tx.currency }} {{ tx.amount }}
                </div>
                <q-chip :class="'tx-status-' + tx.status" size="sm" dense>
                  {{ getTransactionStatusText(tx.status) }}
                </q-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- Previous Programs -->
        <div
          v-if="previousPrograms.length > 0"
          class="previous-section card-surface"
        >
          <div class="section-header-inline">
            <div>
              <h2 class="section-title">
                {{ $t("profilePurchases.previousPrograms") }}
              </h2>
              <p class="section-subtitle">
                {{ $t("profilePurchases.previousSubtitle") }}
              </p>
            </div>
          </div>

          <q-expansion-item
            v-for="program in previousPrograms"
            :key="program.id"
            expand-separator
            class="program-expansion"
          >
            <template #header>
              <div class="expansion-header">
                <div class="expansion-icon">
                  <q-icon name="folder" size="24px" color="grey-6" />
                </div>
                <div class="expansion-content">
                  <div class="expansion-title">
                    {{ getCourseName(program.course) }}
                  </div>
                  <div class="expansion-meta">
                    <span>{{ program.course?.code }}</span>
                    <span class="separator">•</span>
                    <span
                      >{{ formatDateShort(program.enrolledAt) }} →
                      {{ formatDateShort(program.expiresAt) }}</span
                    >
                  </div>
                </div>
                <q-chip
                  :color="getStatusColor(program)"
                  text-color="white"
                  size="sm"
                >
                  {{ getStatusText(program) }}
                </q-chip>
              </div>
            </template>

            <div class="expansion-body">
              <div class="expansion-details">
                <div class="detail-row">
                  <span class="detail-label"
                    >{{ $t("profilePurchases.lessons") }}:</span
                  >
                  <span class="detail-value">{{
                    program.course?.lessonCount || 0
                  }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label"
                    >{{ $t("profilePurchases.duration") }}:</span
                  >
                  <span class="detail-value"
                    >{{ program.course?.lessonDuration || 0 }} min</span
                  >
                </div>
                <div class="detail-row">
                  <span class="detail-label"
                    >{{ $t("profilePurchases.status") }}:</span
                  >
                  <span class="detail-value">{{ getStatusText(program) }}</span>
                </div>
              </div>
              <q-btn
                flat
                color="primary"
                icon="visibility"
                :label="$t('profilePurchases.viewDetails')"
                @click="openDetailsDialog(program)"
                no-caps
              />
            </div>
          </q-expansion-item>
        </div>

      </div>
    </div>

    <!-- Details Dialog/Popup -->
    <q-dialog
      v-model="detailsDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="details-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-header-content">
            <q-icon name="school" size="40px" color="primary" />
            <div>
              <h3 class="dialog-title">
                {{ getCourseName(selectedProgram?.course) }}
              </h3>
              <p class="dialog-subtitle">
                {{ selectedProgram?.course?.code }}
              </p>
            </div>
          </div>
          <q-btn icon="close" flat round dense @click="detailsDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-body">
          <div class="dialog-section">
            <h4 class="dialog-section-title">
              {{ $t("profilePurchases.programInfo") }}
            </h4>
            <div class="dialog-grid">
              <div class="dialog-item">
                <q-icon name="event" size="20px" color="primary" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.startDate") }}
                  </div>
                  <div class="dialog-value">
                    {{ formatDate(selectedProgram?.enrolledAt) }}
                  </div>
                </div>
              </div>
              <div class="dialog-item">
                <q-icon name="event_busy" size="20px" color="orange" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.expiresOn") }}
                  </div>
                  <div class="dialog-value">
                    {{ formatDate(selectedProgram?.expiresAt) }}
                  </div>
                </div>
              </div>
              <div class="dialog-item">
                <q-icon name="schedule" size="20px" color="green" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.daysLeft") }}
                  </div>
                  <div class="dialog-value">
                    {{ getDaysLeft(selectedProgram?.expiresAt) }}
                    {{ $t("profilePurchases.days") }}
                  </div>
                </div>
              </div>
              <div class="dialog-item">
                <q-icon name="flag" size="20px" color="primary" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.status") }}
                  </div>
                  <div class="dialog-value">
                    {{ getStatusText(selectedProgram) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="dialog-section">
            <h4 class="dialog-section-title">
              {{ $t("profilePurchases.packageDetails") }}
            </h4>
            <div class="dialog-grid">
              <div class="dialog-item">
                <q-icon name="book" size="20px" color="purple" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.lessonsIncluded") }}
                  </div>
                  <div class="dialog-value">
                    {{ selectedProgram?.course?.lessonCount || 0 }}
                  </div>
                </div>
              </div>
              <div class="dialog-item">
                <q-icon name="timer" size="20px" color="blue" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.lessonDuration") }}
                  </div>
                  <div class="dialog-value">
                    {{ selectedProgram?.course?.lessonDuration || 0 }} min
                  </div>
                </div>
              </div>
              <div class="dialog-item">
                <q-icon name="category" size="20px" color="amber" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.courseType") }}
                  </div>
                  <div class="dialog-value">
                    {{ selectedProgram?.course?.type || '-' }}
                  </div>
                </div>
              </div>
              <div class="dialog-item">
                <q-icon name="euro" size="20px" color="green" />
                <div>
                  <div class="dialog-label">
                    {{ $t("profilePurchases.price") }}
                  </div>
                  <div class="dialog-value">
                    €{{ selectedProgram?.course?.coursePrice }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selectedProgram?.course?.description"
            class="dialog-section"
          >
            <h4 class="dialog-section-title">
              {{ $t("profilePurchases.description") }}
            </h4>
            <p class="dialog-description">
              {{ getCourseDescription(selectedProgram?.course) }}
            </p>
          </div>

          <!-- Progress -->
          <div
            v-if="selectedProgram && getDaysLeft(selectedProgram.expiresAt) > 0"
            class="dialog-section"
          >
            <h4 class="dialog-section-title">
              {{ $t("profilePurchases.progress") }}
            </h4>
            <div class="dialog-progress">
              <div class="progress-header">
                <span>{{ $t("profilePurchases.timeRemaining") }}</span>
                <span class="progress-percentage"
                  >{{ getProgressPercentage(selectedProgram) }}%</span
                >
              </div>
              <q-linear-progress
                :value="getProgressPercentage(selectedProgram) / 100"
                :color="getProgressColor(selectedProgram)"
                size="10px"
                rounded
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="dialog-actions">
          <q-btn
            flat
            :label="$t('profilePurchases.close')"
            color="grey-7"
            @click="detailsDialog = false"
            no-caps
          />
          <q-btn
            unelevated
            :label="$t('profilePurchases.startPractice')"
            color="primary"
            icon="play_arrow"
            @click="startPracticeFromDialog"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ProfileAndPurchasesPage",
  setup() {
    const $q = useQuasar();
    const { locale, t } = useI18n();
    const router = useRouter();

    const allPrograms = ref([]);
    const transactions = ref([]);
    const loading = ref(true);
    const detailsDialog = ref(false);
    const selectedProgram = ref(null);

    // Computed: Active Programs (from enrollments)
    const activePrograms = computed(() => {
      return allPrograms.value.filter((enrollment) => {
        // expiresAt is in the future
        if (!enrollment.expiresAt) return true;
        const daysLeft = getDaysLeft(enrollment.expiresAt);
        return daysLeft > 0;
      });
    });

    // Computed: Previous Programs (expired enrollments)
    const previousPrograms = computed(() => {
      return allPrograms.value.filter((enrollment) => {
        if (!enrollment.expiresAt) return false;
        const daysLeft = getDaysLeft(enrollment.expiresAt);
        return daysLeft <= 0;
      });
    });

    // Computed: Recent Transactions (last 5)
    const recentTransactions = computed(() => {
      return transactions.value.slice(0, 5);
    });

    // Computed: Counts
    const activeCount = computed(() => activePrograms.value.length);
    const previousCount = computed(() => previousPrograms.value.length);
    const totalTransactions = computed(() => transactions.value.length);

    async function fetchData() {
      try {
        loading.value = true;

        const [programsRes, transactionsRes] = await Promise.all([
          api.get("/exams/my-courses"),
          api.get("/exams/transactions"),
        ]);

        allPrograms.value = programsRes.data || [];
        transactions.value = transactionsRes.data || [];
      } catch (error) {
        console.error("Failed to fetch data:", error);
        $q.notify({
          type: "negative",
          message: t("profilePurchases.errorLoading"),
          position: "top",
        });
      } finally {
        loading.value = false;
      }
    }

    function getCourseName(course) {
      if (!course || !course.name) return "Course";
      if (typeof course.name === "object") {
        const currentLocale = locale.value || "nl";
        return (
          course.name[currentLocale] || course.name.nl || course.name.en || "Course"
        );
      }
      return course.name;
    }

    function getCourseDescription(course) {
      if (!course || !course.description) return "";
      if (typeof course.description === "object") {
        const currentLocale = locale.value || "nl";
        return (
          course.description[currentLocale] ||
          course.description.nl ||
          course.description.en ||
          ""
        );
      }
      return course.description;
    }

    function getPackageNameFromTx(tx) {
      if (!tx.packageName) return "Package";
      if (typeof tx.packageName === "object") {
        const currentLocale = locale.value || "nl";
        return (
          tx.packageName[currentLocale] ||
          tx.packageName.nl ||
          tx.packageName.en ||
          "Package"
        );
      }
      return tx.packageName;
    }

    function formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString(locale.value || "nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function formatDateShort(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString(locale.value || "nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
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

    function getProgressPercentage(program) {
      if (!program || !program.expiresAt) return 100;
      const start = new Date(program.enrolledAt);
      const end = new Date(program.expiresAt);
      const now = new Date();
      const total = end - start;
      const elapsed = now - start;
      const percentage = Math.min(Math.max((elapsed / total) * 100, 0), 100);
      return Math.round(100 - percentage);
    }

    function getProgressColor(program) {
      const percentage = getProgressPercentage(program);
      if (percentage > 50) return "positive";
      if (percentage > 20) return "warning";
      return "negative";
    }

    function getStatusColor(enrollment) {
      if (!enrollment) return "grey-6";
      const daysLeft = getDaysLeft(enrollment.expiresAt);
      if (daysLeft <= 0) {
        return "red-6";
      }
      if (daysLeft <= 30) return "orange-6";
      return "green-6";
    }

    function getStatusText(enrollment) {
      if (!enrollment) return "";
      const daysLeft = getDaysLeft(enrollment.expiresAt);
      if (daysLeft <= 0)
        return t("profilePurchases.statusExpired");
      if (daysLeft <= 30) return t("profilePurchases.statusExpiring");
      return t("profilePurchases.statusActive");
    }

    function getTransactionStatusText(status) {
      const textMap = {
        paid: t("profilePurchases.txPaid"),
        pending: t("profilePurchases.txPending"),
        failed: t("profilePurchases.txFailed"),
        cancelled: t("profilePurchases.txCancelled"),
        expired: t("profilePurchases.txExpired"),
      };
      return textMap[status] || status;
    }

    function openDetailsDialog(program) {
      selectedProgram.value = program;
      detailsDialog.value = true;
    }

    function startPractice(courseId) {
      if (courseId) {
        router.push({
          path: "/practice-exams",
          query: { courseId: courseId }
        });
      } else {
        router.push("/practice-exams");
      }
    }

    function startPracticeFromDialog() {
      detailsDialog.value = false;
      const courseId = selectedProgram.value?.course?.id;
      startPractice(courseId);
    }

    function goToPackages() {
      router.push("/packages");
    }

    function goToOrders() {
      router.push("/orders");
    }

    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      activePrograms,
      previousPrograms,
      transactions,
      recentTransactions,
      activeCount,
      previousCount,
      totalTransactions,
      detailsDialog,
      selectedProgram,
      getCourseName,
      getCourseDescription,
      getPackageNameFromTx,
      formatDate,
      formatDateShort,
      getDaysLeft,
      getProgressPercentage,
      getProgressColor,
      getStatusColor,
      getStatusText,
      getTransactionStatusText,
      openDetailsDialog,
      startPractice,
      startPracticeFromDialog,
      goToPackages,
      goToOrders,
    };
  },
});
</script>

<style scoped lang="scss">
.profile-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.card-surface {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  }
}

// Section Headers
.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px 0;
  letter-spacing: -0.01em;
}

.section-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.section-header-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding: 14px 16px 0 16px;
}

// Active Programs Grid
.active-programs-section {
  margin-bottom: 24px;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
  gap: 16px;
}

.program-card-modern {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #2b3bff 0%, #818cf8 100%);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

.program-card-content {
  padding: 20px;
  background: linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%);
}

.card-header-large {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 12px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.02em;
}

.package-code {
  font-size: 12px;
  color: #64748b;
  font-family: 'SF Mono', 'Monaco', monospace;
  margin: 2px 0 0 0;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .q-icon {
    font-size: 18px;
  }
}

.stat-label {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 2px;
  font-weight: 500;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.progress-section-large {
  margin-bottom: 0;
  padding: 14px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.progress-bar-large {
  height: 8px;
  border-radius: 4px;
}

.card-actions-large {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;

  .action-btn {
    flex: 1;
    min-width: 140px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    
    .q-icon {
      font-size: 16px;
    }
  }
}

// Summary Cards
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.summary-card {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .q-icon {
    font-size: 22px;
  }

  &.green {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
  }

  &.blue {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
  }

  &.purple {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.2);
  }
}

.summary-value {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.summary-label {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  font-weight: 500;
}

// Transactions Section
.transactions-section {
  margin-bottom: 20px;
}

.transactions-list {
  padding: 0 14px 14px 14px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
  background: #ffffff;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateX(2px);
  }
}

.tx-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .q-icon {
    font-size: 18px;
  }
}

.tx-details {
  flex: 1;
  min-width: 0;
}

.tx-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tx-date {
  font-size: 12px;
  color: #64748b;
}

.tx-amount {
  text-align: right;
  flex-shrink: 0;
}

.amount-value {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.tx-status-paid {
  background: #d1fae5;
  color: #065f46;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.tx-status-pending {
  background: #fef3c7;
  color: #92400e;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.tx-status-failed {
  background: #fee2e2;
  color: #991b1b;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

// Previous Programs
.previous-section {
  padding: 14px;
}

.program-expansion {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  ::v-deep .q-item {
    padding: 12px;
  }
}

.expansion-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.expansion-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .q-icon {
    font-size: 18px;
    color: #64748b;
  }
}

.expansion-content {
  flex: 1;
  min-width: 160px;
}

.expansion-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
  font-size: 14px;
}

.expansion-meta {
  font-size: 12px;
  color: #64748b;

  .separator {
    margin: 0 6px;
    opacity: 0.5;
  }
}

.expansion-body {
  padding: 12px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
}

.expansion-details {
  display: grid;
  gap: 6px;
}

.detail-row {
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.detail-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 13px;
}

// Details Dialog
.details-dialog {
  max-width: 560px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.dialog-subtitle {
  font-size: 12px;
  color: #64748b;
  font-family: 'SF Mono', 'Monaco', monospace;
  margin: 2px 0 0 0;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
}

.dialog-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.dialog-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 11px;
  color: #64748b;
}

.dialog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.dialog-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.dialog-label {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 3px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.dialog-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.dialog-description {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.dialog-progress {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.dialog-actions {
  padding: 14px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  
  .q-btn {
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 6px;
  }
}

.empty-state {
  text-align: center;
  padding: 30px 16px;
  color: #94a3b8;
  
  .q-icon {
    opacity: 0.5;
  }
  
  p {
    font-size: 14px;
    margin: 8px 0 0 0;
  }
}

// Tablet Styles (768px - 1024px)
@media (max-width: 1024px) {
  .profile-container {
    padding: 16px;
  }

  .programs-grid {
    grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
    gap: 14px;
  }

  .program-card-content {
    padding: 16px;
  }
  
  .header-text h3 {
    font-size: 18px;
  }

  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .summary-card {
    padding: 14px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .stat-item {
    padding: 10px;
  }

  .section-title {
    font-size: 17px;
  }

  .section-subtitle {
    font-size: 12px;
  }

  .transaction-item {
    padding: 10px;
  }

  .expansion-header {
    flex-wrap: wrap;
  }

  .details-dialog {
    max-width: 90%;
  }

  .dialog-header {
    padding: 16px;
  }

  .dialog-section {
    padding: 14px 16px;
  }
}

// Mobile Styles (< 768px)
@media (max-width: 768px) {
  .profile-container {
    padding: 12px;
  }

  .programs-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-subtitle {
    font-size: 11px;
  }

  .section-header-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px 0 12px;
  }

  .program-card-content {
    padding: 14px;
  }

  .card-header-large {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 10px;
  }

  .header-text h3 {
    font-size: 17px;
  }

  .package-code {
    font-size: 11px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .stat-item {
    padding: 10px 8px;
    gap: 8px;
  }

  .stat-icon {
    width: 32px;
    height: 32px;
    
    .q-icon {
      font-size: 16px;
    }
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-value {
    font-size: 14px;
  }

  .progress-section-large {
    padding: 12px;
  }

  .progress-label {
    font-size: 11px;
  }

  .progress-percentage {
    font-size: 14px;
  }

  .progress-bar-large {
    height: 6px;
  }

  .card-actions-large {
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
    
    .action-btn {
      width: 100%;
      padding: 10px 16px;
      font-size: 12px;
    }
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .summary-card {
    padding: 12px 14px;
    gap: 12px;
  }

  .summary-icon {
    width: 42px;
    height: 42px;
    
    .q-icon {
      font-size: 20px;
    }
  }

  .summary-value {
    font-size: 24px;
  }

  .summary-label {
    font-size: 11px;
  }

  .transactions-section {
    margin-bottom: 14px;
  }

  .transactions-list {
    padding: 0 10px 10px 10px;
  }

  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 8px;
  }

  .tx-icon {
    width: 32px;
    height: 32px;
    
    .q-icon {
      font-size: 16px;
    }
  }

  .tx-details {
    width: 100%;
  }

  .tx-name {
    font-size: 13px;
  }

  .tx-date {
    font-size: 11px;
  }

  .tx-amount {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .amount-value {
    font-size: 14px;
  }
  
  .tx-status-paid,
  .tx-status-pending,
  .tx-status-failed {
    font-size: 10px;
    padding: 2px 6px;
  }

  .previous-section {
    padding: 10px;
    margin-bottom: 14px;
  }

  .program-expansion {
    margin-bottom: 8px;
    
    ::v-deep .q-item {
      padding: 10px;
    }
  }

  .expansion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .expansion-icon {
    width: 32px;
    height: 32px;
    
    .q-icon {
      font-size: 16px;
    }
  }

  .expansion-title {
    font-size: 13px;
  }

  .expansion-meta {
    font-size: 11px;
    flex-wrap: wrap;
  }

  .expansion-body {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    gap: 10px;
  }

  .detail-row {
    gap: 8px;
  }

  .detail-label {
    font-size: 11px;
  }

  .detail-value {
    font-size: 12px;
  }

  .details-dialog {
    max-width: 96%;
    margin: 0 6px;
    border-radius: 10px;
  }

  .dialog-header {
    padding: 14px 16px;
  }

  .dialog-header-content {
    gap: 10px;
  }

  .dialog-title {
    font-size: 16px;
  }

  .dialog-subtitle {
    font-size: 11px;
  }

  .dialog-body {
    max-height: 70vh;
  }

  .dialog-section {
    padding: 12px 14px;
  }

  .dialog-section-title {
    font-size: 10px;
    margin-bottom: 10px;
  }

  .dialog-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .dialog-item {
    gap: 8px;
    padding: 8px;
  }

  .dialog-label {
    font-size: 10px;
  }

  .dialog-value {
    font-size: 12px;
  }

  .dialog-description {
    font-size: 12px;
  }

  .dialog-progress {
    padding: 10px;
  }

  .dialog-actions {
    padding: 12px 14px;
    flex-direction: column-reverse;
    gap: 8px;
    
    .q-btn {
      width: 100%;
      font-size: 12px;
      padding: 8px 14px;
    }
  }

  .empty-state {
    padding: 24px 14px;
    
    .q-icon {
      font-size: 48px;
    }
    
    p {
      font-size: 13px;
    }
  }

  .card-surface {
    border-radius: 10px;
  }
}

// Extra small mobile (< 480px)
@media (max-width: 480px) {
  .profile-container {
    padding: 10px;
  }

  .programs-grid {
    gap: 10px;
  }

  .program-card-content {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .stat-item {
    padding: 8px;
  }

  .summary-icon {
    width: 38px;
    height: 38px;
    
    .q-icon {
      font-size: 18px;
    }
  }

  .summary-value {
    font-size: 22px;
  }

  .summary-label {
    font-size: 10px;
  }

  .section-title {
    font-size: 15px;
  }

  .section-subtitle {
    font-size: 10px;
  }

  .card-header-large {
    gap: 8px;
    margin-bottom: 12px;
  }

  .header-text h3 {
    font-size: 16px;
  }

  .package-code {
    font-size: 10px;
  }
}
</style>


