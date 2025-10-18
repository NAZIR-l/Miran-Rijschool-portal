<template>
  <q-page class="exam-page" :class="{ 'drag-drop-enabled': isDragDropQuestion }" @dragover.prevent="handlePageDragOver" @drop.prevent="handlePageDrop">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <q-spinner color="primary" size="60px" />
      <p class="loading-text">{{ $t('exam_run.loading') }}</p>
    </div>

    <!-- Exam Content -->
    <div v-else-if="questions.length > 0 && current" class="exam-content">
      <!-- Simple Header -->
      <div class="header">
          <div class="exam-info">
          <h1 class="title">{{ examInfo.title }}</h1>
        </div>
        <div class="question-count">{{ $t('exam_run.question_counter', { current: indexDisplay, total: questions.length }) }}</div>
        <div class="timer" :class="{ 'warning': remaining < 300 }">
          <q-icon name="schedule" size="sm" />
          <span>{{ formattedTime }}</span>
        </div>

        <div class="actions">
          <q-btn flat round icon="flag" :color="isFlagged ? 'amber' : 'grey'" @click="toggleFlag" />
          <q-btn flat round icon="grid_view" color="grey" @click="showOverview = true" />
          <q-btn flat round icon="exit_to_app" color="grey" @click="askExit" />
          </div>
        </div>

      <!-- Simple Progress Bar -->
      <div class="progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        <div class="progress-text">{{ $t('exam_run.progress_complete', { percentage: Math.round(progressPercentage) }) }}</div>
    </div>

    <!-- Main Content -->
      <div class="content">
        <div class="question-section">
              <!-- Question Text -->
          <div class="question">
            <h2 class="question-text">{{ current?.text || '' }}</h2>
            </div>

          <!-- Image -->
          <div class="image-section" v-if="currentImage">
                <q-img
                  ref="imageRef"
                  :src="currentImage"
              class="question-image"
                  :class="{ 'drag-drop-enabled': isDragDropQuestion }"
                  :placeholder-src="placeholderImage"
                  draggable="false"
                  @drop="handleDrop"
                  @dragover.prevent="allowDrop"
                  @dragenter.prevent="allowDrop"
                >
                  <template v-slot:error>
                    <div class="image-error">
                  <q-icon name="image_not_supported" size="48px" color="grey-5" />
                      <div class="error-text">{{ $t('exam_run.image_not_available') }}</div>
                    </div>
                  </template>
                  
                  <!-- Drag and drop zones overlay -->
                  <template v-if="isDragDropQuestion">
                    <div class="drag-zones-overlay">
                      <div
                        v-for="target in current?.dragTargets || []"
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
              <div class="image-caption" v-if="current?.imageCaption">
                {{ current?.imageCaption }}
            </div>
          </div>

            <!-- Options Section -->
          <div class="options-section">
                  <!-- Drag and Drop Interface -->
                  <template v-if="isDragDropQuestion">
                    <div class="drag-drop-interface">
                      <div class="drag-instructions">
                        <q-icon name="touch_app" size="sm" color="primary" />
                  <span>{{ $t('exam_run.drag_instructions') }}</span>
                      </div>
                      
                      <!-- Draggable Numbers -->
                      <div class="draggable-numbers">
                        <div
                          v-for="number in Array.from({ length: current?.dragTargets?.length || 0 }, (_, i) => i + 1)"
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
                  <div class="assignments-title">{{ $t('exam_run.current_order') }}</div>
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
                          <div class="option-radio">
                            <div class="radio-outer">
                              <div class="radio-inner" :class="{ 'checked': selected === option.value }"></div>
                            </div>
                          </div>
                            <div class="option-label">{{ option.label }}</div>
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
                        emit-value
                        map-options
                        :label="$t('exam_run.select_answer')"
                />
                    </div>
                  </template>

                  <!-- Input Field -->
                  <template v-else-if="questionType === 'input'">
                    <div class="input-container">
                        <q-input
                          v-model="selected"
                          type="text"
                          outlined
                          :placeholder="$t('exam_run.enter_answer')"
                          :maxlength="200"
                          counter
                          :label="current?.category || $t('exam_run.type_answer')"
                />
                    </div>
                  </template>
              </div>
            </div>
            <div class="navigation flex gap-2">
          <q-btn
            v-if="index > 0"
            outline
            color="primary"
            icon="arrow_back"
            @click="previous"
          >
            {{ $t('exam_run.previous') }}
          </q-btn>

          <div class="spacer"></div>

          <q-btn
            color="primary"
            unelevated
            :icon="isLastQuestion ? 'check' : 'arrow_forward'"
            @click="next"
            :disabled="!canProceed"
          >
            {{ isLastQuestion ? $t('exam_run.finish') : $t('exam_run.next') }}
          </q-btn>
        </div>
      </div>

      <!-- Navigation -->
   
    </div>

    <!-- No Questions State -->
    <div v-else class="empty-state">
      <q-icon name="quiz" size="80px" color="grey-4" />
      <h3>{{ $t('exam_run.no_questions') }}</h3>
      <q-btn color="primary" outline @click="() => router.back()">
        {{ $t('exam_run.go_back') }}
      </q-btn>
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
            <div class="stat-label">{{ $t('exam_run.answered') }}</div>
          </div>
          <div class="stat">
            <q-icon name="flag" color="amber-7" size="16px" />
            <div class="stat-value">{{ flaggedCount }}</div>
            <div class="stat-label">{{ $t('exam_run.flagged') }}</div>
          </div>
          <div class="stat">
            <q-icon name="help_outline" color="grey-7" size="16px" />
            <div class="stat-value">{{ unansweredCount }}</div>
            <div class="stat-label">{{ $t('exam_run.open') }}</div>
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
              <span>{{ $t('exam_run.current') }}</span>
            </div>
            <div class="legend-item">
              <div class="legend-color answered"></div>
              <span>{{ $t('exam_run.answered') }}</span>
            </div>
            <div class="legend-item">
              <div class="legend-color flagged"></div>
              <span>{{ $t('exam_run.flagged') }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Exit Dialog -->
    <q-dialog v-model="exitConfirm" persistent>
      <q-card class="exit-dialog">
        <q-card-section class="dialog-header">
          <q-icon name="help_outline" color="primary" size="lg" />
          <h3 class="dialog-title">{{ $t('exam_run.exit.title') }}</h3>
        </q-card-section>

        <q-card-section class="dialog-content">
          <p>{{ $t('exam_run.exit.message') }}</p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn flat @click="exitConfirm = false">
            {{ $t('exam_run.exit.continue') }}
          </q-btn>
          <q-btn color="primary" unelevated @click="exit">
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
      if (type === 'interactive-choice' && Array.isArray(question.dragTargets) && question.dragTargets.length > 0) {
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
      // Safety check to ensure index is within bounds
      if (questions.value.length === 0 || index.value < 0 || index.value >= questions.value.length) {
        return {
          id: '',
          rawImage: '',
          image: '',
          text: '',
          options: [],
          imageCaption: '',
          type: 'multiple',
          dragTargets: []
        }
      }
      
      const question = questions.value[index.value] || {
        id: '',
        rawImage: '',
        image: '',
        text: '',
        options: [],
        imageCaption: '',
        type: 'multiple',
        dragTargets: []
      }

      // Process localized text
      let text = question.text || ''
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
        optionsCount: options?.length || 0,
        options: options,
        questionType: question.type,
        isDragDrop: questionType.value === 'interactive-choice' && Array.isArray(question.dragTargets) && question.dragTargets.length > 0
      })

      return {
        ...question,
        text,
        options
      }
    })

    const currentImage = computed(() => {
      const img = current.value?.image || ''
      console.log('🖼️ Current image for exam', examId, ':', {
        value: img,
        type: typeof img,
        exists: !!img
      })
      return img
    })

    const questionType = computed(() => current.value?.type || 'multiple')
    const isDragDropQuestion = computed(() => {
      return (questionType.value === 'interactive-choice') && 
             Array.isArray(current.value?.dragTargets) && 
             current.value?.dragTargets?.length > 0
    })
    const optionGroup = computed(() => {
      const options = Array.isArray(current.value?.options)
        ? current.value.options.map(o => ({ label: o.label, value: o.id }))
        : []
      
      console.log('🎯 OptionGroup computed:', {
        questionType: questionType.value,
        isDragDrop: isDragDropQuestion.value,
        rawOptions: current.value?.options,
        processedOptions: options
      })
      
      return options
    })
    const indexDisplay = computed(() => index.value + 1)
    const isLastQuestion = computed(() => index.value === questions.value.length - 1)
    const progressPercentage = computed(() => ((index.value + 1) / questions.value.length) * 100)
    const isFlagged = computed(() => flaggedQuestions.value.has(index.value))
    const canProceed = computed(() => {
      const type = questionType.value
      const val = selected.value
      if (type === 'input') return typeof val === 'string' && val.trim().length > 0
      if (Array.isArray(val)) return val.length > 0
      if (isDragDropQuestion.value) return dragOrder.value.length === (current.value?.dragTargets?.length || 0)
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
        if (currentQuestion && currentQuestion.type === 'interactive-choice' && 
            Array.isArray(currentQuestion.dragTargets) && currentQuestion.dragTargets.length > 0) {
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

    function handlePageDragOver(e) {
      // Only allow drag-drop for interactive-choice questions
      if (isDragDropQuestion.value && draggedNumber.value) {
        e.preventDefault()
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move'
        }
        return
      }
      
      // For non-interactive questions, prevent all drag operations
      try {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'none'
        }
        e.preventDefault()
      } catch (_) {
        // no-op
      }
    }

    function handlePageDrop(e) {
      // Only allow drag-drop for interactive-choice questions
      if (isDragDropQuestion.value && draggedNumber.value) {
        // Let the specific drop handlers deal with this
        return
      }
      
      // For non-interactive questions, prevent all file drops
      try {
        const dt = e.dataTransfer
        if (dt && dt.files && dt.files.length > 0) {
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

    // Format drag-drop answer as string with target IDs
    function formatDragDropAnswer(dragOrderArray) {
      if (!Array.isArray(dragOrderArray) || dragOrderArray.length === 0) {
        return ''
      }

      // Sort by number to get correct order and return target IDs
      const sortedOrder = dragOrderArray
        .sort((a, b) => a.number - b.number)
        .map(item => {
          return `${item.number}. ${item.targetId}`
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
          const targetId = match[2].trim()
          
          // Directly use the target ID from the answer string
          assignments.push({
            number: number,
            targetId: targetId
          })
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
        
        if (nextQuestion && nextQuestion.type === 'interactive-choice' && 
            Array.isArray(nextQuestion.dragTargets) && nextQuestion.dragTargets.length > 0) {
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
        
        if (prevQuestion && prevQuestion.type === 'interactive-choice' && 
            Array.isArray(prevQuestion.dragTargets) && prevQuestion.dragTargets.length > 0) {
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
      
      if (targetQuestion && targetQuestion.type === 'interactive-choice' && 
          Array.isArray(targetQuestion.dragTargets) && targetQuestion.dragTargets.length > 0) {
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
      const closestTarget = (current.value?.dragTargets || []).reduce((closest, target) => {
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
      return assignment ? current.value?.dragTargets?.find(target => target.id === assignment.targetId) : null
    }

    function isNumberAssigned(number) {
      return dragOrder.value.some(item => item.number === number)
    }

    function getDragTargetLabel(targetId) {
      const target = current.value?.dragTargets?.find(t => t.id === targetId)
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
      getDragTargetLabel,
      handlePageDragOver,
      handlePageDrop
    }
  }
})
</script>

<style scoped>
/* Main Layout */
.exam-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
}

.loading-text {
  font-size: 16px;
  color: #64748b;
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
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Disable text selection on page, allow in inputs */
.exam-page {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Re-enable selection inside form fields */
input, textarea, .q-field__native {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

/* Prevent dragging images */
.question-image {
  -webkit-user-drag: none;
}

/* Header */
.header {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.exam-info {
  flex: 1;
  min-width: 200px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.question-count {
  font-size: 14px;
  color: #64748b;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 8px;
  font-weight: 600;
  color: #374151;
}

.timer.warning {
  background: #fef2f2;
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 8px;
}

/* Progress */
.progress {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #64748b;
  text-align: center;
}
/* Main Content */
.content {
  display: flex
;
    justify-content: space-between;
  background: white;
  gap:20px;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question {
  margin-bottom: 20px;
}

.question-text {
  font-size: 18px;
  line-height: 1.6;
  color: #1f2937;
  font-weight: 500;
  margin: 0;
}

.image-section {
  margin-bottom: 20px;
}

.question-image {
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  margin: 0 auto;
  display: block;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #9ca3af;
  gap: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.error-text {
  font-size: 14px;
  color: #64748b;
}

.image-caption {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  font-style: italic;
  margin-top: 8px;
}

/* Options Section */
.options-section {
  margin-top: 20px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.option-item:hover {
  border-color: #3b82f6;
  background: #f8faff;
}

.option-item.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.option-radio {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-outer {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.option-item:hover .radio-outer {
  border-color: #3b82f6;
}

.option-item.selected .radio-outer {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
}

.radio-inner.checked {
  background: #fff;
}

.option-label {
  flex: 1;
  font-size: 16px;
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
  font-size: 18px;
}

/* Dropdown Styles */
.dropdown-container {
  width: 100%;
}

/* Input Styles */
.input-container {
  width: 100%;
}

/* Navigation Section */
.navigation-section {
  max-width: 1200px;
  margin: 0 auto 32px auto;
  flex: 1;
  width: 100%;
}

.navigation-container {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.navigation-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 24px 24px 0 0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.nav-btn {
  padding: 16px 32px;
  font-weight: 700;
  border-radius: 16px;
  min-width: 180px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.prev-btn {
  border: 2px solid #667eea;
  color: #667eea;
  background: white;
}

.prev-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.next-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.next-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
}

.spacer {
  flex: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .exam-page {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .title {
    font-size: 20px;
  }

  .question-text {
    font-size: 16px;
  }

  .navigation {
    flex-direction: column;
    gap: 12px;
  }

  .content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .exam-page {
    padding: 12px;
  }

  .header {
    padding: 16px;
  }

  .content {
    padding: 16px;
  }

  .title {
    font-size: 18px;
  }

  .question-text {
    font-size: 15px;
  }
}

/* Overview Dialog */
.overview-dialog {
  width: 400px;
  max-width: 90vw;
  border-radius: 12px;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.overview-title {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  padding: 12px 8px;
}

.stat-value {
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.overview-content {
  padding: 16px;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.question-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  color: #334155;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.question-indicator:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.question-indicator.answered {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #065f46;
}

.question-indicator.current {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.question-indicator.flagged {
  background: #fffbeb;
  border-color: #fde68a;
  color: #b45309;
}

.overview-footer {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
}

.overview-legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid #e2e8f0;
}

.legend-color.current {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.legend-color.answered {
  background: #ecfdf5;
  border-color: #bbf7d0;
}

.legend-color.flagged {
  background: #fffbeb;
  border-color: #fde68a;
}

/* Exit Dialog */
.exit-dialog {
  border-radius: 12px;
  max-width: 400px;
  width: 90vw;
}

.dialog-header {
  text-align: center;
  padding: 24px 24px 0;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin: 16px 0 0 0;
}

.dialog-content {
  padding: 16px 24px;
  text-align: center;
  color: #475569;
  line-height: 1.6;
}

.dialog-actions {
  padding: 0 24px 24px;
  justify-content: center;
  gap: 12px;
}

/* Drag and Drop Styles */
.exam-page:not(.drag-drop-enabled) {
  /* Disable drag-drop interactions for non-interactive questions */
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
}

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
  width: 50px;
  height: 50px;
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

.zone-number {
  width: 32px;
  height: 32px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.drag-drop-interface {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.drag-instructions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 12px;
  background: #eff6ff;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
  color: #1e40af;
  font-weight: 500;
  font-size: 14px;
}

.draggable-numbers {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.draggable-number {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  cursor: grab;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  user-select: none;
}

.draggable-number:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.draggable-number:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.draggable-number.assigned {
  background: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  opacity: 0.7;
}

.current-assignments {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

.assignments-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.assignment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.assignment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.assignment-number {
  font-weight: 700;
  color: #3b82f6;
  min-width: 16px;
}

.assignment-target {
  flex: 1;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
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
