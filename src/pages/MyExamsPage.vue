<template>
  <q-page class="home-bg">
    <div class="my-programs-container">
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="50px" />
        <p class="text-grey-6 q-mt-md">{{ $t('myPrograms.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="allPrograms.length === 0" class="empty-state card-surface">
        <q-icon name="school" size="80px" color="grey-4" />
        <h3>{{ $t('myPrograms.noPrograms') }}</h3>
        <p>{{ $t('myPrograms.noProgramsText') }}</p>
        <q-btn 
          color="primary" 
          :label="$t('myPrograms.browsePackages')" 
          @click="goToCourses"
          unelevated
          no-caps
        />
      </div>

      <!-- Programs Content -->
      <div v-else>
        <!-- Current/Active Programs Grid -->
        <div v-if="activePrograms.length > 0" class="info-grid">
          <div 
            v-for="program in activePrograms" 
            :key="program.id" 
            class="card card-surface"
          >
            <div class="card-title with-badge">
              <span>{{ getPackageName(program.course) }}</span>
              <q-chip 
                :color="getStatusColor(program)" 
                text-color="white" 
                size="sm"
              >
                {{ getStatusText(program) }}
              </q-chip>
            </div>
            
            <div class="package-body">
              <div class="row-line">
                <span class="muted">{{ $t('myPrograms.packageCode') }}</span>
                <span class="value">{{ program.course?.code || '-' }}</span>
              </div>
              <div class="row-line">
                <span class="muted">{{ $t('myPrograms.status') }}</span>
                <span class="value success">{{ getStatusText(program) }}</span>
              </div>
              <div class="row-line">
                <span class="muted">{{ $t('myPrograms.lessonsIncluded') }}</span>
                <span class="value">{{ program.course?.lessonCount || 0 }}</span>
              </div>
              <div class="row-line">
                <span class="muted">{{ $t('myPrograms.daysLeft') }}</span>
                <span class="value">{{ getDaysLeft(program.expiresAt) }} {{ $t('myPrograms.days') }}</span>
              </div>
            </div>

            <div class="row-actions">
              <q-btn 
                color="primary" 
                unelevated 
                no-caps 
                icon="visibility" 
                :label="$t('myPrograms.viewDetails')"
                @click="viewDetails(program.id)"
              />
              <q-btn 
                flat
                color="primary" 
                no-caps 
                icon="play_arrow" 
                :label="$t('myPrograms.startPractice')"
                @click="startPractice"
              />
            </div>
          </div>
        </div>

        <!-- Dates Section for First Active Program -->
        <div v-if="activePrograms.length > 0" class="card card-surface" style="margin-top: 18px;">
          <div class="card-title">{{ $t('myPrograms.programDates') }}</div>
          <div class="dates">
            <div class="date-item">
              <div class="icon-wrap">
                <q-icon name="event" size="18px" />
              </div>
              <div class="contents">
                <div class="label">{{ $t('myPrograms.startDate') }}</div>
                <div class="value">{{ formatDate(activePrograms[0].createdAt) }}</div>
              </div>
            </div>
            <div class="date-item">
              <div class="icon-wrap warning">
                <q-icon name="event_busy" size="18px" />
              </div>
              <div class="contents">
                <div class="label">{{ $t('myPrograms.expiresOn') }}</div>
                <div class="value">{{ formatDate(activePrograms[0].expiresAt) }}</div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #eef2f7;">
            <div class="row-line">
              <span class="muted">{{ $t('myPrograms.timeRemaining') }}</span>
              <span class="value">{{ getProgressPercentage(activePrograms[0]) }}%</span>
            </div>
            <q-linear-progress 
              :value="getProgressPercentage(activePrograms[0]) / 100" 
              :color="getProgressColor(activePrograms[0])"
              size="8px"
              rounded
              style="margin-top: 8px;"
            />
          </div>
        </div>

        <!-- Previous/Expired Programs -->
        <div v-if="previousPrograms.length > 0" class="previous-packages card-surface">
          <div class="card-title">{{ $t('myPrograms.previousPrograms') }}</div>
          <q-expansion-item
            v-for="program in previousPrograms"
            :key="program.id"
            expand-separator
            dense
            class="pkg-item"
          >
            <template #header>
              <div class="pkg-header">
                <div class="title">
                  <q-icon name="inventory_2" size="18px" />
                  <span>{{ getPackageName(program.course) }}</span>
                </div>
                <div class="meta">
                  <q-chip 
                    outline 
                    :color="getStatusColor(program)" 
                    size="sm"
                  >
                    {{ getStatusText(program) }}
                  </q-chip>
                  <span class="dates">
                    {{ formatDate(program.createdAt) }} → {{ formatDate(program.expiresAt) }}
                  </span>
                </div>
              </div>
            </template>

            <div class="pkg-body">
              <div class="rows">
                <div class="row">
                  <span class="label">{{ $t('myPrograms.packageCode') }}:</span>
                  <span class="value">{{ program.course?.code || '-' }}</span>
                </div>
                <div class="row">
                  <span class="label">{{ $t('myPrograms.lessons') }}:</span>
                  <span class="value">{{ program.course?.lessonCount || 0 }}</span>
                </div>
                <div class="row">
                  <span class="label">{{ $t('myPrograms.status') }}:</span>
                  <span class="value">{{ getStatusText(program) }}</span>
                </div>
              </div>
              <div class="actions">
                <q-btn 
                  flat 
                  color="primary" 
                  icon="visibility" 
                  no-caps 
                  :label="$t('myPrograms.viewDetails')"
                  @click="viewDetails(program.id)"
                />
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MyProgramsPage',
  setup() {
    const $q = useQuasar()
    const { locale, t } = useI18n()
    const router = useRouter()
    const allPrograms = ref([])
    const loading = ref(true)

    // Computed: Active Programs
    const activePrograms = computed(() => {
      return allPrograms.value.filter(program => {
        if (program.status === 'cancelled') return false
        if (!program.expiresAt) return true // No expiry = active
        const daysLeft = getDaysLeft(program.expiresAt)
        return daysLeft > 0
      })
    })

    // Computed: Previous/Expired Programs
    const previousPrograms = computed(() => {
      return allPrograms.value.filter(program => {
        if (program.status === 'cancelled') return true
        if (!program.expiresAt) return false
        const daysLeft = getDaysLeft(program.expiresAt)
        return daysLeft <= 0
      })
    })

    async function fetchPrograms() {
      try {
        loading.value = true
        const response = await api.get('/exams/me')
        allPrograms.value = response.data
      } catch (error) {
        console.error('Failed to fetch programs:', error)
        $q.notify({
          type: 'negative',
          message: t('myPrograms.errorLoading'),
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    }

    function getPackageName(pkg) {
      if (!pkg || !pkg.name) return 'Program'
      
      if (typeof pkg.name === 'object') {
        const currentLocale = locale.value || 'nl'
        return pkg.name[currentLocale] || pkg.name.nl || pkg.name.en || 'Program'
      }
      
      return pkg.name
    }

    function formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString(locale.value || 'nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    function getDaysLeft(expiresAt) {
      if (!expiresAt) return 0
      const now = new Date()
      const expiry = new Date(expiresAt)
      const diff = expiry - now
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      return days > 0 ? days : 0
    }

    function getProgressPercentage(program) {
      if (!program.expiresAt) return 100
      
      const start = new Date(program.createdAt)
      const end = new Date(program.expiresAt)
      const now = new Date()
      
      const total = end - start
      const elapsed = now - start
      const percentage = Math.min(Math.max((elapsed / total) * 100, 0), 100)
      
      return Math.round(100 - percentage)
    }

    function getProgressColor(program) {
      const percentage = getProgressPercentage(program)
      if (percentage > 50) return 'positive'
      if (percentage > 20) return 'warning'
      return 'negative'
    }

    function getStatusColor(program) {
      const daysLeft = getDaysLeft(program.expiresAt)
      if (program.status === 'expired' || program.status === 'cancelled' || daysLeft <= 0) {
        return 'red-6'
      }
      if (daysLeft <= 30) return 'orange-6'
      return 'green-6'
    }

    function getStatusText(program) {
      const daysLeft = getDaysLeft(program.expiresAt)
      if (program.status === 'cancelled') return t('myPrograms.statusCancelled')
      if (program.status === 'expired' || daysLeft <= 0) return t('myPrograms.statusExpired')
      if (daysLeft <= 30) return t('myPrograms.statusExpiring')
      return t('myPrograms.statusActive')
    }

    function viewDetails(programId) {
      router.push(`/my-exams/${programId}`)
    }

    function startPractice() {
      router.push('/practice-exams')
    }

    function goToCourses() {
      router.push('/courses')
    }

    onMounted(() => {
      fetchPrograms()
    })

    return {
      allPrograms,
      activePrograms,
      previousPrograms,
      loading,
      getPackageName,
      formatDate,
      getDaysLeft,
      getProgressPercentage,
      getProgressColor,
      getStatusColor,
      getStatusText,
      viewDetails,
      startPractice,
      goToCourses
    }
  }
})
</script>

<style scoped lang="scss">
.my-programs-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}

.card-surface {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  border-top: 5px solid #2b3bff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.card {
  padding: 16px;
}

.card-title {
  font-weight: 800;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #0f172a;
}

.card-title.with-badge {
  justify-content: space-between;
}

.package-body .row-line {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eef2f7;
}

.package-body .row-line:last-child {
  border-bottom: none;
}

.package-body .muted {
  color: #667085;
  font-size: 14px;
}

.package-body .value {
  font-weight: 700;
  color: #0f172a;
}

.package-body .value.success {
  color: #16a34a;
}

.row-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.date-item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #eef2f7;
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.date-item .label {
  color: #667085;
  font-size: 13px;
}

.date-item .value {
  font-weight: 700;
  color: #0f172a;
  font-size: 14px;
}

.date-item .icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef4ff;
  color: #1d4ed8;
}

.date-item .icon-wrap.warning {
  background: #fff7ed;
  color: #c2410c;
}

.previous-packages {
  padding: 16px;
  margin-top: 18px;
}

.pkg-item.q-expansion-item {
  border: 1px solid #eef2f7;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}

.pkg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px;
  flex-wrap: wrap;
}

.pkg-header .title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #0f172a;
}

.pkg-header .meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

.pkg-header .dates {
  font-size: 13px;
}

.pkg-body {
  padding: 10px 14px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.pkg-body .rows {
  display: grid;
  gap: 6px;
}

.pkg-body .row {
  display: flex;
  gap: 10px;
}

.pkg-body .row .label {
  color: #667085;
  font-size: 14px;
}

.pkg-body .row .value {
  font-weight: 700;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin: 16px 0 8px 0;
  }
  
  p {
    font-size: 16px;
    color: #64748b;
    margin-bottom: 24px;
  }
}

@media (max-width: 768px) {
  .my-programs-container {
    padding: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .dates {
    grid-template-columns: 1fr;
  }

  .pkg-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .pkg-body {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
