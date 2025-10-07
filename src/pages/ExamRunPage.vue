<template>
  <q-page class="exam-run-page q-page-container">
    <!-- Header -->
    <header class="exam-header">
      <div class="header-content">
        <div class="header-left">
          <img src="../assets/Logo-test1.png" alt="Logo" class="header-logo" />
        </div>

        <div class="header-center">
          <div class="timer-container">
            <q-icon name="schedule" class="timer-icon" />
            <div class="timer-content">
              <div class="timer-label">{{ $t('exam_run.time_left') }}</div>
              <div class="timer-value" :class="{ 'warning': remaining < 300 }">
                {{ formattedTime }}
              </div>
            </div>
          </div>
        </div>

        <div class="header-right">
          <q-btn
            flat
            round
            dense
            icon="flag"
            class="action-btn"
            :color="isFlagged ? 'amber' : 'grey'"
            @click="toggleFlag"
          >
            <q-tooltip>{{ $t('exam_run.mark') }}</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="grid_view" class="action-btn" @click="showOverview = true">
            <q-tooltip>{{ $t('exam_run.overview') }}</q-tooltip>
          </q-btn>
          <q-btn flat round dense icon="logout" class="action-btn exit-btn" @click="askExit">
            <q-tooltip>{{ $t('exam_intro.exit_tooltip') }}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </header>

    <!-- Progress -->
    <div class="progress-section">
      <div class="progress-container">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          {{ $t('exam_run.progress_of', { current: indexDisplay, total: questions.length }) }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="exam-main">
      <div class="content-wrapper">
        <div class="side-by-side-content">
          <!-- Visual Section (Left) -->
          <div class="visual-section">
            <div class="visual-card">
              <q-img
                :src="currentImage"
                ratio="16/9"
                class="visual-image"
                :placeholder-src="placeholderImage"
              >
                <template v-slot:error>
                  <div class="image-error">
                    <q-icon name="image" size="xl" />
                    <div>{{ $t('exam_run.image_not_available') }}</div>
                    <div class="image-debug" v-if="current.rawImage">
                      Path: {{ current.rawImage }}<br>
                      Exam: {{ examId }}<br>
                      Resolved: {{ currentImage }}
                    </div>
                  </div>
                </template>
              </q-img>
              <div class="image-caption" v-if="current.imageCaption">
                {{ current.imageCaption }}
              </div>
            </div>
          </div>

          <!-- Question Section (Right) -->
          <div class="question-section">
            <div class="question-card">
              <div class="question-header">
                <div class="question-meta">
                  <span class="question-number">{{ $t('exam_run.question') }} {{ indexDisplay }}</span>
                  <div class="question-actions">
                    <q-btn
                      flat
                      round
                      dense
                      icon="flag"
                      size="sm"
                      :color="isFlagged ? 'amber' : 'grey-5'"
                      @click="toggleFlag"
                    >
                      <q-tooltip>{{ $t('exam_run.mark') }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="question-text">
                  {{ current.text }}
                </div>
              </div>

              <!-- Options -->
              <div class="options-section">
                <q-option-group
                  v-model="selected"
                  :options="optionGroup"
                  type="radio"
                  color="primary"
                  class="custom-option-group"
                />
              </div>

              <!-- Navigation -->
              <div class="navigation-section">
                <div class="navigation-buttons">
                  <q-btn
                    v-if="index > 0"
                    outline
                    color="primary"
                    no-caps
                    icon="arrow_back"
                    class="nav-btn prev-btn"
                    @click="previous"
                  >
                    {{ $t('exam_run.previous') }}
                  </q-btn>

                  <div class="spacer"></div>

                  <q-btn
                    color="primary"
                    unelevated
                    no-caps
                    class="nav-btn next-btn"
                    :icon="isLastQuestion ? 'check' : 'arrow_forward'"
                    @click="next"
                    :disabled="!selected"
                  >
                    {{ isLastQuestion ? $t('exam_run.finish') : $t('exam_run.next') }}
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Overview Dialog -->
    <q-dialog v-model="showOverview" position="right" full-height>
      <q-card class="overview-dialog">
        <q-card-section class="overview-header">
          <div class="overview-title">{{ $t('exam_run.overview_title') }}</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="overview-content">
          <div class="questions-grid">
            <div
              v-for="(answer, idx) in answers"
              :key="idx"
              class="question-indicator"
              :class="{
                'answered': answer !== null,
                'current': idx === index,
                'flagged': flaggedQuestions.has(idx)
              }"
              @click="goToQuestion(idx)"
            >
              {{ idx + 1 }}
            </div>
          </div>
        </q-card-section>

        <q-card-section class="overview-footer">
          <div class="overview-legend">
            <div class="legend-item">
              <div class="legend-color current"></div>
              <span>{{ $t('exam_run.overview_current') }}</span>
            </div>
            <div class="legend-item">
              <div class="legend-color answered"></div>
              <span>{{ $t('exam_run.overview_answered') }}</span>
            </div>
            <div class="legend-item">
              <div class="legend-color flagged"></div>
              <span>{{ $t('exam_run.overview_flagged') }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Exit Dialog -->
    <q-dialog v-model="exitConfirm" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <q-icon name="help_outline" color="primary" size="lg" />
          <h3 class="dialog-title">{{ $t('exam_run.exit.title') }}</h3>
        </q-card-section>

        <q-card-section class="dialog-content">
          <p>{{ $t('exam_run.exit.message') }}</p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn flat no-caps class="cancel-btn" @click="exitConfirm = false">
            {{ $t('exam_run.exit.continue') }}
          </q-btn>
          <q-btn color="primary" unelevated no-caps class="confirm-btn" @click="exit">
            {{ $t('exam_run.exit.stop') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// استيراد جميع الصور من مجلد assets
const assetsCtx = require.context('../assets', true, /\.(png|jpe?g|webp|svg|gif)$/)
const examsCtx = require.context('../data/exams', false, /\.json$/)

// دالة محسنة لحل مسارات الصور لجميع الامتحانات
function resolveAsset(inputPath, examId) {
  try {
    if (!inputPath) {
      console.log('❌ No input path provided for exam', examId)
      return ''
    }

    console.log('🔍 Resolving asset for exam', examId, 'path:', inputPath)

    const raw = String(inputPath).trim().replace(/\\/g, '/')

    // استخراج اسم الملف من المسار
    // من "exam1/q1.png" نأخذ "q1.png"
    const fileName = raw.split('/').pop()
    console.log('📄 Extracted filename:', fileName)

    // الحصول على جميع الملفات المتاحة
    const allAssets = assetsCtx.keys()
    console.log('📂 Total assets available:', allAssets.length)

    // البحث عن الملف المناسب
    let foundAsset = null

    // الطريقة 1: البحث بالمسار الكامل المتوقع
    const expectedPath = `./exam${examId}/${fileName}`
    foundAsset = allAssets.find(path => path === expectedPath)

    // الطريقة 2: البحث باسم الملف في مجلد exam المطلوب
    if (!foundAsset) {
      foundAsset = allAssets.find(path =>
        path.includes(fileName) && path.includes(`exam${examId}`)
      )
    }

    // الطريقة 3: البحث باسم الملف فقط (كحل أخير)
    if (!foundAsset) {
      foundAsset = allAssets.find(path => path.includes(fileName))
    }

    // الطريقة 4: عرض جميع الملفات المتاحة لهذا الامتحان للمساعدة
    const examAssets = allAssets.filter(path => path.includes(`exam${examId}`))
    console.log(`📁 Available assets for exam ${examId}:`, examAssets)

    if (foundAsset) {
      console.log('✅ Asset found at:', foundAsset)
      try {
        const mod = assetsCtx(foundAsset)
        const result = mod && mod.default ? mod.default : mod
        console.log('✅ Asset loaded successfully')
        return result
      } catch (e) {
        console.error('❌ Error loading asset:', e)
        return ''
      }
    } else {
      console.warn('❌ Asset not found:', fileName)
      console.log('💡 Tried to find in exam:', examId)
      console.log('💡 Available exam assets:', examAssets)
      return ''
    }
  } catch (e) {
    console.error('❌ Asset resolution error for', inputPath, e)
    return ''
  }
}

function loadExamDataById(id) {
  try {
    const file = `./exam${id}.json`
    console.log('📁 Loading exam file:', file)
    const mod = examsCtx(file)
    return mod && mod.default ? mod.default : mod
  } catch (e) {
    console.error('❌ Error loading exam:', e)
    try {
      const fallback = examsCtx('./exam1.json')
      return fallback && fallback.default ? fallback.default : fallback
    } catch (_) {
      return { questions: [] }
    }
  }
}

export default defineComponent({
  name: 'ExamRunPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const examId = route.params.id

    console.log('🚀 Starting exam:', examId)

    // تحميل بيانات الامتحان
    const data = loadExamDataById(examId)
    console.log('📊 Loaded exam data:', data)

    const raw = (data && data.questions ? data.questions : []).slice(0, 50)

    // معالجة الأسئلة مع حل مسارات الصور
    const questions = ref(
      raw.map((q, index) => {
        console.log(`🔄 Processing question ${index + 1} for exam ${examId}`)

        const resolvedImage = q.image ? resolveAsset(q.image, examId) : ''

        console.log(`✅ Question ${index + 1} result:`, {
          original: q.image,
          resolved: resolvedImage,
          type: typeof resolvedImage
        })

        return {
          ...q,
          rawImage: q.image || '',
          image: resolvedImage
        }
      })
    )

    console.log('🎯 Final processed questions for exam', examId, ':', questions.value)

    // State management
    function getDefaultSelection(question) {
      if (question && question.type === 'multi') return []
      return null
    }

    const index = ref(0)
    const selected = ref(getDefaultSelection(raw[0] || null))
    const answers = ref(questions.value.map(() => null))
    const flaggedQuestions = ref(new Set())
    const showOverview = ref(false)
    const exitConfirm = ref(false)

    // Computed properties
    const current = computed(() => {
      const question = questions.value[index.value] || {
        id: '',
        rawImage: '',
        image: '',
        text: '',
        options: [],
        imageCaption: ''
      }

      console.log('🎯 Current question:', {
        index: index.value,
        exam: examId,
        rawImage: question.rawImage,
        image: question.image,
        hasImage: !!question.image
      })

      return question
    })

    const currentImage = computed(() => {
      const img = current.value.image
      console.log('🖼️ Current image for exam', examId, ':', {
        value: img,
        type: typeof img,
        exists: !!img
      })
      return img
    })

    const optionGroup = computed(() => current.value.options.map(o => ({ label: o.label, value: o.id })))
    const indexDisplay = computed(() => index.value + 1)
    const isLastQuestion = computed(() => index.value === questions.value.length - 1)
    const progressPercentage = computed(() => ((index.value + 1) / questions.value.length) * 100)
    const isFlagged = computed(() => flaggedQuestions.value.has(index.value))

    // Timer (30 min)
    const remaining = ref(30 * 60)
    let timer
    onMounted(() => {
      timer = setInterval(() => {
        remaining.value = Math.max(remaining.value - 1, 0)
        if (remaining.value === 0) {
          autoSubmit()
        }
      }, 1000)

      // تسجيل معلومات إضافية بعد التحميل
      setTimeout(() => {
        console.log('🔍 Post-mount check for exam', examId)
        console.log('🖼️ First question image:', currentImage.value)
      }, 500)
    })

    onBeforeUnmount(() => {
      if (timer) clearInterval(timer)
    })

    const formattedTime = computed(() => {
      const m = Math.floor(remaining.value / 60).toString().padStart(2, '0')
      const s = (remaining.value % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    })

    // Placeholder image
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTEwQzE2MCAxMjMuODA3IDE0OC44MDcgMTM1IDEzNSAxMzVDMTIxLjE5MyAxMzUgMTEwIDEyMy44MDcgMTEwIDExMEMxMTAgOTYuMTkzMiAxMjEuMTkzIDg1IDEzNSA4NUMxNDguODA3IDg1IDE2MCA5Ni4xOTMyIDE2MCAxMTBaIiBmaWxsPSIjRDhEOEQ4Ii8+CjxwYXRoIGQ9Ik0yMDAgNzVIMzAwVjE2NUgyMDBWNzVaIiBmaWxsPSIjRDhEOEQ4Ii8+Cjwvc3ZnPgo='

    // Methods
    function next() {
      if (questions.value.length === 0) return
      answers.value[index.value] = selected.value
      if (index.value < questions.value.length - 1) {
        index.value += 1
        selected.value = (answers.value[index.value] !== null && answers.value[index.value] !== undefined)
          ? answers.value[index.value]
          : getDefaultSelection(questions.value[index.value])
      } else {
        submitExam()
      }
    }

    function previous() {
      if (index.value > 0) {
        answers.value[index.value] = selected.value
        index.value -= 1
        selected.value = (answers.value[index.value] !== null && answers.value[index.value] !== undefined)
          ? answers.value[index.value]
          : getDefaultSelection(questions.value[index.value])
      }
    }

    function goToQuestion(questionIndex) {
      answers.value[index.value] = selected.value
      index.value = questionIndex
      selected.value = (answers.value[index.value] !== null && answers.value[index.value] !== undefined)
        ? answers.value[index.value]
        : getDefaultSelection(questions.value[index.value])
      showOverview.value = false
    }

    function toggleFlag() {
      if (flaggedQuestions.value.has(index.value)) {
        flaggedQuestions.value.delete(index.value)
      } else {
        flaggedQuestions.value.add(index.value)
      }
    }

    function askExit() {
      exitConfirm.value = true
    }

    function exit() {
      try {
        router.back()
      } catch (e) {
        console.error('Exit error:', e)
      }
    }

    function autoSubmit() {
      submitExam()
    }

    function submitExam() {
      console.log('📝 Examen submitted for exam', examId, ':', answers.value)
      router.push(`/exam/${examId}/results`)
    }

    return {
      examId,
      questions,
      index,
      current,
      optionGroup,
      selected,
      answers,
      flaggedQuestions,
      showOverview,
      exitConfirm,
      next,
      previous,
      goToQuestion,
      toggleFlag,
      askExit,
      exit,
      formattedTime,
      indexDisplay,
      isLastQuestion,
      progressPercentage,
      isFlagged,
      remaining,
      currentImage,
      placeholderImage
    }
  }
})
</script>

<style scoped>
.exam-run-page {
  min-height: 100vh;
  padding: 16px;
}

.exam-header {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  margin-bottom: 16px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-logo {
  height: 32px;
  width: auto;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.timer-icon {
  color: #64748b;
  font-size: 20px;
}

.timer-content {
  text-align: center;
}

.timer-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.timer-value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Courier New', monospace;
}

.timer-value.warning {
  color: #dc2626;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.action-btn {
  color: #64748b;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.exit-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.progress-section {
  max-width: 1400px;
  margin: 0 auto 16px auto;
}

.progress-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.exam-main {
  max-width: 1400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 0;
}

.content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 24px;
}

.side-by-side-content {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.visual-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.visual-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.visual-image {
  border-radius: 16px;
  width: 100%;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #9ca3af;
  gap: 12px;
}

.image-debug {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  font-family: monospace;
  text-align: center;
}

.image-caption {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

.question-section {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.question-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  width: 100%;
  height: fit-content;
}

.question-header {
  margin-bottom: 32px;
  width: 100%;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}

.question-number {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 8px;
}

.question-text {
  font-size: 20px;
  line-height: 1.6;
  color: #1f2937;
  font-weight: 500;
  width: 100%;
}

.options-section {
  margin-bottom: 32px;
  width: 100%;
}

.custom-option-group {
  width: 100%;
}

.custom-option-group :deep(.q-option) {
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
}

.custom-option-group :deep(.q-option:hover) {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.custom-option-group :deep(.q-option.q-option--selected) {
  border-color: #3b82f6;
  background: #eff6ff;
}

.custom-option-group :deep(.q-option__label) {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

.navigation-section {
  border-top: 1px solid #f3f4f6;
  padding-top: 24px;
  width: 100%;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.nav-btn {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 10px;
  min-width: 140px;
}

.spacer {
  flex: 1;
}

.overview-dialog {
  width: 400px;
  border-radius: 16px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.overview-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.overview-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.question-indicator {
  width: 48px;
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-indicator:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.question-indicator.answered {
  background: #dcfce7;
  border-color: #16a34a;
  color: #16a34a;
}

.question-indicator.current {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.question-indicator.flagged {
  border-color: #f59e0b;
  color: #f59e0b;
}

.overview-footer {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
}

.overview-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #e5e7eb;
}

.legend-color.current {
  background: #3b82f6;
  border-color: #3b82f6;
}

.legend-color.answered {
  background: #dcfce7;
  border-color: #16a34a;
}

.legend-color.flagged {
  border-color: #f59e0b;
}

.confirm-dialog {
  border-radius: 16px;
  max-width: 480px;
  width: 90vw;
}

.dialog-header {
  text-align: center;
  padding: 32px 32px 0;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin: 16px 0 0 0;
}

.dialog-content {
  padding: 24px 32px;
  text-align: center;
  color: #475569;
  line-height: 1.6;
}

.dialog-actions {
  padding: 0 32px 32px;
  justify-content: center;
  gap: 12px;
}

.cancel-btn {
  color: #64748b;
  font-weight: 500;
}

.confirm-btn {
  font-weight: 500;
}

@media (max-width: 1024px) {
  .side-by-side-content {
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 800px;
  }
  .content-wrapper {
    padding: 24px 20px;
  }
  .header-content {
    padding: 12px 16px;
  }
  .question-card {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .exam-run-page {
    padding: 12px;
  }
  .content-wrapper {
    padding: 20px 16px;
  }
  .side-by-side-content {
    gap: 24px;
  }
  .question-text {
    font-size: 18px;
  }
  .questions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .navigation-buttons {
    flex-direction: column;
  }
  .nav-btn {
    width: 100%;
  }
  .question-meta {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  .question-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .exam-run-page {
    padding: 8px;
  }
  .content-wrapper {
    padding: 16px 12px;
  }
  .side-by-side-content {
    gap: 20px;
  }
  .questions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .overview-legend {
    flex-direction: column;
    gap: 12px;
  }
  .question-text {
    font-size: 16px;
  }
  .custom-option-group :deep(.q-option__label) {
    font-size: 14px;
  }
  .progress-container {
    padding: 16px;
  }
  .visual-card,
  .question-card {
    border-radius: 12px;
  }
  .question-card {
    padding: 16px;
  }
}
</style>