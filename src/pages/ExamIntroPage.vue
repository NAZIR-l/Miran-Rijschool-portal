<template>
  <q-page class="exam-page">
    <!-- Header: same structure/design as ExamRunPage -->
    <header class="exam-header">
      <div class="header-content">
        <div class="header-left">
          <img src="../assets/Logo-test1.png" alt="Logo" class="header-logo" />
        </div>

        <div class="header-right">
          <q-btn flat round dense icon="logout" class="action-btn exit-btn" @click="askExit">
            <q-tooltip>Examen beëindigen</q-tooltip>
          </q-btn>
        </div>
      </div>
    </header>

    <div class="intro-surface">
      <div class="intro">
        <h1 class="intro-title">{{ $t('exam_intro.title') }}</h1>



        <p>{{ $t('exam_intro.p1') }}</p>
        <p>{{ $t('exam_intro.p2', { total: TOTAL_QUESTIONS, pass: PASS_SCORE }) }}</p>
        <p class="muted">
          <q-icon name="info" color="pink-5" class="q-mr-sm" />
          {{ $t('exam_intro.note') }}
        </p>

        <q-btn unelevated no-caps class="cta grad" @click="start">
          {{ $t('exam_intro.cta') }}
          <q-icon name="arrow_forward" class="q-ml-sm" />
        </q-btn>
      </div>
    </div>

    <!-- Exit Bevestiging Dialog -->
    <q-dialog v-model="exitConfirm" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <q-icon name="help_outline" color="primary" size="lg" />
          <h3 class="dialog-title">Examen Verlaten?</h3>
        </q-card-section>

        <q-card-section class="dialog-content">
          <p>Weet u zeker dat u het examen wilt verlaten? Uw voortgang zal niet worden opgeslagen.</p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            no-caps
            class="cancel-btn"
            @click="exitConfirm = false"
          >
            Verder met Examen
          </q-btn>
          <q-btn
            color="primary"
            unelevated
            no-caps
            class="confirm-btn"
            @click="exit"
          >
            Examen Stoppen
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const TOTAL_QUESTIONS = 50
const PASS_SCORE = 44

export default defineComponent({
  name: 'ExamIntroPage',
  setup(){
    const route = useRoute()
    const router = useRouter()
    const exitConfirm = ref(false)
    // Timer to match the run-page header style
    const remaining = ref(30 * 60)
    let timer
    onMounted(() => {
      timer = setInterval(() => {
        remaining.value = Math.max(remaining.value - 1, 0)
      }, 1000)
    })
    onBeforeUnmount(() => { if (timer) clearInterval(timer) })
    const formattedTime = computed(() => {
      const m = Math.floor(remaining.value / 60).toString().padStart(2, '0')
      const s = (remaining.value % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    })
    function start(){
      const id = route.params.id
      try { router.push(`/exam/${id}/run`) } catch(e) {}
    }
    function askExit(){ exitConfirm.value = true }
    function exit(){ try { router.back() } catch(e) {} }
    return { start, askExit, exit, TOTAL_QUESTIONS, PASS_SCORE, exitConfirm, remaining, formattedTime }
  }
})
</script>

<style scoped>
 .exam-page{ display:block; }
 /* Header styles aligned with ExamRunPage */
 .exam-header { background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.05); border-radius:20px; margin-bottom:16px; }
 .header-content { max-width:1400px; margin:0 auto; padding:12px 24px; display:flex; justify-content:space-between; align-items:center; }
 .header-left { display:flex; align-items:center; gap:16px; }
 .header-logo { height:32px; width:auto; }
 .header-center { flex:1; display:flex; justify-content:center; }
 .timer-container { display:flex; align-items:center; gap:12px; background:#f8fafc; padding:8px 16px; border-radius:12px; border:1px solid #e2e8f0; }
 .timer-icon { color:#64748b; font-size:20px; }
 .timer-content { text-align:center; }
 .timer-label { font-size:12px; color:#64748b; font-weight:500; }
 .timer-value { font-size:18px; font-weight:700; color:#0f172a; font-family:'Courier New', monospace; }
 .timer-value.warning { color:#dc2626; animation: pulse 2s infinite; }
 @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.7} }
 .header-right { display:flex; align-items:center; gap:8px; }
 .action-btn { color:#64748b; transition:all .3s ease; }
 .action-btn:hover { background:#f1f5f9; color:#334155; }
 .exit-btn:hover { background:#fef2f2; color:#dc2626; }
.intro-surface{ max-width:1900px; width:100%; margin:16px auto; background:#fff; border-radius:12px; box-shadow:0 1px 2px rgba(0,0,0,.06); display:flex; flex-direction:column;}
.intro{ max-width:820px; width:100%; align-self:center; text-align:center; padding:48px 24px 64px; }
.intro h1{ font-size:40px; margin:12px 0 28px; color:#1d1630; }
.intro p{ font-size:18px; line-height:1.8; color:#374151; margin:8px 0; }
.intro .muted{ color:#6b7280; }
.cta{ margin-top:20px; padding:10px 22px; }
.grad{ background: linear-gradient(90deg, #1677ff, #3536ff); color:#fff; }
.stats{ display:flex; justify-content:center; gap:18px; margin: 6px 0 18px; }
.stat{ display:flex; align-items:center; gap:8px; color:#374151; background:#f8fafc; border:1px solid #eef2f6; padding:6px 10px; border-radius:8px; }

@media (max-width: 820px){
  .header-content{ padding:12px 16px; }
  .header-logo{ height:24px; }
  .intro-surface{ margin:12px auto; }
  .intro{ padding:32px 16px 40px; }
  .intro h1{ font-size:28px; margin-bottom:16px; }
  .intro p{ font-size:16px; }
}

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
</style>


