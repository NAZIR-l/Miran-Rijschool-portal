<template>
  <q-page class="home-bg">
    <div class="dashboard">
      <div class="dashboard-grid three">
        <!-- Greeting -->
        <div class="dash-card greeting-card d-col-12">
          <div class="greeting-inner">
            <div class="copy">
              <div class="eyebrow">{{ $t('dashboard.welcome_back') }}</div>
              <h2 class="headline">{{ username }}!</h2>
              <div class="sub">{{ $t('dashboard.ready') }}</div>
              <div class="actions">
                <q-btn color="primary" unelevated no-caps icon="play_arrow" :label="$t('dashboard.btn_continue')" class="" @click="goto('/practice-exams')" />
                <q-btn outline color="primary" no-caps icon="menu_book" :label="$t('dashboard.btn_browse')" @click="goto('/downloads')" />
              </div>
            </div>
            <div class="art">
              <img src="../assets/Logo-test1.png" alt="art" />
            </div>
          </div>
        </div>

        <!-- Overview -->
        <!-- <div class="dash-card overview-card d-col-6">
          <div class="card-title with-badge">
            <span>{{ $t('dashboard.overview') }}</span>
            <q-chip color="green-6" text-color="white" size="sm">{{ currentPackage.name }}</q-chip>
          </div>
          <div class="overview-rows">
            <div class="row-line">
              <span class="muted">{{ $t('dashboard.days_left') }}</span>
              <span class="value">{{ daysLeft }} {{ $t('dashboard.days') }}</span>
            </div>
            <div class="row-line">
              <span class="muted">{{ $t('dashboard.expires') }}</span>
              <span class="value">{{ currentPackage.expires }}</span>
            </div>
          </div>
          <div class="quick-links">
            <q-btn flat color="primary" no-caps icon="download" :label="$t('dashboard.quick_downloads')" @click="goto('/downloads')" />
            <q-btn flat color="primary" no-caps icon="person" :label="$t('dashboard.quick_account')" @click="goto('/profile-purchases')" />
            <q-btn flat color="primary" no-caps icon="receipt" :label="$t('dashboard.quick_orders')" @click="goto('/orders')" />
          </div>
        </div> -->

        <!-- 7-Day Activity Chart -->
        <div class="dash-card activity-card d-col-12">
          <div class="card-title-section">
            <div class="title-with-icon">
              <q-icon name="bar_chart" size="24px" color="primary" />
              <div class="card-title">{{ $t('dashboard.activity_7days') }}</div>
            </div>
            <div class="activity-summary">
              <div class="summary-item success-item">
                <q-icon name="check_circle" size="18px" />
                <span>{{ activityData.summary.totalPassed }} {{ $t('dashboard.passed') }}</span>
              </div>
              <div class="summary-item danger-item">
                <q-icon name="cancel" size="18px" />
                <span>{{ activityData.summary.totalFailed }} {{ $t('dashboard.failed') }}</span>
              </div>
              <div class="summary-item info-item">
                <q-icon name="percent" size="18px" />
                <span>{{ activityData.summary.successRate }}% {{ $t('dashboard.success_rate') }}</span>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="chart-container">
            <div class="chart-bars">
              <div
                v-for="(day, index) in activityData.dailyStats"
                :key="index"
                class="chart-day"
              >
                <div class="bar-group">
                  <div
                    class="bar bar-passed"
                    :style="{ height: getBarHeight(day.passed) }"
                    v-if="day.passed > 0"
                  >
                    <q-tooltip>{{ day.passed }} {{ $t('dashboard.passed') }}</q-tooltip>
                  </div>
                  <div
                    class="bar bar-failed"
                    :style="{ height: getBarHeight(day.failed) }"
                    v-if="day.failed > 0"
                  >
                    <q-tooltip>{{ day.failed }} {{ $t('dashboard.failed') }}</q-tooltip>
                  </div>
                </div>
                <div class="day-label">{{ formatDayLabel(day.date) }}</div>
              </div>
            </div>

            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color passed-color"></div>
                <span>{{ $t('dashboard.passed') }}</span>
              </div>
              <div class="legend-item">
                <div class="legend-color failed-color"></div>
                <span>{{ $t('dashboard.failed') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div class="dash-card progress-card d-col-12">
          <div class="progress-header">
            <div class="progress-title-section">
              <q-icon name="analytics" size="28px" color="primary" class="progress-icon" />
              <div>
          <div class="card-title">{{ $t('dashboard.progress') }}</div>
                <div class="progress-subtitle">{{ $t('dashboard.exams_passed') }}</div>
              </div>
            </div>

            <!-- Course Selector (if multiple courses) -->
            <div v-if="userCourses.length > 1" class="course-selector">
              <q-select
                v-model="selectedCourseId"
                :options="courseOptions"
                :label="$t('dashboard.select_course')"
                dense
                outlined
                emit-value
                map-options
                @update:model-value="() => { fetchStatistics(); fetchActivityData(); }"
                class="professional-select"
              >
                <template v-slot:prepend>
                  <q-icon name="school" />
                </template>
              </q-select>
            </div>
          </div>

          <!-- Main Progress Display -->
          <div class="progress-main">
            <div class="progress-circle-wrapper">
              <q-circular-progress
                :value="progressPercent"
                size="140px"
                :thickness="0.12"
                color="primary"
                track-color="grey-3"
                class="progress-circle"
                show-value
              >
                <div class="progress-circle-content">
                  <div class="circle-percent">{{ progressPercent }}%</div>
                  <div class="circle-label">{{ $t('dashboard.complete') }}</div>
                </div>
              </q-circular-progress>
            </div>

            <!-- Statistics Grid -->
            <div class="stats-grid">
              <div class="stat-card stat-passed">
                <div class="stat-icon-wrapper success">
                  <q-icon name="check_circle" size="24px" />
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ statistics.passedExams }}</div>
                  <div class="stat-label">{{ $t('dashboard.passed') }}</div>
                </div>
              </div>

              <div class="stat-card stat-failed">
                <div class="stat-icon-wrapper danger">
                  <q-icon name="cancel" size="24px" />
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ statistics.failedExams }}</div>
                  <div class="stat-label">{{ $t('dashboard.failed') }}</div>
                </div>
              </div>

              <div class="stat-card stat-remaining">
                <div class="stat-icon-wrapper warning">
                  <q-icon name="pending_actions" size="24px" />
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ statistics.totalExams - statistics.passedExams }}</div>
                  <div class="stat-label">{{ $t('dashboard.remaining') }}</div>
                </div>
              </div>

              <div class="stat-card stat-total">
                <div class="stat-icon-wrapper primary">
                  <q-icon name="assignment" size="24px" />
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ statistics.totalExams }}</div>
                  <div class="stat-label">{{ $t('dashboard.total_exams') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="progress-bar-section">
            <div class="progress-bar-header">
              <span class="progress-bar-label">{{ $t('dashboard.overall_progress') }}</span>
              <span class="progress-bar-value">{{ statistics.passedExams }}/{{ statistics.totalExams }} {{ $t('dashboard.exams') }}</span>
            </div>
            <q-linear-progress
              :value="practiceProgress"
              size="12px"
              color="primary"
              track-color="grey-3"
              rounded
              class="professional-progress-bar"
            />
          </div>

          <!-- Motivational Message -->
          <div class="motivation-message" v-if="progressPercent < 100">
            <q-icon name="emoji_events" size="20px" color="amber-7" />
            <span>{{ $t('dashboard.hint') }}</span>
          </div>
          <div class="motivation-message success" v-else>
            <q-icon name="celebration" size="20px" color="positive" />
            <span>{{ $t('dashboard.completed_all') }}</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>

</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const router = useRouter();
    const { locale } = useI18n();
    const username = ref("");

    // User courses
    const userCourses = ref([]);
    const selectedCourseId = ref(null);

    // Statistics
    const statistics = ref({
      courseId: null,
      courseName: null,
      totalExams: 0,
      passedExams: 0,
      failedExams: 0,
      attemptedExams: 0,
      progress: 0
    });

    // 7-Day Activity Data
    const activityData = ref({
      dailyStats: [],
      summary: {
        totalAttempts: 0,
        totalPassed: 0,
        totalFailed: 0,
        successRate: 0
      }
    });

    const practiceProgress = computed(() => {
      if (statistics.value.totalExams === 0) return 0;
      return statistics.value.passedExams / statistics.value.totalExams;
    });

    const progressPercent = computed(() => statistics.value.progress);

    const courseOptions = computed(() => {
      return userCourses.value.map(course => {
        const courseName = course.course?.name;
        let label = 'Course';

        if (typeof courseName === 'object' && courseName !== null) {
          label = courseName[locale.value] || courseName.nl || courseName.en || 'Course';
        } else if (typeof courseName === 'string') {
          label = courseName;
        }

        return {
          label: label,
          value: course.course?.id
        };
      });
    });

    const currentPackage = ref({ name: '-', expires: '-', daysUsed: 0, totalDays: 0 })
    const myPrograms = ref([])
    const daysLeft = computed(() => {
      const total = currentPackage.value.totalDays || 0;
      const used = currentPackage.value.daysUsed || 0;
      const left = Math.max(total - used, 0);
      return left;
    });

    function goto(path){
      try { router.push(path); } catch(e) {}
    }

    async function fetchUserCourses() {
      try {
        const response = await api.get('/exams/my-courses');
        userCourses.value = response.data || [];

        // Set the first course as selected by default
        if (userCourses.value.length > 0) {
          selectedCourseId.value = userCourses.value[0].course?.id;
        }
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
      }
    }

    async function fetchStatistics() {
      try {
        const params = selectedCourseId.value
          ? { courseId: selectedCourseId.value }
          : {};

        const response = await api.get('/exams/statistics', { params });
        statistics.value = response.data;
      } catch (error) {
        console.error('Failed to fetch exam statistics:', error);
      }
    }

    async function fetchActivityData() {
      try {
        const params = selectedCourseId.value
          ? { courseId: selectedCourseId.value }
          : {};

        const response = await api.get('/exams/activity/7days', { params });
        activityData.value = response.data;
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        // Set default empty data
        activityData.value = {
          dailyStats: Array(7).fill(null).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toISOString().split('T')[0],
              total: 0,
              passed: 0,
              failed: 0
            };
          }),
          summary: {
            totalAttempts: 0,
            totalPassed: 0,
            totalFailed: 0,
            successRate: 0
          }
        };
      }
    }

    function getBarHeight(value) {
      if (!activityData.value.dailyStats.length) return '0px';

      const maxValue = Math.max(
        ...activityData.value.dailyStats.map(day => Math.max(day.passed, day.failed)),
        1
      );

      const height = (value / maxValue) * 120;
      return `${height}px`;
    }

    function formatDayLabel(dateString) {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);

      if (dateToCheck.getTime() === today.getTime()) {
        return locale.value === 'nl' ? 'Vandaag' : locale.value === 'ar' ? 'اليوم' : 'Today';
      } else if (dateToCheck.getTime() === yesterday.getTime()) {
        return locale.value === 'nl' ? 'Gisteren' : locale.value === 'ar' ? 'أمس' : 'Yesterday';
      } else {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysNL = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
        const daysAR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

        const dayIndex = date.getDay();
        if (locale.value === 'nl') return daysNL[dayIndex];
        if (locale.value === 'ar') return daysAR[dayIndex];
        return days[dayIndex];
      }
    }

    onMounted(async () => {
      // Fetch user info
      try {
        const res = await api.get('/auth/me');
        const user = res?.data;
        if (user && (user.firstName || user.lastName)) {
          const first = user.firstName || '';
          const last = user.lastName || '';
          username.value = `${first} ${last}`.trim();
        } else if (user?.email) {
          username.value = user.email;
        } else {
          username.value = 'User';
        }
      } catch (e) {
        console.error('Failed to fetch user:', e);
      }

      // Fetch user courses, statistics, and activity data
      await fetchUserCourses();
      await fetchStatistics();
      await fetchActivityData();

      // Legacy programs fetch (for compatibility)
      try {
        const res2 = await api.get('/exams/me/list')
        myPrograms.value = res2?.data || []
        if (myPrograms.value.length > 0) {
          const first = myPrograms.value[0]
          currentPackage.value.name = first.name || 'program'
          currentPackage.value.expires = '-'
          currentPackage.value.daysUsed = 0
          currentPackage.value.totalDays = 0
        }
      } catch (_) {}
    });

    return {
      username,
      statistics,
      activityData,
      practiceProgress,
      progressPercent,
      currentPackage,
      daysLeft,
      goto,
      myPrograms,
      userCourses,
      selectedCourseId,
      courseOptions,
      fetchStatistics,
      fetchActivityData,
      getBarHeight,
      formatDayLabel
    };
  },
});
</script>

<style scoped lang="scss">
@import '../css/dashboard.scss';

/* Professional Progress Card Enhancements */
.progress-card {
  padding: 24px !important;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.progress-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-icon {
  background: linear-gradient(135deg, #e8f0ff, #f0f7ff);
  padding: 10px;
  border-radius: 12px;
}

.progress-subtitle {
  color: #64748b;
  font-size: 13px;
  margin-top: 2px;
}

.course-selector {
  min-width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.professional-select {
  background: #f8fafc;
  border-radius: 8px;
}

/* Main Progress Section */
.progress-main {
  display: flex;
  gap: 32px;
  margin-bottom: 28px;
  align-items: center;

  @media (max-width: 968px) {
    flex-direction: column;
  }
}

.progress-circle-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.progress-circle-content {
  text-align: center;
}

.circle-percent {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.circle-label {
  font-size: 8px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
  font-weight: 600;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  flex: 1;

  @media (max-width: 968px) {
    width: 100%;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.success {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #059669;
  }

  &.danger {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #dc2626;
  }

  &.info {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #2563eb;
  }

  &.warning {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #d97706;
  }

  &.primary {
    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
    color: #4f46e5;
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Progress Bar Section */
.progress-bar-section {
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  margin-bottom: 20px;
}

.progress-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-bar-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progress-bar-value {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.professional-progress-bar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Motivational Message */
.motivation-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fef3c7, #fef9c3);
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  color: #92400e;
  font-size: 14px;
  font-weight: 600;

  &.success {
    background: linear-gradient(135deg, #d1fae5, #dcfce7);
    border-left-color: #10b981;
    color: #065f46;
  }
}

/* Activity Chart Styles */
.activity-card {
  padding: 24px !important;
}

.card-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-summary {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;

  &.success-item {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #059669;
  }

  &.danger-item {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #dc2626;
  }

  &.info-item {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #2563eb;
  }
}

.chart-container {
  margin-top: 20px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 8px;
  height: 160px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  margin-bottom: 16px;
}

.chart-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-group {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 120px;
  width: 100%;
  justify-content: center;
}

.bar {
  width: 100%;
  max-width: 30px;
  min-height: 4px;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &.bar-passed {
    background: linear-gradient(180deg, #10b981, #059669);
  }

  &.bar-failed {
    background: linear-gradient(180deg, #ef4444, #dc2626);
  }
}

.day-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;

  &.passed-color {
    background: linear-gradient(135deg, #10b981, #059669);
  }

  &.failed-color {
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-card,
.activity-card {
  animation: fadeInUp 0.5s ease-out;
}

.stat-card {
  animation: fadeInUp 0.5s ease-out;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
}

.chart-day {
  animation: fadeInUp 0.5s ease-out;

  @for $i from 1 through 7 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .activity-summary {
    width: 100%;

    .summary-item {
      flex: 1;
      justify-content: center;
    }
  }

  .chart-bars {
    gap: 4px;
    padding: 15px 10px;
  }

  .bar {
    max-width: 20px;
  }

  .day-label {
    font-size: 10px;
  }
}
</style>