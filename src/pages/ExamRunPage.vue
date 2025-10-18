<template>
  <q-page class="exam-run-page q-page-container no-select" @dragover.prevent @drop.prevent>
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="80px" />
      <p class="loading-text">{{  'Loading exam...' }}</p>
    </div>

    <!-- Exam Content -->
    <div v-else-if="questions.length > 0">
    <!-- Header -->
    <header class="exam-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-container">
            <img src="../assets/Logo-test1.png" alt="Logo" class="header-logo" />
          </div>
          <div class="exam-info">
            <h1 class="exam-title">{{ examInfo.title }}</h1>
            <p class="exam-subtitle">{{ $t('exam_run.exam_subtitle', { total: examInfo.totalQuestions }) }}</p>
          </div>
        </div>

        <div class="header-center">
          <div class="timer-container">
            <div class="timer-icon-wrapper">
              <q-icon name="schedule" class="timer-icon" />
            </div>
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
        <div class="progress-info">
          <div class="progress-text">
            Vraag {{ indexDisplay }} van {{ questions.length }}
          </div>
          <div class="progress-percentage">{{ Math.round(progressPercentage) }}%</div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          {{ $t('exam_run.progress_of', { current: indexDisplay, total: questions.length }) }}
        </div>
        <!-- Debug info (uncomment if needed) -->
        <!-- <div class="debug-info">
          <small>Exam ID: {{ examId }} | Questions: {{ questions.length }} | Current: {{ indexDisplay }}</small>
        </div> -->
      </div>
    </div>

    <!-- Main Content -->
    <main class="exam-main">
      <div class="content-wrapper">
        <div class="main-container">
          <!-- Left Column: Image -->
          <div class="image-column">
            <div class="visual-card">
              <div class="visual-content">
                <div class="image-container">
                  <q-img
                    ref="imageRef"
                    :src="currentImage"
                    ratio="1"
                    class="visual-image"
                    :class="{ 'drag-drop-enabled': isDragDropQuestion }"
                    :placeholder-src="placeholderImage"
                    draggable="false"
                    @drop="handleDrop"
                    @dragover.prevent="allowDrop"
                    @dragenter.prevent="allowDrop"
                  >
                    <template v-slot:error>
                      <div class="image-error">
                        <q-icon name="image_not_supported" size="xl" color="grey-5" />
                        <div class="error-text">{{ $t('exam_run.image_not_available') }}</div>
                        <div class="image-debug" v-if="current.rawImage">
                          Path: {{ current.rawImage }}<br>
                          Exam: {{ examId }}<br>
                          Resolved: {{ currentImage }}
                        </div>
                      </div>
                    </template>
                    
                    <!-- Drag and drop zones overlay -->
                    <template v-if="isDragDropQuestion">
                      <div class="drag-zones-overlay">
                        <div
                          v-for="target in current.dragTargets"
                          :key="target.id"
                          class="drag-zone"
                          :style="{
                            left: target.x + '%',
                            top: target.y + '%'
                          }"
                          :class="{ 'has-assignment': getTargetForNumber(1)?.id === target.id || getTargetForNumber(2)?.id === target.id || getTargetForNumber(3)?.id === target.id }"
                          @drop.prevent.stop="handleDropOnZone(target, $event)"
                          @dragover.prevent.stop="allowDrop"
                          @dragenter.prevent.stop
                        >
                          <div class="zone-number" v-if="getTargetForNumber(1)?.id === target.id">1</div>
                          <div class="zone-number" v-else-if="getTargetForNumber(2)?.id === target.id">2</div>
                          <div class="zone-number" v-else-if="getTargetForNumber(3)?.id === target.id">3</div>
                        </div>
                      </div>
                    </template>
                  </q-img>
                </div>
              </div>
              <div class="image-caption" v-if="current.imageCaption">
                <q-icon name="description" size="xs" color="grey-6" />
                {{ current.imageCaption }}
              </div>
            </div>
          </div>

          <!-- Right Column: Question and Options in Single Container -->
          <div class="question-options-column">
            <div class="question-options-card">
              <!-- Question Header -->
              <div class="question-options-header">
                <div class="question-meta">
                  <div class="question-number-badge">
                    <span class="question-number">{{ $t('exam_run.question') }} {{ indexDisplay }}</span>
                  </div>
                  <div class="question-actions">
                    <q-btn
                      flat
                      round
                      dense
                      icon="flag"
                      size="sm"
                      :color="isFlagged ? 'amber' : 'grey-5'"
                      @click="toggleFlag"
                      class="flag-btn"
                    >
                      <q-tooltip>{{ $t('exam_run.mark') }}</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>

              <!-- Question Text -->
              <div class="question-content">
                <div class="question-text-wrapper">
                  <div class="question-icon">
                    <q-icon name="help_outline" size="md" color="primary" />
                  </div>
                  <div class="question-text">
                    {{ current.text }}
                  </div>
                </div>
              </div>

              <!-- Options Section -->
              <div class="options-section">

                <div class="options-content">
                  <!-- Drag and Drop Interface -->
                  <template v-if="isDragDropQuestion">
                    <div class="drag-drop-interface">
                      <div class="drag-instructions">
                        <q-icon name="touch_app" size="sm" color="primary" />
                        <span>{{ $t('exam_run.drag_instructions', 'Sleep de nummers naar de juiste posities op de afbeelding') }}</span>
                      </div>
                      
                      <!-- Draggable Numbers -->
                      <div class="draggable-numbers">
                        <div
                          v-for="number in Array.from({ length: current.dragTargets?.length || 0 }, (_, i) => i + 1)"
                          :key="number"
                          class="draggable-number"
                          :class="{ 'assigned': isNumberAssigned(number) }"
                          draggable="true"
                          @dragstart="startDrag(number, $event)"
                        >
                          {{ number }}
                        </div>
                      </div>
                      
                      <!-- Current Assignments -->
                      <div class="current-assignments" v-if="dragOrder.length > 0">
                        <div class="assignments-title">{{ $t('exam_run.current_order', 'Huidige volgorde:') }}</div>
                        <div class="assignment-list">
                          <div
                            v-for="(assignment, idx) in dragOrder.sort((a, b) => a.number - b.number)"
                            :key="assignment.number"
                            class="assignment-item"
                          >
                            <span class="assignment-number">{{ assignment.number }}.</span>
                            <span class="assignment-target">{{ getDragTargetLabel(assignment.targetId) }}</span>
                            <q-btn
                              flat
                              round
                              dense
                              icon="close"
                              size="xs"
                              color="grey-6"
                              @click="removeDragAssignment(assignment.number)"
                              class="remove-btn"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Multiple Choice Options -->
                  <template v-else-if="questionType === 'multiple'">
                    <div class="options-list">
                      <div
                        v-for="(option, idx) in optionGroup"
                        :key="option.value"
                        class="option-item"
                        :class="{ 'selected': selected === option.value }"
                        @click="selected = option.value"
                      >
                        <div class="option-selector">
                          <div class="option-radio">
                            <div class="radio-outer">
                              <div class="radio-inner" :class="{ 'checked': selected === option.value }"></div>
                            </div>

                          </div>
                          <div class="option-content">
                            <div class="option-label">{{ option.label }}</div>
                          </div>
                        </div>
                        <div class="option-indicator" v-if="selected === option.value">
                          <q-icon name="check_circle" class="check-icon" />
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Dropdown Options -->
                  <template v-else-if="questionType === 'dropdown'">
                    <div class="dropdown-container">
                      <q-select
                        v-model="selected"
                        :options="optionGroup"
                        outlined
                        dense
                        emit-value
                        map-options
                        class="professional-select"
                        behavior="menu"
                        :label="$t('exam_run.select_answer')"
                      >
                        <template v-slot:selected>
                          <div class="selected-option" v-if="selected">
                            <div class="selected-label">
                              {{ optionGroup.find(opt => opt.value === selected)?.label }}
                            </div>
                          </div>
                          <div class="placeholder" v-else>
                            {{ $t('exam_run.choose_option') }}
                          </div>
                        </template>
                        <template v-slot:option="scope">
                          <q-item
                            v-bind="scope.itemProps"
                            class="dropdown-option"
                          >
                            <q-item-section>
                              <q-item-label>{{ scope.opt.label }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                  </template>

                  <!-- Input Field -->
                  <template v-else-if="questionType === 'input'">
                    <div class="input-container">
                      <div class="input-field-wrapper">
                        <q-input
                          v-model="selected"
                          type="text"
                          outlined
                          class="professional-input"
                          :placeholder="$t('exam_run.enter_answer')"
                          :maxlength="200"
                          counter
                          :label="current.category || $t('exam_run.type_answer')"
                        >
                          <template v-slot:prepend>
                            <q-icon name="edit" class="input-icon" />
                          </template>
                        </q-input>
                      </div>
                      <div class="input-hint">
                        <q-icon name="info" size="xs" />
                        <span>{{ $t('exam_run.answer_hint') }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Navigation Section -->
    <div class="navigation-section">
      <div class="navigation-container">
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
            :disabled="!canProceed"
          >
            {{ isLastQuestion ? $t('exam_run.finish') : $t('exam_run.next') }}
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Overview Dialog -->
    <q-dialog v-model="showOverview" position="right" full-height>
      <q-card class="overview-dialog">
        <q-card-section class="overview-header">
          <div class="overview-title">{{ $t('exam_run.overview_title') }}</div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-card-section class="overview-stats">
          <div class="stat">
            <q-icon name="check_circle" color="positive" size="16px" />
            <div class="stat-value">{{ answeredCount }}</div>
            <div class="stat-label">Beantwoord</div>
          </div>
          <div class="stat">
            <q-icon name="flag" color="amber-7" size="16px" />
            <div class="stat-value">{{ flaggedCount }}</div>
            <div class="stat-label">Gemarkeerd</div>
          </div>
          <div class="stat">
            <q-icon name="help_outline" color="grey-7" size="16px" />
            <div class="stat-value">{{ unansweredCount }}</div>
            <div class="stat-label">Open</div>
          </div>
        </q-card-section>

        <q-card-section class="overview-content">
          <div class="questions-grid">
            <div
              v-for="(answer, idx) in answers"
              :key="idx"
              class="question-indicator"
              :class="{
                'answered': answer !== null && answer !== undefined && answer !== '',
                'current': idx === index,
                'flagged': flaggedQuestions.has(idx)
              }"
              role="button"
              tabindex="0"
              @click="goToQuestion(idx)"
              @keydown.enter.prevent="goToQuestion(idx)"
              @keydown.space.prevent="goToQuestion(idx)"
            >
              {{ idx + 1 }}
              <q-tooltip>
                <span v-if="flaggedQuestions.has(idx)">Gemarkeerd</span>
                <span v-else-if="answer !== null && answer !== undefined && answer !== ''">Beantwoord</span>
                <span v-else>Onbeantwoord</span>
              </q-tooltip>
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
          <!-- <div class="overview-actions">
            <q-btn dense outline color="primary" no-caps icon="flag" label="Ga naar gemarkeerde" @click="goToFirstFlagged" :disable="flaggedCount === 0" />
            <q-btn dense unelevated color="primary" no-caps icon="help_outline" label="Eerste onbeantwoorde" @click="goToFirstUnanswered" :disable="unansweredCount === 0" />
          </div> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Exit Dialog -->

    <!-- Exit Bevestiging Dialog -->
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
          <q-btn
            flat
            no-caps
            class="cancel-btn"
            @click="exitConfirm = false"
          >
            {{ $t('exam_run.exit.continue') }}
          </q-btn>
          <q-btn
            color="primary"
            unelevated
            no-caps
            class="confirm-btn"
            @click="exit"
          >
            {{ $t('exam_run.exit.stop') }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>

    <!-- No Questions State -->
    <div v-else class="empty-state">
      <q-icon name="quiz" size="80px" color="grey-4" />
      <h3>{{ $t('exam_run.no_questions') || 'No questions available' }}</h3>
      <q-btn color="primary" outline @click="() => router.back()">
        {{ $t('exam_run.go_back') || 'Go Back' }}
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const assetsCtx = require.context('../assets', true, /(png|jpe?g|webp|svg|gif)$/)

function normalizeExamId(rawId) {
  // const str = String(rawId ?? '').trim()
  // const match = str.match(/(\d+)/)
  // return match ? match[1] : '1'
}

function resolveAsset(inputPath, examCode) {
  try {
    if (!inputPath) return ''

    const raw = String(inputPath).trim().replace(/\\/g, '/')
    const fileName = raw.split('/').pop()
    
    // Extract exam number from code (e.g., 'exam-1' -> '1')
    let examNumber = '1'
    if (examCode) {
      const match = String(examCode).match(/exam-?(\d+)/)
      examNumber = match ? match[1] : '1'
    }

    console.log(`Resolving asset: ${inputPath} for exam ${examCode} (number: ${examNumber})`)

    const allAssets = assetsCtx.keys()
    console.log(`Available assets:`, allAssets.slice(0, 10)) // Log first 10 for debugging

    // Try exact path first (from the image field, like 'exam1/q1.png')
    const expectedPath = `./${raw}`
    let foundAsset = allAssets.find(p => p === expectedPath)

    if (!foundAsset) {
      // Try with exam folder pattern
      foundAsset = allAssets.find(p => p.includes(`exam${examNumber}/`) && p.endsWith(fileName))
    }

    if (!foundAsset) {
      // Try just the filename in any exam folder
      foundAsset = allAssets.find(p => p.endsWith(fileName))
    }

    if (foundAsset) {
      console.log(`Found asset: ${foundAsset}`)
      const mod = assetsCtx(foundAsset)
      const resolved = mod && mod.default ? mod.default : mod
      console.log(`Resolved asset URL:`, resolved)
      return resolved
    }

    console.warn(`Asset not found: ${fileName} for exam ${examCode}`)
    return ''
  } catch (e) {
    console.error('Asset resolution error:', inputPath, e)
    return ''
  }
}

async function loadExamDataById(id) {
  try {
    console.log(`Loading exam data for ID: ${id} from API`)

    // Check if it's a UUID (contains dashes) or a number
    const isUUID = id && id.includes && id.includes('-')
    
    // Use the appropriate endpoint
    const endpoint = isUUID ? `/exams/detail/${id}` : `/exams/number/${id}`
    
    // Fetch exam data from backend API
    const response = await api.get(endpoint)
    const examData = response.data

    console.log(`Loaded exam data from API:`, {
      id: examData.id,
      code: examData.code,
      title: examData.title,
      questionsCount: examData.questions?.length || 0
    })

    return examData
  } catch (e) {
    console.error(`Error loading exam ${id} from API:`, e)

    // Return empty exam structure if API fails
    return {
      id: id,
      code: `exam-${id}`,
      title: { nl: 'Examen', en: 'Exam', ar: 'امتحان' },
      questions: [],
      durationMinutes: 30,
      passingScore: 44,
      totalPoints: 50
    }
  }
}

export default defineComponent({
  name: 'ExamRunPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const { locale } = useI18n()
    const examParam = route.params.id || '1'
    const examId = examParam

    console.log('🚀 Starting exam:', examId)

    // State for exam data
    const examData = ref(null)
    const loading = ref(true)
    const questions = ref([])

    // Exam information
    const examInfo = computed(() => {
      if (!examData.value) {
        return {
          id: `exam${examId}`,
          title: `Exam ${examId}`,
          totalQuestions: 0
        }
      }

      // Get localized title
      let title = examData.value.title
      if (typeof title === 'object') {
        title = title[locale.value] || title.nl || title.en || `Exam ${examId}`
      }

      return {
        id: examData.value.id || `exam${examId}`,
        title: title,
        totalQuestions: questions.value.length
      }
    })

    // State management
    function getDefaultSelection(question) {
      if (!question) return null
      const type = (question.type || 'multiple')
      if (type === 'input') return ''
      // For drag-drop questions, initialize with empty array
      if ((type === 'multiple' || type === 'interactive-choice') && Array.isArray(question.options) && question.options.length === 0 && Array.isArray(question.dragTargets)) {
        return []
      }
      return null
    }

    const index = ref(0)
    const selected = ref(getDefaultSelection(questions.value[0] || null))
    const answers = ref(questions.value.map(() => null))
    const flaggedQuestions = ref(new Set())
    const showOverview = ref(false)
    const exitConfirm = ref(false)
    
    // Drag and drop state
    const dragOrder = ref([])
    const draggedNumber = ref(null)
    const imageRef = ref(null)

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

      // Process localized text
      let text = question.text
      if (typeof text === 'object') {
        text = text[locale.value] || text.nl || text.en || ''
      }

      // Process localized options
      const options = Array.isArray(question.options) 
        ? question.options.map(opt => {
            let label = opt.label
            if (typeof label === 'object') {
              label = label[locale.value] || label.nl || label.en || ''
            }
            return { ...opt, label }
          })
        : []

      console.log('🎯 Current question:', {
        index: index.value,
        exam: examId,
        questionId: question.id,
        rawImage: question.rawImage,
        resolvedImage: question.image,
        hasImage: !!question.image,
        textLength: text?.length || 0,
        optionsCount: options?.length || 0
      })

      return {
        ...question,
        text,
        options
      }
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

    const questionType = computed(() => current.value.type || 'multiple')
    const isDragDropQuestion = computed(() => {
      return (questionType.value === 'multiple' || questionType.value === 'interactive-choice') && 
             Array.isArray(current.value.options) && 
             current.value.options.length === 0 && 
             Array.isArray(current.value.dragTargets) && 
             current.value.dragTargets.length > 0
    })
    const optionGroup = computed(() => Array.isArray(current.value.options)
      ? current.value.options.map(o => ({ label: o.label, value: o.id }))
      : []
    )
    const indexDisplay = computed(() => index.value + 1)
    const isLastQuestion = computed(() => index.value === questions.value.length - 1)
    const progressPercentage = computed(() => ((index.value + 1) / questions.value.length) * 100)
    const isFlagged = computed(() => flaggedQuestions.value.has(index.value))
    const canProceed = computed(() => {
      const type = questionType.value
      const val = selected.value
      if (type === 'input') return typeof val === 'string' && val.trim().length > 0
      if (Array.isArray(val)) return val.length > 0
      if (isDragDropQuestion.value) return dragOrder.value.length === current.value.dragTargets.length
      return val !== null && val !== undefined && val !== ''
    })

    // Overview stats
    const answeredCount = computed(() => answers.value.filter(a => a !== null && a !== undefined && a !== '').length)
    const flaggedCount = computed(() => flaggedQuestions.value.size)
    const unansweredCount = computed(() => Math.max(questions.value.length - answeredCount.value, 0))

    function goToFirstUnanswered() {
      const idx = answers.value.findIndex(a => a === null || a === undefined || a === '')
      if (idx >= 0) {
        goToQuestion(idx)
      }
    }

    function goToFirstFlagged() {
      const arr = Array.from(flaggedQuestions.value)
      if (arr.length > 0) {
        const idx = arr.sort((a, b) => a - b)[0]
        goToQuestion(idx)
      }
    }

    // Load exam data
    async function loadExam() {
      try {
        loading.value = true
        const data = await loadExamDataById(examId)
        examData.value = data

        // Process questions
        const raw = (data && data.questions ? data.questions : []).slice(0, 50)
        questions.value = raw.map((q, idx) => {
          const processedQuestion = {
            ...q,
            rawImage: q.image || '',
            image: q.image ? resolveAsset(q.image, data.code) : ''
          }

          console.log(`Processing question ${idx + 1}:`, {
            id: processedQuestion.id,
            rawImage: processedQuestion.rawImage,
            resolvedImage: processedQuestion.image,
            hasText: !!processedQuestion.text,
            examCode: data.code
          })

          return processedQuestion
        })

        console.log('🎯 Loaded questions for exam', data.code, '(', examId, '):', questions.value.length)

        // Initialize answers array
        answers.value = questions.value.map(() => null)
        selected.value = getDefaultSelection(questions.value[0] || null)
        
        // Initialize drag order for current question
        const currentQuestion = questions.value[0]
        if (currentQuestion && (currentQuestion.type === 'multiple' || currentQuestion.type === 'interactive-choice') && 
            Array.isArray(currentQuestion.options) && currentQuestion.options.length === 0 && 
            Array.isArray(currentQuestion.dragTargets)) {
          dragOrder.value = []
        }

        // Set timer duration from API response (default to 30 minutes if not provided)
        console.log('🎯 Exam duration:', data.durationMinutes)
        console.log(JSON.stringify(data))
        const durationMinutes = data.durationMinutes || 30
        remaining.value = durationMinutes * 60
        console.log('⏱️ Exam duration set to:', durationMinutes, 'minutes')
      } catch (error) {
        console.error('Failed to load exam:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load exam. Please try again.',
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    }

    // Timer - will be set from API response
    const remaining = ref(30)
    let timer
    onMounted(() => {
      // Load exam data first
      loadExam()

      timer = setInterval(() => {
        remaining.value = Math.max(remaining.value - 1, 0)
        if (remaining.value === 0) {
          autoSubmit()
        }
      }, 1000)

      // Prevent pasting images/files into the page
      window.addEventListener('paste', handlePaste)
      // Block file/image drag & drop onto the page
      window.addEventListener('drop', handleGlobalDrop)
      window.addEventListener('dragover', handleDragOver)
    })

    onBeforeUnmount(() => {
      if (timer) clearInterval(timer)
      window.removeEventListener('paste', handlePaste)
      window.removeEventListener('drop', handleGlobalDrop)
      window.removeEventListener('dragover', handleDragOver)
    })

    const formattedTime = computed(() => {
      const m = Math.floor(remaining.value / 60).toString().padStart(2, '0')
      const s = (remaining.value % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    })

    // Placeholder image
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTEwQzE2MCAxMjMuODA3IDE0OC44MDcgMTM1IDEzNSAxMzVDMTIxLjE5MyAxMzUgMTEwIDEyMy44MDcgMTEwIDExMEMxMTAgOTYuMTkzMiAxMjEuMTkzIDg1IDEzNSA4NUMxNDguODA3IDg1IDE2MCA5Ni4xOTMyIDE2MCAxMTBaIiBmaWxsPSIjRDhEOEQ4Ii8+CjxwYXRoIGQ9Ik0yMDAgNzVIMzAwVjE2NUgyMDBWNzVaIiBmaWxsPSIjRDhEOEQ4Ii8+Cjwvc3ZnPgo='

    // Methods
    function handlePaste(e) {
      try {
        const dt = e.clipboardData
        if (!dt) return
        const hasFiles = dt.files && dt.files.length > 0
        const hasImageItems = Array.from(dt.items || []).some(item => (item && (item.kind === 'file' || (item.type && item.type.startsWith('image/')))))
        if (hasFiles || hasImageItems) {
          e.preventDefault()
        }
      } catch (_) {
        // no-op
      }
    }

    function handleGlobalDrop(e) {
      // Allow drag-drop for exam questions
      if (isDragDropQuestion.value && draggedNumber.value) {
        return
      }
      
      try {
        const dt = e.dataTransfer
        if (dt && dt.files && dt.files.length > 0) {
          e.preventDefault()
        }
      } catch (_) {
        // no-op
      }
    }

    function handleDragOver(e) {
      // Allow drag-drop for exam questions
      if (isDragDropQuestion.value && draggedNumber.value) {
        return
      }
      
      try {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'none'
        }
        e.preventDefault()
      } catch (_) {
        // no-op
      }
    }

    function getQuestionTypeLabel(type) {
      const types = {
        'multiple': 'Meerkeuze',
        'dropdown': 'Keuzelijst',
        'input': 'Open vraag'
      }
      return types[type] || 'Meerkeuze'
    }

    // Format drag-drop answer as string
    function formatDragDropAnswer(dragOrderArray) {
      if (!Array.isArray(dragOrderArray) || dragOrderArray.length === 0) {
        return ''
      }

      // Sort by number to get correct order
      const sortedOrder = dragOrderArray
        .sort((a, b) => a.number - b.number)
        .map(item => {
          const target = current.value.dragTargets.find(t => t.id === item.targetId)
          let label = target?.label || `Target ${item.targetId}`
          
          // Handle multi-language labels
          if (typeof label === 'object') {
            label = label[locale.value] || label.nl || label.en || `Target ${item.targetId}`
          }
          
          return `${item.number}. ${label}`
        })
        .join(', ')

      return sortedOrder
    }

    // Parse drag-drop answer from string back to array
    function parseDragDropAnswer(answerString) {
      if (!answerString || typeof answerString !== 'string') {
        return []
      }

      const assignments = []
      const parts = answerString.split(', ')

      parts.forEach(part => {
        const match = part.match(/^(\d+)\.\s*(.+)$/)
        if (match) {
          const number = parseInt(match[1])
          const label = match[2].trim()
          
          // Find the target with matching label (check both string and object formats)
          const target = current.value.dragTargets.find(t => {
            if (typeof t.label === 'string') {
              return t.label === label
            } else if (typeof t.label === 'object') {
              return t.label.nl === label || t.label.en === label || t.label[locale.value] === label
            }
            return false
          })
          
          if (target) {
            assignments.push({
              number: number,
              targetId: target.id
            })
          }
        }
      })

      return assignments
    }

    function next() {
      if (questions.value.length === 0) return
      
      // Save current answer - for drag-drop questions, format as string
      if (isDragDropQuestion.value) {
        const formattedAnswer = formatDragDropAnswer(dragOrder.value)
        answers.value[index.value] = formattedAnswer
      } else {
        answers.value[index.value] = selected.value
      }
      
      if (index.value < questions.value.length - 1) {
        index.value += 1
        const nextQuestion = questions.value[index.value]
        
        if (nextQuestion && (nextQuestion.type === 'multiple' || nextQuestion.type === 'interactive-choice') && 
            Array.isArray(nextQuestion.options) && nextQuestion.options.length === 0 && 
            Array.isArray(nextQuestion.dragTargets)) {
          // Initialize drag order for next drag-drop question
          dragOrder.value = answers.value[index.value] ? parseDragDropAnswer(answers.value[index.value]) : []
        } else {
          selected.value = (answers.value[index.value] !== null && answers.value[index.value] !== undefined)
            ? answers.value[index.value]
            : getDefaultSelection(nextQuestion)
        }
      } else {
        submitExam()
      }
    }

    function previous() {
      if (index.value > 0) {
        // Save current answer - for drag-drop questions, format as string
        if (isDragDropQuestion.value) {
          const formattedAnswer = formatDragDropAnswer(dragOrder.value)
          answers.value[index.value] = formattedAnswer
        } else {
          answers.value[index.value] = selected.value
        }
        
        index.value -= 1
        const prevQuestion = questions.value[index.value]
        
        if (prevQuestion && (prevQuestion.type === 'multiple' || prevQuestion.type === 'interactive-choice') && 
            Array.isArray(prevQuestion.options) && prevQuestion.options.length === 0 && 
            Array.isArray(prevQuestion.dragTargets)) {
          // Initialize drag order for previous drag-drop question
          dragOrder.value = answers.value[index.value] ? parseDragDropAnswer(answers.value[index.value]) : []
        } else {
          selected.value = (answers.value[index.value] !== null && answers.value[index.value] !== undefined)
            ? answers.value[index.value]
            : getDefaultSelection(prevQuestion)
        }
      }
    }

    function goToQuestion(questionIndex) {
      // Save current answer - for drag-drop questions, format as string
      if (isDragDropQuestion.value) {
        const formattedAnswer = formatDragDropAnswer(dragOrder.value)
        answers.value[index.value] = formattedAnswer
      } else {
        answers.value[index.value] = selected.value
      }
      
      index.value = questionIndex
      const targetQuestion = questions.value[index.value]
      
      if (targetQuestion && (targetQuestion.type === 'multiple' || targetQuestion.type === 'interactive-choice') && 
          Array.isArray(targetQuestion.options) && targetQuestion.options.length === 0 && 
          Array.isArray(targetQuestion.dragTargets)) {
        // Initialize drag order for target drag-drop question
        dragOrder.value = answers.value[index.value] ? parseDragDropAnswer(answers.value[index.value]) : []
      } else {
        selected.value = (answers.value[index.value] !== null && answers.value[index.value] !== undefined)
          ? answers.value[index.value]
          : getDefaultSelection(targetQuestion)
      }
      showOverview.value = false
    }

    function toggleFlag() {
      if (flaggedQuestions.value.has(index.value)) {
        flaggedQuestions.value.delete(index.value)
      } else {
        flaggedQuestions.value.add(index.value)
      }
    }

    // Drag and drop functions
    function startDrag(number, event) {
      if (!isDragDropQuestion.value) return
      draggedNumber.value = number
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', number.toString())
      
      // Create a custom drag image
      const dragImage = event.target.cloneNode(true)
      dragImage.style.opacity = '0.8'
      event.dataTransfer.setDragImage(event.target, 30, 30)
    }

    function allowDrop(event) {
      if (!isDragDropQuestion.value) return
      event.preventDefault()
      event.stopPropagation()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }

    function handleDropOnZone(target, event) {
      if (!isDragDropQuestion.value || !draggedNumber.value) return
      
      event.preventDefault()
      event.stopPropagation()
      
      // Remove any existing assignment for this number
      dragOrder.value = dragOrder.value.filter(item => item.number !== draggedNumber.value)
      
      // Remove any existing assignment for this target
      dragOrder.value = dragOrder.value.filter(item => item.targetId !== target.id)
      
      // Add new assignment
      dragOrder.value.push({
        number: draggedNumber.value,
        targetId: target.id
      })
      
      // Update selected value for validation
      selected.value = dragOrder.value.map(item => item.targetId)
      
      draggedNumber.value = null
    }

    function handleDrop(event) {
      if (!isDragDropQuestion.value || !draggedNumber.value) {
        // If not a drag-drop question, prevent file drops
        try {
          const dt = event.dataTransfer
          if (dt && dt.files && dt.files.length > 0) {
            event.preventDefault()
          }
        } catch (_) {
          // no-op
        }
        return
      }
      
      event.preventDefault()
      event.stopPropagation()
      
      // Get the actual DOM element from the q-img component
      const imgElement = imageRef.value?.$el || imageRef.value
      if (!imgElement) return
      
      const rect = imgElement.getBoundingClientRect()
      if (!rect) return
      
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      
      // Find the closest drag target
      const closestTarget = current.value.dragTargets.reduce((closest, target) => {
        const distance = Math.sqrt(Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2))
        return distance < closest.distance ? { target, distance } : closest
      }, { distance: Infinity })
      
      if (closestTarget.target && closestTarget.distance < 15) { // Only drop if within 15% distance
        handleDropOnZone(closestTarget.target, event)
      }
      
      draggedNumber.value = null
    }

    function removeDragAssignment(number) {
      dragOrder.value = dragOrder.value.filter(item => item.number !== number)
      selected.value = dragOrder.value.map(item => item.targetId)
    }

    function getTargetForNumber(number) {
      const assignment = dragOrder.value.find(item => item.number === number)
      return assignment ? current.value.dragTargets.find(target => target.id === assignment.targetId) : null
    }

    function isNumberAssigned(number) {
      return dragOrder.value.some(item => item.number === number)
    }

    function getDragTargetLabel(targetId) {
      const target = current.value.dragTargets.find(t => t.id === targetId)
      if (!target) return `Target ${targetId}`
      
      let label = target.label
      if (typeof label === 'object') {
        label = label[locale.value] || label.nl || label.en || `Target ${targetId}`
      }
      
      return label
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

    async function submitExam() {
      console.log('📝 Examen submitted for exam', examId, ':', answers.value)

      try {
        // Calculate time spent (total duration - remaining time)
        const totalDuration = examData.value?.durationMinutes || 30
        const timeSpentSeconds = (totalDuration * 60) - remaining.value

        // Submit to backend
        const response = await api.post('/exams/submit', {
          examId: examId,
          answers: answers.value,
          timeSpentSeconds: timeSpentSeconds
        })

        const attemptId = response.data.id
        console.log('✅ Exam submitted successfully, attempt ID:', attemptId)

        // Navigate to results page with attempt ID
        router.push(`/exam/${examId}/results/${attemptId}`)
      } catch (error) {
        console.error('❌ Error submitting exam:', error)
        
        // Fallback: Save to localStorage if API fails
        try {
          localStorage.setItem(`exam_${examId}_data`, JSON.stringify({
            id: examId,
            title: examInfo.value.title,
            questions: questions.value
          }))
          localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers.value))
          
          const timingData = {
            start: new Date().toISOString(),
            end: new Date().toISOString()
          }
          localStorage.setItem(`exam_${examId}_timing`, JSON.stringify(timingData))
          
          console.log('⚠️ Saved to localStorage as fallback')
        } catch (storageError) {
          console.error('❌ Error saving to localStorage:', storageError)
        }

        // Show error notification
        $q.notify({
          type: 'negative',
          message: 'Failed to submit exam. Please try again.',
          position: 'top'
        })

        // Navigate to results page anyway (will use localStorage)
        router.push(`/exam/${examId}/results`)
      }
    }

    return {
      examId,
      examInfo,
      examData,
      loading,
      questions,
      index,
      current,
      questionType,
      isDragDropQuestion,
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
      canProceed,
      remaining,
      currentImage,
      placeholderImage,
      getQuestionTypeLabel,
      // overview exports
      answeredCount,
      flaggedCount,
      unansweredCount,
      goToFirstUnanswered,
      goToFirstFlagged,
      // drag and drop exports
      dragOrder,
      draggedNumber,
      imageRef,
      startDrag,
      allowDrop,
      handleDrop,
      handleDropOnZone,
      removeDragAssignment,
      getTargetForNumber,
      isNumberAssigned,
      getDragTargetLabel
    }
  }
})
</script>

<style scoped>
.exam-run-page {
  min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 24px;
}

.loading-text {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  text-align: center;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Disable text selection on page, allow in inputs */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Re-enable selection inside form fields */
input, textarea, .professional-input :deep(.q-field__native), .professional-select :deep(.q-field__native) {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

/* Prevent dragging images */
.visual-image {
  -webkit-user-drag: none;
}

.exam-header {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.header-content {
  padding: 16px 24px;
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

.exam-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exam-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.exam-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.debug-info {
  margin-top: 8px;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 4px;
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  height: 36px;
  width: auto;
  filter: brightness(1.1);
}

.exam-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.timer-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 16px 16px 0 0;
}

.timer-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-icon {
  color: #3b82f6;
  font-size: 20px;
}

.timer-content {
  text-align: center;
}

.timer-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timer-value {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  font-family: 'Courier New', monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.timer-value.warning {
  color: #dc2626;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
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
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #334155;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.exit-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Progress - نفس العرض */
.progress-section {
  max-width: 1200px;
  margin: 0 auto 24px auto;
  width: 100%;
}

.progress-container {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}


.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-text {
  color: #475569;
  font-size: 16px;
  font-weight: 600;
}

.progress-percentage {
  color: #3b82f6;
  font-size: 18px;
  font-weight: 700;
  background: #eff6ff;
  padding: 6px 12px;
  border-radius: 8px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 8px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
/* Main Content - التصميم الجديد */
.exam-main {
  max-width: 1200px;
  margin: 0 auto 20px auto;
  background: #fff;
  border-radius: 20px;
  padding: 0;
  /* box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); */
  border: 1px solid rgba(255, 255, 255, 0.8);
  flex: 1;
  width: 100%;
}

.content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 24px;
}

.main-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1.3fr 1.2fr;
  gap: 32px;
  align-items: start;
}

/* Image Column */
.image-column {
  width: 100%;
}

.visual-card {
  border-radius: 20px;
  overflow: hidden;

  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* height: fit-content; */
}

.visual-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.visual-content {
  padding: 0;
}

.image-container {
  width: 100%;
}

.visual-image {
  border-radius: 20px;
  width: 100%;
  transition: transform 0.3s ease;
}

.visual-image :deep(.q-img__image) {
  object-fit: cover !important;
  object-position: center !important;
}


.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: #9ca3af;
  gap: 12px;
  background: #f8fafc;
}

.error-text {
  font-size: 14px;
  font-weight: 500;
}

.image-caption {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 14px;
  text-align: center;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.question-options-column {
  width: 100%;
}

.question-options-card {

  overflow: hidden;

  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

/* Question Header */
.question-options-header {
  padding: 24px 24px 0 24px;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.question-number-badge {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-number {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  padding: 8px 16px;
  border-radius: 12px;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.question-type-indicator {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.question-type-indicator.multiple {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #dbeafe;
}

.question-type-indicator.dropdown {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #dcfce7;
}

.question-type-indicator.input {
  background: #fef7ed;
  color: #9a3412;
  border: 1px solid #fed7aa;
}

.question-actions {
  display: flex;
  align-items: center;
}

.flag-btn {
  transition: all 0.3s ease;
}

.flag-btn:hover {
  transform: scale(1.1);
}

/* Question Content */
.question-content {
  padding: 0 24px 24px 24px;
  /* border-bottom: 1px solid #f1f5f9; */
}

.question-text-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  /* border-left: 4px solid #3b82f6; */
}

.question-icon {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.question-text {
  font-size: 12px;
  line-height: 1.7;
  color: #1f2937;
  font-weight: 500;
  flex: 1;
}

/* Options Section */
.options-section {
  padding: 24px;
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.options-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.selection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #dcfce7;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #166534;
}

/* Options List */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.option-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.5s ease;
}

.option-item:hover::before {
  left: 100%;
}

.option-item:hover {
  border-color: #3b82f6;
  background: #f8faff;
  /* transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15); */
}

.option-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.2);
}

.option-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.option-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-outer {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.option-item:hover .radio-outer {
  border-color: #3b82f6;
}

.option-item.selected .radio-outer {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
}

.radio-inner.checked {
  background: #fff;
}

.option-content {
  flex: 1;
}

.option-label {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

.option-item.selected .option-label {
  color: #1e40af;
  font-weight: 600;
}

.option-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: #10b981;
  font-size: 20px;
}

/* Dropdown Styles */
.dropdown-container {
  width: 100%;
}

.professional-select :deep(.q-field__control) {
  border-radius: 12px;
  height: 56px;
  font-size: 16px;
}

.professional-select :deep(.q-field__control:hover) {
  border-color: #3b82f6;
}

.professional-select :deep(.q-field__control:before) {
  border-color: #e2e8f0;
}

.professional-select :deep(.q-field__control:after) {
  border-color: #3b82f6;
}

.selected-option {
  display: flex;
  align-items: center;
}

.selected-label {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.placeholder {
  font-size: 16px;
  color: #9ca3af;
  font-style: italic;
}

.dropdown-option {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.dropdown-option:hover {
  background: #f8fafc;
}

/* Input Styles */
.input-container {
  width: 100%;
}

.input-field-wrapper {
  margin-bottom: 16px;
}

.professional-input :deep(.q-field__control) {
  border-radius: 12px;
  height: 56px;
  font-size: 16px;
}

.professional-input :deep(.q-field__control:hover) {
  border-color: #3b82f6;
}

.professional-input :deep(.q-field__control:before) {
  border-color: #e2e8f0;
}

.professional-input :deep(.q-field__control:after) {
  border-color: #3b82f6;
}

.input-icon {
  color: #6b7280;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  background: #f9fafb;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid #d1d5db;
}

/* Navigation Section */
.navigation-section {
  max-width: 1200px;
  margin: 0 auto 20px auto;
  flex: 1;
  width: 100%;
}

.navigation-container {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.nav-btn {
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 12px;
  min-width: 160px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.nav-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.prev-btn {
  border: 2px solid #3b82f6;
}

.next-btn {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.spacer {
  flex: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .exam-header,
  .progress-section,
  .exam-main,
  .navigation-section {
    max-width: 95%;
  }

  .content-wrapper {
    padding: 24px 20px;
  }

  .header-content {
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .exam-run-page {
    padding: 12px;
  }

  .exam-header,
  .progress-section,
  .exam-main,
  .navigation-section {
    max-width: 100%;
  }

  .content-wrapper {
    padding: 20px 16px;
  }

  .question-text-wrapper {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .question-icon {
    justify-content: center;
  }

  .question-text {
    font-size: 16px;
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

  .options-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .option-item {
    padding: 16px 20px;
  }

  .option-label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .exam-run-page {
    padding: 8px;
  }

  .content-wrapper {
    padding: 16px 12px;
  }

  .question-text {
    font-size: 15px;
    padding: 0;
  }

  .question-text-wrapper {
    padding: 16px;
  }

  .progress-container {
    padding: 16px;
  }

  .visual-card,
  .question-options-card {
    border-radius: 16px;
  }

  .nav-btn {
    min-width: auto;
    padding: 12px 20px;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-center {
    order: 3;
    flex-basis: 100%;
  }

  .option-selector {
    gap: 12px;
  }

  .option-label {
    font-size: 13px;
  }
}

.question-text {
  font-size: 16px;
  line-height: 1.7;
  color: #1f2937;
  font-weight: 300;
  width: 100%;
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

/* Options Section - Professional Redesign */
.options-section {
  width: 100%;
}

.options-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  width: 100%;
  height: fit-content;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.options-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 20px 20px 0 0;
}

.options-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.options-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.options-icon {
  color: #3b82f6;
  font-size: 24px;
  background: #eff6ff;
  padding: 8px;
  border-radius: 10px;
}

.options-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.selection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #dcfce7;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #166534;
}

/* Options List */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.option-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.5s ease;
}

.option-item:hover::before {
  left: 100%;
}

.option-item:hover {
  border-color: #3b82f6;
  background: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.option-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.2);
}

.option-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.option-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-outer {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.option-item:hover .radio-outer {
  border-color: #3b82f6;
}

.option-item.selected .radio-outer {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
}

.radio-inner.checked {
  background: #fff;
}

.option-content {
  flex: 1;
}

.option-label {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
}

.option-item.selected .option-label {
  color: #1e40af;
  font-weight: 600;
}

.option-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: #10b981;
  font-size: 20px;
}

/* Dropdown Styles */
.dropdown-container {
  width: 100%;
}

.dropdown-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.professional-select :deep(.q-field__control) {
  border-radius: 12px;
  height: 56px;
  font-size: 16px;
}

.professional-select :deep(.q-field__control:hover) {
  border-color: #3b82f6;
}

.professional-select :deep(.q-field__control:before) {
  border-color: #e2e8f0;
}

.professional-select :deep(.q-field__control:after) {
  border-color: #3b82f6;
}

.selected-option {
  display: flex;
  align-items: center;
}

.selected-label {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.placeholder {
  font-size: 16px;
  color: #9ca3af;
  font-style: italic;
}

.dropdown-option {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.dropdown-option:hover {
  background: #f8fafc;
}

/* Input Styles */
.input-container {
  width: 100%;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-field-wrapper {
  margin-bottom: 16px;
}

.professional-input :deep(.q-field__control) {
  border-radius: 12px;
  height: 56px;
  font-size: 16px;
}

.professional-input :deep(.q-field__control:hover) {
  border-color: #3b82f6;
}

.professional-input :deep(.q-field__control:before) {
  border-color: #e2e8f0;
}

.professional-input :deep(.q-field__control:after) {
  border-color: #3b82f6;
}

.input-icon {
  color: #6b7280;
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  background: #f9fafb;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid #d1d5db;
}

/* Guidance Section */
.guidance-section {
  margin-top: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.guidance-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #92400e;
}

.guidance-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guidance-content li {
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
  color: #475569;
  font-size: 14px;
}

.guidance-content li:before {
  content: '•';
  color: #f59e0b;
  font-weight: bold;
  position: absolute;
  left: 8px;
}

/* Navigation Section */
.navigation-section {
  max-width: 1200px;
  margin: 0 auto 20px auto;
  flex: 1;
  width: 100%;
}

.navigation-container {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.nav-btn {
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 12px;
  min-width: 160px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.nav-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.prev-btn {
  border: 2px solid #3b82f6;
}

.next-btn {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.spacer {
  flex: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .two-column-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .exam-header,
  .progress-section,
  .exam-main,
  .navigation-section {
    max-width: 95%;
  }

  .content-wrapper {
    padding: 24px 20px;
  }

  .header-content {
    padding: 12px 16px;
  }

  .question-card,
  .options-card {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .exam-run-page {
    padding: 12px;
  }

  .exam-header,
  .progress-section,
  .exam-main,
  .navigation-section {
    max-width: 100%;
  }

  .content-wrapper {
    padding: 20px 16px;
  }

  .two-column-layout {
    gap: 24px;
  }

  .question-text {
    font-size: 16px;
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

  .question-card,
  .options-card {
    padding: 20px;
  }

  .options-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .option-item {
    padding: 16px 20px;
  }

  .option-label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .exam-run-page {
    padding: 8px;
  }

  .content-wrapper {
    padding: 16px 12px;
  }

  .two-column-layout {
    gap: 20px;
  }

  .question-text {
    font-size: 15px;
    padding: 16px;
  }

  .progress-container {
    padding: 16px;
  }

  .visual-card,
  .question-card,
  .options-card {
    border-radius: 16px;
  }

  .question-card,
  .options-card {
    padding: 16px;
  }

  .nav-btn {
    min-width: auto;
    padding: 12px 20px;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-center {
    order: 3;
    flex-basis: 100%;
  }

  .option-selector {
    gap: 12px;
  }

  .option-label {
    font-size: 13px;
  }
}

/* Overview Dialog - Professional Styling */
.overview-dialog { width: 460px; max-width: 90vw; border-radius: 16px; overflow: hidden; }
.overview-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 16px 8px 16px; border-bottom: 1px solid #e5e7eb; }
.overview-title { font-weight: 700; font-size: 16px; color: #111827; }
.overview-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px 16px 12px 16px; border-bottom: 1px solid #f1f5f9; }
.overview-stats .stat { display: grid; grid-template-columns: 18px auto; column-gap: 8px; row-gap: 2px; align-items: center; background:#f9fafb; border:1px solid #eef2f7; border-radius: 10px; padding: 8px 10px; }
.overview-stats .stat-value { font-weight: 700; font-size: 14px; color:#0f172a; }
.overview-stats .stat-label { grid-column: 2; font-size: 12px; color:#6b7280; }
.overview-content { padding: 16px; }
.questions-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
@media (max-width: 480px) { .questions-grid { grid-template-columns: repeat(5, 1fr); } }
.question-indicator { display:flex; align-items:center; justify-content:center; height:42px; border-radius:10px; border: 2px solid #e2e8f0; color:#334155; background:#fff; cursor:pointer; transition:all 0.2s ease; font-weight:700; }
.question-indicator:hover { background:#f8fafc; border-color:#cbd5e1; }
.question-indicator.answered { background:#ecfdf5; border-color:#bbf7d0; color:#065f46; }
.question-indicator.current { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.question-indicator.flagged { background:#fffbeb; border-color:#fde68a; color:#b45309; }
.question-indicator:focus-visible { outline: 3px solid #60a5fa; outline-offset: 2px; }
.overview-footer { padding: 12px 16px 16px 16px; border-top: 1px solid #f1f5f9; }
.overview-legend { display:flex; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
.legend-item { display:flex; align-items:center; gap:8px; font-size: 12px; color:#475569; }
.legend-color { width: 14px; height: 14px; border-radius: 4px; border:1px solid #e2e8f0; }
.legend-color.current { background:#eff6ff; border-color:#bfdbfe; }
.legend-color.answered { background:#ecfdf5; border-color:#bbf7d0; }
.legend-color.flagged { background:#fffbeb; border-color:#fde68a; }
.overview-actions { display:flex; gap: 8px; justify-content: flex-end; }

/* Confirm Dialog */
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
/* Focus states */
.action-btn:focus-visible, .nav-btn:focus-visible, .question-indicator:focus-visible { outline: 3px solid #60a5fa; outline-offset: 2px; }

/* Drag and Drop Styles */
.drag-drop-enabled {
  position: relative;
  cursor: crosshair;
}

.drag-zones-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.drag-zone {
  position: absolute;
  width: 70px;
  height: 70px;
  border: 3px dashed #3b82f6;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  pointer-events: auto;
  cursor: pointer;
  z-index: 10;
}

.drag-zone:hover {
  border-width: 4px;
  background: rgba(59, 130, 246, 0.25);
  transform: translate(-50%, -50%) scale(1.1);
}

.drag-zone.has-assignment {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.25);
  border-style: solid;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.drag-zone.has-assignment:hover {
  background: rgba(16, 185, 129, 0.35);
}

.zone-number {
  width: 40px;
  height: 40px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.drag-drop-interface {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.drag-instructions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #eff6ff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  color: #1e40af;
  font-weight: 500;
}

.draggable-numbers {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.draggable-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  cursor: grab;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  user-select: none;
}

.draggable-number:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.draggable-number:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.draggable-number.assigned {
  background: linear-gradient(135deg, #10b981, #34d399);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  opacity: 0.7;
}

.current-assignments {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.assignments-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assignment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.assignment-number {
  font-weight: 700;
  color: #3b82f6;
  min-width: 20px;
}

.assignment-target {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.remove-btn {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
  background: #fee2e2;
  color: #dc2626;
}
</style>
