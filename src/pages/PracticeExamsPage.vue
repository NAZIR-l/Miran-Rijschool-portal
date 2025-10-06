<template>
  <q-page class="exams-page">
    <div class="exams">
      <div class="exams-header">
        <h2>{{ $t('practice.title') }}</h2>
      </div>
      <div class="exams-body">
        <div class="exams-grid">
          <div class="exam-item" v-for="n in 7" :key="n">
            <div class="item-left">
              <div class="exam-number">0{{ n }}</div>
              <!-- متصلة مع بعض -->
              <div class="exam-progress" :class="statusClass(n)">
              <div class="status-chip" :class="statusClass(n)">
                <div class="status-icon">{{ statusIcon(n) }}</div>
                <span>{{ $t('practice.status.' + statusKey(n)) }}</span>
                </div>
                <div class="status-bar" :class="statusClass(n)"></div>
              </div>
            </div>
            <div class="item-right">
              <q-btn v-if="n === 1" flat no-caps color="primary" class="link" @click="go(n)">{{ $t('practice.actions.retry') }}</q-btn>
              <q-btn v-else flat no-caps color="primary" class="link" @click="go(n)">{{ $t('practice.actions.start') }}</q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "PracticeExamsPage",
  setup() {
    const router = useRouter();
    function statusClass(n) {
      if (n === 1) return "failed";
      return "new";
    }
    function statusIcon(n) {
      if (n === 1) return "😕";
      return "👀";
    }
    function statusKey(n) {
      if (n === 1) return 'failed';
      return 'new';
    }
    function go(n){
      try { router.push(`/exam/${n}`) } catch(e) {}
    }
    return { statusClass, statusIcon, statusKey, go };
  },
});
</script>

<style scoped lang="scss">
.exams-page {
  display: flex;
  justify-content: center;
}

.exams {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  height: max-content;
  border-radius: 12px;
  border-top: 5px solid #2b3bff;
  padding: 0 5%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.q-page {
  min-height: max-content !important;
}
.exams-header {
  padding: 18px 22px 0;
}
.exams-header h2 {
  font-size: 18px;
  color: #281931;
  margin: 0 0 0.5em;
  font-weight: 700;
}

.exams-body {
  padding: 18px 50px 24px;
  margin: 0px 20px;
}

/* شبكة 2 أعمدة */
.exams-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 28px;
}

@media (max-width: 900px) {
  .exams-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile-friendly paddings so rows can span full width */
@media (max-width: 820px) {
  .exams {
    width: 100%;
    margin: 12px;
    padding: 0;
  }
  .exams-header { padding: 14px 16px 6px; }
  .exams-body { padding: 14px 16px 16px; margin: 0; }
  .exams-grid { grid-template-columns: 1fr; }
}

.exam-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 24px;
  padding: 16px 18px 16px 24px;
  min-width: 0;
  overflow: hidden;
  width: 100%;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

/* الرقم */
.exam-number {
  font-weight: 500;
  font-size: 16px;
  color: #0f172a;
}

/* البار والستاتس قطعة واحدة */
.exam-progress {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  border-radius: 22px;
}

.status-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  padding: 6px 10px 6px 6px;
  border-radius: 22px 0 0 22px;
}

.status-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: #fff7ed;
  border: 2px solid #ff7300;
}

.status-bar {
  flex: 1;
  height: 40px;
  border-radius: 0 22px 22px 0;
}

/* حالات */
.status-chip.failed {
  color: #d13c00;
  background: #ffe9df;
}
.status-bar.failed {
  background: #ffe6de;
}
.status-chip.new {
  color: #1f2937;
  background: #eef1f4;
}
.status-bar.new {
  background: #e6e9ee;
}

/* زر */
.item-right .link {
  font-weight: 600;
  position: relative;
}
.item-right .link::after {
  content: "";
  display: block;
  height: 2px;
  background: #2b3bff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.item-right .link:hover::after {
  transform: scaleX(1);
}
</style>
