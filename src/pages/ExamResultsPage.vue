<template>
  <q-page class="exam-results-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="80px" />
      <p class="loading-text">Loading results...</p>
    </div>

    <div v-else class="results-container">
      <!-- Results Header -->
      <div class="results-header">
        <div class="result-icon">
          <q-icon
            :name="resultIcon"
            size="120px"
            :color="resultIconColor"
            class="result-icon-large"
          />
        </div>

        <div class="result-message">
          <h1 class="result-title">{{ resultTitle }}</h1>
          <p class="result-subtitle">{{ resultSubtitle }}</p>
        </div>

        <div class="score-display">
          <div class="score-circle" :class="scoreClass">
            <div class="score-inner">
              <div class="score-value">{{ score }}/{{ totalQuestions }}</div>
              <div class="score-label">{{ $t('exam_results.correct') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Details -->
      <div class="results-details">
        <div class="detail-card">
          <div class="detail-icon">
            <q-icon name="quiz" size="24px" color="primary" />
          </div>
          <div class="detail-content">
            <div class="detail-label">{{ $t('exam_results.total_questions') }}</div>
            <div class="detail-value">{{ totalQuestions }}</div>
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-icon">
            <q-icon name="check_circle" size="24px" color="positive" />
          </div>
          <div class="detail-content">
            <div class="detail-label">{{ $t('exam_results.correct_answers') }}</div>
            <div class="detail-value">{{ correctAnswers }}</div>
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-icon">
            <q-icon name="cancel" size="24px" color="negative" />
          </div>
          <div class="detail-content">
            <div class="detail-label">{{ $t('exam_results.incorrect_answers') }}</div>
            <div class="detail-value">{{ incorrectAnswers }}</div>
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-icon">
            <q-icon name="schedule" size="24px" color="info" />
          </div>
          <div class="detail-content">
            <div class="detail-label">{{ $t('exam_results.time_taken') }}</div>
            <div class="detail-value">{{ timeTaken }}</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <q-btn
          outline
          color="primary"
          size="lg"
          class="action-btn retake-btn"
          @click="retakeExam"
        >
          <q-icon name="refresh" class="q-mr-sm" />
          <q-tooltip>{{ $t('exam_results.retake_exam') }}</q-tooltip>
        </q-btn>

        <q-btn
          color="primary"
          size="lg"
          class="action-btn next-btn"
          @click="nextExam"
        >
          <q-icon name="home" class="q-mr-sm" />
          <q-tooltip>{{ $t('exam_results.next_exam') }}</q-tooltip>
        </q-btn>
      </div>

      <!-- Additional Actions -->
      <div class="additional-actions">
        <q-btn
          flat
          color="primary"
          class="view-answers-btn"
          @click="viewAnswers"
        >
          <q-icon name="visibility" class="q-mr-sm" />
          <q-tooltip>{{ $t('exam_results.view_answers') }}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ExamResultsPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const { t: $t, locale } = useI18n()

    // Get exam and attempt IDs from route params
    const examId = route.params.id || '1'
    const attemptId = route.params.attemptId || null
    const attemptData = ref(null)
    const examData = ref(null)
    const userAnswers = ref([])
    const examQuestions = ref([])
    const loading = ref(true)

    // Load exam data and results
    onMounted(() => {
      if (attemptId) {
        loadFromBackend()
      } else {
        // Fallback to localStorage
        loadFromLocalStorage()
      }
    })

    async function loadFromBackend() {
      try {
        loading.value = true
        const response = await api.get(`/exams/attempts/${attemptId}/details`)
        attemptData.value = response.data
        
        // Process exam data with localized title
        const exam = response.data.exam
        let examTitle = exam.title
        if (typeof examTitle === 'object') {
          examTitle = examTitle[locale.value] || examTitle.nl || examTitle.en || `Exam ${examId}`
        }
        examData.value = { ...exam, title: examTitle }
        
        // Process multilingual questions
        examQuestions.value = (response.data.exam.questions || []).map(q => {
          // Process question text
          let text = q.text
          if (typeof text === 'object') {
            text = text[locale.value] || text.nl || text.en || ''
          }
          
          // Process question options
          const options = Array.isArray(q.options) 
            ? q.options.map(opt => {
                let label = opt.label
                if (typeof label === 'object') {
                  label = label[locale.value] || label.nl || label.en || ''
                }
                return { ...opt, label }
              })
            : []
          
          // Process explanation
          let explanation = q.explanation
          if (typeof explanation === 'object') {
            explanation = explanation[locale.value] || explanation.nl || explanation.en || ''
          }
          
          return { ...q, text, options, explanation }
        })
        
        // Extract user answers from attempt data
        userAnswers.value = examQuestions.value.map((question) => {
          const answer = response.data.answers.find(a => a.questionId === question.id)
          return answer ? answer.selectedAnswer : null
        })

        console.log('✅ Loaded exam results from backend:', response.data)
      } catch (error) {
        console.error('❌ Error loading exam results:', error)
        $q.notify({
          type: 'negative',
          message: $t('exam_results.load_error') || 'Failed to load exam results. Loading from cache...',
          position: 'top'
        })
        // Fallback to localStorage
        loadFromLocalStorage()
      } finally {
        loading.value = false
      }
    }

    function loadFromLocalStorage() {
      try {
        // Try to load exam data from localStorage
        const storedData = localStorage.getItem(`exam_${examId}_data`)
        if (storedData) {
          examData.value = JSON.parse(storedData)
          examQuestions.value = examData.value.questions || []
        }

        const storedAnswers = localStorage.getItem(`exam_${examId}_answers`)
        if (storedAnswers) {
          userAnswers.value = JSON.parse(storedAnswers)
        }

        loading.value = false
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        loading.value = false
      }
    }

    // Calculate results
    const totalQuestions = computed(() => {
      if (attemptData.value) {
        return attemptData.value.totalQuestions
      }
      return examQuestions.value.length
    })

    const correctAnswers = computed(() => {
      if (attemptData.value) {
        return attemptData.value.correctAnswers
      }
      return examQuestions.value.reduce((count, question, index) => {
        const userAnswer = userAnswers.value[index]
        return userAnswer === question.correct ? count + 1 : count
      }, 0)
    })

    const incorrectAnswers = computed(() => totalQuestions.value - correctAnswers.value)

    const score = computed(() => {
      if (attemptData.value) {
        return attemptData.value.score
      }
      return correctAnswers.value
    })

    const scorePercentage = computed(() => {
      if (totalQuestions.value === 0) return 0
      return Math.round((correctAnswers.value / totalQuestions.value) * 100)
    })

    const isPassed = computed(() => {
      if (attemptData.value) {
        return attemptData.value.passed
      }
      return scorePercentage.value >= 70 // 70% passing grade
    })

    const resultIcon = computed(() => isPassed.value ? 'thumb_up' : 'thumb_down')
    const resultIconColor = computed(() => isPassed.value ? 'positive' : 'negative')

    const resultTitle = computed(() => {
      return isPassed.value
        ? $t('exam_results.passed_title')
        : $t('exam_results.failed_title')
    })

    const resultSubtitle = computed(() => {
      return $t('exam_results.result_subtitle', {
        score: score.value,
        total: totalQuestions.value,
        examId: examId
      })
    })

    const scoreClass = computed(() => {
      if (scorePercentage.value >= 80) return 'score-excellent'
      if (scorePercentage.value >= 70) return 'score-good'
      if (scorePercentage.value >= 50) return 'score-average'
      return 'score-poor'
    })

    const timeTaken = computed(() => {
      if (attemptData.value && attemptData.value.timeSpentSeconds) {
        const minutes = Math.floor(attemptData.value.timeSpentSeconds / 60)
        const seconds = attemptData.value.timeSpentSeconds % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }
      return '00:00'
    })

    // Navigation functions
    function retakeExam() {
      // Clear previous answers
      localStorage.removeItem(`exam_${examId}_answers`)
      localStorage.removeItem(`exam_${examId}_timing`)

      // Navigate to exam intro
      router.push(`/exam/${examId}`)
    }

    function nextExam() {
      const nextExamId = parseInt(examId) + 1
      if (nextExamId <= 7) {
        router.push(`/exam/${nextExamId}`)
      } else {
        // All exams completed, go to dashboard
        router.push('/')
      }
    }

    function viewAnswers() {
      // Navigate to answers review page
      if (attemptId) {
        router.push(`/exam/${examId}/answers/${attemptId}`)
      } else {
        router.push(`/exam/${examId}/answers`)
      }
    }

    return {
      examId,
      attemptId,
      attemptData,
      examData,
      userAnswers,
      examQuestions,
      loading,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      scorePercentage,
      isPassed,
      resultIcon,
      resultIconColor,
      resultTitle,
      resultSubtitle,
      scoreClass,
      timeTaken,
      retakeExam,
      nextExam,
      viewAnswers
    }
  }
})
</script>

<style scoped>
.exam-results-page {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); */
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.results-container {
  /* max-width: 800px; */
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

/* Results Header */
.results-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 40px;
}

.result-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-icon-large {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.result-message {
  text-align: center;
}

.result-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #1e293b;
}

.result-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.score-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 8px solid #e2e8f0;
}

.score-circle.score-excellent {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.score-circle.score-good {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.score-circle.score-average {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
}

.score-circle.score-poor {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fecaca);
}

.score-inner {
  text-align: center;
}

.score-value {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.score-label {
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
}

/* Results Details */
.results-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.detail-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.detail-content {
  flex: 1;
  text-align: left;
}

.detail-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.detail-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
}

.action-btn {
  min-width: 200px;
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.retake-btn {
  /* border: 2px solid #3b82f6; */
  color: #3b82f6;
}

.retake-btn:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.next-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* Additional Actions */
.additional-actions {
  display: flex;
  justify-content: center;
}

.view-answers-btn {
  font-size: 16px;
  font-weight: 500;
  text-decoration: underline;
}

.view-answers-btn:hover {
  background: #f1f5f9;
  border-radius: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .results-container {
    padding: 20px;
    margin: 10px;
  }

  .results-header {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .result-title {
    font-size: 36px;
  }

  .score-circle {
    width: 150px;
    height: 150px;
  }

  .score-value {
    font-size: 28px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 300px;
  }

  .results-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .exam-results-page {
    padding: 10px;
  }

  .results-container {
    padding: 16px;
  }

  .result-title {
    font-size: 28px;
  }

  .result-subtitle {
    font-size: 16px;
  }

  .score-circle {
    width: 120px;
    height: 120px;
  }

  .score-value {
    font-size: 24px;
  }
}
</style>
