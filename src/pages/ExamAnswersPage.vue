<template>
  <q-page class="exam-answers-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="80px" />
      <p class="loading-text">{{ $t('exam_answers.loading') || 'Loading answers...' }}</p>
    </div>

    <div v-else class="answers-container">
      <!-- Header -->
      <div class="answers-header">
        <div class="header-content">
          <div class="back-button">
            <q-btn
              flat
              round
              icon="arrow_back"
              color="primary"
              @click="goBack"
            >
              <q-tooltip>{{ $t('common.back') }}</q-tooltip>
            </q-btn>
          </div>
          <div class="header-titles">
            <h1 class="page-title">{{ $t('exam_answers.title')}}</h1>
            <p class="page-subtitle">{{ $t('exam_answers.subtitle') }}</p>
          </div>
        </div>

        <!-- Summary Bar -->
        <div class="summary-bar">
          <div class="summary-item">
            <q-icon name="list_alt" color="primary" size="20px" />
            <span class="summary-label">{{ $t('exam_answers.total_questions') || 'Questions' }}</span>
            <span class="summary-value">{{ totalQuestions }}</span>
          </div>
          <div class="summary-item">
            <q-icon name="check_circle" color="positive" size="20px" />
            <span class="summary-label">{{ $t('exam_answers.correct') || 'Correct' }}</span>
            <span class="summary-value positive">{{ totalCorrect }}</span>
          </div>
          <div class="summary-item">
            <q-icon name="cancel" color="negative" size="20px" />
            <span class="summary-label">{{ $t('exam_answers.incorrect') || 'Incorrect' }}</span>
            <span class="summary-value negative">{{ totalIncorrect }}</span>
          </div>
        </div>
      </div>

      <!-- Answers List -->
      <div class="answers-list">
        <div
          v-for="(question, index) in examQuestions"
          :key="question.id"
          class="answer-item"
          :class="{ 'correct': isCorrect(index), 'incorrect': !isCorrect(index) }"
        >
          <div class="question-header">
            <div class="question-number">
              {{ $t('exam_answers.question') }} {{ index + 1 }}
            </div>
            <div class="status-chip" :class="isCorrect(index) ? 'is-correct' : 'is-incorrect'">
              <q-icon :name="isCorrect(index) ? 'check_circle' : 'cancel'" size="16px" />
              <span>{{ isCorrect(index) ? ($t('common.correct') || 'Correct') : ($t('common.incorrect') || 'Incorrect') }}</span>
            </div>
          </div>

          <div class="question-content">
            <div class="question-text">
              {{ question.text }}
            </div>

            <div class="question-layout">
              <div class="question-media" v-if="question.image">
                <q-img
                  :src="getImageSrc(question.image)"
                  ratio="16/9"
                  class="answer-image"
                >
                  <template v-slot:error>
                    <div class="image-error">
                      <q-icon name="image_not_supported" size="48px" color="grey-4" />
                    </div>
                  </template>
                </q-img>
              </div>

              <div class="question-details">
                <div class="answers-comparison">
                  <div class="user-answer">
                    <div class="answer-label">{{ $t('exam_answers.your_answer') }}</div>
                    <div class="answer-value" :class="{ 'correct': isCorrect(index), 'incorrect': !isCorrect(index) }">
                      {{ getUserAnswer(index) }}
                    </div>
                  </div>

                  <div class="correct-answer" v-if="!isCorrect(index)">
                    <div class="answer-label">{{ $t('exam_answers.correct_answer') }}</div>
                    <div class="answer-value correct">
                      {{ getCorrectAnswer(index) }}
                    </div>
                  </div>
                </div>

                <div class="explanation" v-if="question.explanation">
                  <div class="explanation-label">
                    <q-icon name="info" size="sm" />
                    {{ $t('exam_answers.explanation') }}
                  </div>
                  <div class="explanation-text">
                    {{ question.explanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <q-btn
          outline
          color="primary"
          size="lg"
          @click="retakeExam"
        >
          <q-icon name="refresh" class="q-mr-sm" />
          <q-tooltip>{{ $t('exam_answers.retake_exam') }}</q-tooltip>
        </q-btn>

        <q-btn
          color="primary"
          size="lg"
          @click="goToResults"
        >
          <q-icon name="assessment" class="q-mr-sm" />
          <q-tooltip>{{ $t('exam_answers.back_to_results') }}</q-tooltip>
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
  name: 'ExamAnswersPage',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const { locale, t } = useI18n()

    const examId = route.params.id || '1'
    const attemptId = route.params.attemptId || null
    const attemptData = ref(null)
    const examData = ref(null)
    const userAnswers = ref([])
    const examQuestions = ref([])
    const loading = ref(true)

    onMounted(() => {
      if (attemptId) {
        loadFromBackend()
      } else {
        loadFromLocalStorage()
      }
    })

    async function loadFromBackend() {
      try {
        loading.value = true
        const response = await api.get(`/exams/attempts/${attemptId}/details`)
        attemptData.value = response.data
        examData.value = response.data.exam
        examQuestions.value = response.data.exam.questions || []

        // Process multilingual text
        examQuestions.value = examQuestions.value.map(q => {
          let text = q.text
          if (typeof text === 'object') {
            text = text[locale.value] || text.nl || text.en || ''
          }

          // Process options
          const options = Array.isArray(q.options)
            ? q.options.map(opt => {
                let label = opt.label
                if (typeof label === 'object') {
                  label = label[locale.value] || label.nl || label.en || ''
                }
                return { ...opt, label }
              })
            : []

          // Explanation (map from reason/explanation with locale)
          let explanation = q.explanation || q.reason
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

        console.log('✅ Loaded exam answers from backend')
      } catch (error) {
        console.error('❌ Error loading exam answers:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load exam answers. Loading from cache...',
          position: 'top'
        })
        loadFromLocalStorage()
      } finally {
        loading.value = false
      }
    }

    function getImageSrc(imagePath) {
      if (!imagePath) return ''
      if (/^https?:\/\//.test(imagePath) || imagePath.startsWith('/')) return imagePath
      try {
        return new URL(`../assets/${imagePath}`, import.meta.url).href
      } catch (e) {
        try {
          return new URL(`../assets/${String(imagePath).replace(/^\.\/?/, '')}`, import.meta.url).href
        } catch (e2) {
          return ''
        }
      }
    }
    function loadFromLocalStorage() {
      try {
        const storedData = localStorage.getItem(`exam_${examId}_data`)
        if (storedData) {
          examData.value = JSON.parse(storedData)

          // Process multilingual questions from localStorage
          examQuestions.value = (examData.value.questions || []).map(q => {
            let text = q.text
            if (typeof text === 'object') {
              text = text[locale.value] || text.nl || text.en || ''
            }

            const options = Array.isArray(q.options)
              ? q.options.map(opt => {
                  let label = opt.label
                  if (typeof label === 'object') {
                    label = label[locale.value] || label.nl || label.en || ''
                  }
                  return { ...opt, label }
                })
              : []

            let explanation = q.explanation || q.reason
            if (typeof explanation === 'object') {
              explanation = explanation[locale.value] || explanation.nl || explanation.en || ''
            }

            return { ...q, text, options, explanation }
          })
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

    function isCorrect(questionIndex) {
      const question = examQuestions.value[questionIndex]
      const userAnswer = userAnswers.value[questionIndex]
      return userAnswer === question.correct
    }

    function getUserAnswer(questionIndex) {
      const question = examQuestions.value[questionIndex]
      const userAnswer = userAnswers.value[questionIndex]

      if (!userAnswer) {
        return t('exam_answers.no_answer')
      }

      if (question.type === 'multiple' || question.type === 'dropdown') {
        const option = question.options?.find(opt => opt.id === userAnswer)
        return option ? option.label : userAnswer
      }

      return userAnswer
    }

    function getCorrectAnswer(questionIndex) {
      const question = examQuestions.value[questionIndex]

      if (question.type === 'multiple' || question.type === 'dropdown') {
        const option = question.options?.find(opt => opt.id === question.correct)
        return option ? option.label : question.correct
      }

      return question.correct
    }

    function goBack() {
      router.go(-1)
    }

    function retakeExam() {
      router.push(`/exam/${examId}`)
    }

    function goToResults() {
      if (attemptId) {
        router.push(`/exam/${examId}/results/${attemptId}`)
      } else {
        router.push(`/exam/${examId}/results`)
      }
    }

    const totalQuestions = computed(() => examQuestions.value.length)
    const totalCorrect = computed(() => {
      return userAnswers.value.reduce((acc, ans, idx) => acc + (ans === examQuestions.value[idx]?.correct ? 1 : 0), 0)
    })
    const totalIncorrect = computed(() => Math.max(totalQuestions.value - totalCorrect.value, 0))

    return {
      examId,
      attemptId,
      attemptData,
      examData,
      userAnswers,
      examQuestions,
      loading,
      isCorrect,
      getUserAnswer,
      getCorrectAnswer,
      goBack,
      getImageSrc,
      retakeExam,
      goToResults,
      totalQuestions,
      totalCorrect,
      totalIncorrect
    }
  }
})
</script>

<style scoped>
.exam-answers-page {
  min-height: 100vh;
  padding: 20px;
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

.answers-container {
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 12px;
  padding-right: 12px;
}

.answers-header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}


.page-title {
  font-size: clamp(20px, 2.2vw, 28px);
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin: 0 0 4px 0;
}

.page-subtitle {
  color: #64748b;
  margin: 0;
  font-size: clamp(14px, 1.6vw, 16px);
}

.header-titles p {
  color: #64748b;
  margin: 0;
  font-size: 16px;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.answer-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e2e8f0;
}

.answer-item.correct {
  border-left-color: #10b981;
}

.answer-item.incorrect {
  border-left-color: #ef4444;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status-chip.is-correct {
  color: #065f46;
  background: #ecfdf5;
  border: 1px solid #10b981;
}

.status-chip.is-incorrect {
  color: #7f1d1d;
  background: #fef2f2;
  border: 1px solid #ef4444;
}

.question-number {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 900px) {
  .question-layout {
    grid-template-columns: 1fr 1.2fr;
    align-items: start;
  }
}

.question-text {
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.question-media {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.answer-image {
  width: 100%;
  max-height: 360px;
}

.answers-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}

.user-answer,
.correct-answer {
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.answer-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.answer-value {
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  background: white;
  border: 2px solid #e2e8f0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.answer-value.correct {
  color: #059669;
  border-color: #10b981;
  background: #ecfdf5;
}

.answer-value.incorrect {
  color: #dc2626;
  border-color: #ef4444;
  background: #fef2f2;
}

.explanation {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
}

.explanation-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 8px;
}

.explanation-text {
  color: #0c4a6e;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons .q-btn {
  min-width: 200px;
}

@media (max-width: 768px) {
  .answers-comparison {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons .q-btn {
    width: 100%;
    max-width: 300px;
  }

  .answer-image { max-height: 220px; }
  .answer-item { padding: 16px; }
}

.summary-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: center;
  margin-top: 16px;
}

.summary-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 8px 12px;
}

.summary-label {
  color: #64748b;
  font-weight: 600;
}

.summary-value {
  font-weight: 800;
  color: #1f2937;
}

.summary-value.positive { color: #059669; }
.summary-value.negative { color: #dc2626; }
</style>
