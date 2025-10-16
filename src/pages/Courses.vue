<template>
  <section class="pricing-section container-lg">
    <!-- Main Category Toggle -->
    <div class="category-toggle-wrapper">
      <div class="category-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'lessons' }]"
          @click="viewMode = 'lessons'"
        >
          <q-icon name="directions_car" size="24px" />
          <span>{{ t('packages.driving_lessons') }}</span>
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'exams' }]"
          @click="viewMode = 'exams'"
        >
          <q-icon name="assignment" size="24px" />
          <span>{{ t('packages.exam_packages') }}</span>
        </button>
      </div>
    </div>

    <!-- Driving Lessons View -->
    <div v-if="viewMode === 'lessons'" class="view-section">
      <h1 class="section-title">{{ t('packages.title') }}</h1>

      <!-- Tabs -->
      <q-tabs
        v-model="activeTab"
        class="tabs pill-tabs"
        active-color="white"
        indicator-color="transparent"
        dense
        no-caps
      >
        <q-tab name="hand" :label="t('packages.manual')" class="pill-tab" />
        <q-tab name="auto" :label="t('packages.automatic')" class="pill-tab" />
        <q-tab name="her" :label="t('packages.retake')" class="pill-tab" />
      </q-tabs>

      <q-separator spaced color="transparent" class="tab-separator" />

    <!-- Panels -->
    <q-tab-panels v-model="activeTab" animated swipeable transition-prev="slide-right" transition-next="slide-left">
      <!-- Tab panel -->
      <q-tab-panel v-for="tab in ['hand','auto','her']" :key="tab" :name="tab">
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner color="primary" size="50px" />
        </div>
        <div v-else class="cards-grid">
          <q-card
            v-for="(p, i) in pakketten[tab]"
            :key="`${tab}-${i}`"
            flat
            bordered
            :class="['price-card', heroClass(i), selected === `${tab}-${i}` ? 'is-selected' : '']"
            @click="selectCard(`${tab}-${i}`, $event)"
            @keydown.enter.prevent="selectCard(`${tab}-${i}`, $event)"
            @keydown.space.prevent="selectCard(`${tab}-${i}`, $event)"
            role="button"
            tabindex="0"
            :aria-pressed="selected === `${tab}-${i}`"
            :aria-label="`${p.name} €${p.coursePrice}`"
            v-ripple
          >
            <div v-if="i === 1" class="badge">{{ t('packages.retake_note') }}</div>

            <div class="card-body">
              <div class="title-row">
                <q-radio v-model="selected" :val="`${tab}-${i}`" color="primary" size="md" />
                <div class="title">{{ p.name }}</div>
                <div class="spacer"></div>
                <div class="price">€{{ p.coursePrice }}</div>
              </div>
              <div class="meta small old-price">
                {{ t('packages.normal_price') }}: <del>€{{ p.regularPrice }}</del>
              </div>
              <div class="divider"></div>
              <ul class="features">
                <li>
                  <q-icon name="check_circle" color="positive" size="18px" />
                  <span>{{ p.description }}</span>
                </li>
                <li>
                  <q-icon name="schedule" color="primary" size="18px" />
                  <span>{{ p.lessonDuration }} min per lesson</span>
                </li>
                <li v-if="p.hasFreeExam">
                  <q-icon name="star" color="warning" size="18px" />
                  <span>FREE practical exam</span>
                </li>
              </ul>
              <div class="card-footer">
                <q-btn
                  no-caps
                  unelevated
                  color="primary"
                  class="cta-btn"
                  :label="t('packages.cta')"
                  icon-right="arrow_forward"
                  @click.stop="handlePurchase(p)"
                />
              </div>
            </div>
          </q-card>
        </div>
      </q-tab-panel>
    </q-tab-panels>

  <!-- Notes -->
  <div class="notes-box">
    <div class="notes-header">
      <q-icon name="info" size="28px" color="primary" />
      <h3>{{ t('packages.notes_title') }}</h3>
    </div>
    <ul class="notes-list">
      <li>
        <q-icon name="schedule" color="primary" size="18px" />
        <span>{{ t('packages.notes_0') }}</span>
      </li>
      <li>
        <q-icon name="verified" color="primary" size="18px" />
        <span>{{ t('packages.notes_1') }}</span>
      </li>
      <li>
        <q-icon name="error_outline" color="primary" size="18px" />
        <span>{{ t('packages.notes_2') }}</span>
      </li>
    </ul>
  </div>
    </div>

    <!-- Exam Packages View -->
    <div v-if="viewMode === 'exams'" class="view-section exam-view">
      <h1 class="section-title">{{ t('packages.exam_section_title') }}</h1>
      <p class="section-subtitle">{{ t('packages.exam_section_subtitle') }}</p>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="50px" />
      </div>

      <div v-else class="exam-packages-wrapper">
        <!-- Pricing Cards -->
        <div class="exam-cards-grid">
          <!-- Exam Package Card -->
          <div
            v-for="(exam, index) in examPackages"
            :key="exam.id"
            :class="['exam-card', getExamVariantClass(exam.code), { 'is-selected': selectedExam===exam.code, 'deluxe-card': exam.code === 'exam-deluxe' }]"
            @click="selectExam(exam.code)"
            @keydown.enter.prevent="selectExam(exam.code)"
            @keydown.space.prevent="selectExam(exam.code)"
            role="button"
            tabindex="0"
            v-ripple
          >
            <div v-if="exam.code === 'exam-deluxe'" class="recommended-badge">
              <q-icon name="star" class="badge-icon" />
              {{ t('packages.recommended') }}
            </div>
            <div class="exam-card-image">
              <img :src="getExamImage(exam.code)" :alt="exam.name" class="exam-plan-image" />
            </div>
            <div class="exam-card-body">
              <div class="exam-plan-header">
                <div class="exam-title">{{ exam.name }}</div>
                <div class="exam-price">€{{ exam.coursePrice }}</div>
              </div>
              <div class="exam-meta">{{ exam.description }}</div>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="exam-features-section">
          <div class="exam-features-card">
            <div class="exam-features-list">
              <div class="exam-feature-item">
                <q-icon name="check_circle" color="positive" size="20px" />
                <span>{{ t('packages.exam_feature_1') }}</span>
              </div>
              <div class="exam-feature-item">
                <q-icon name="check_circle" color="positive" size="20px" />
                <span>{{ t('packages.exam_feature_2') }}</span>
              </div>
              <div class="exam-feature-item">
                <q-icon name="check_circle" color="positive" size="20px" />
                <span>{{ t('packages.exam_feature_3') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="exam-cta-section">
          <q-btn
            no-caps
            unelevated
            size="lg"
            color="primary"
            class="exam-cta-btn"
            :label="t('packages.cta')"
            icon-right="arrow_forward"
            :disabled="!selectedExam"
            @click="handleExamPurchase"
          />
          <div v-if="!selectedExam" class="exam-selection-hint">
            {{ t('packages.exam_select_hint') }}
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { Cookies } from "quasar";

// Import exam package images
import liteImage from "../assets/assets/lite.png";
import deluxImage from "../assets/assets/delux.png";
import premiumImage from "../assets/assets/premium.png";

export default defineComponent({
  name: "RijlesPakketten",
  setup() {
    const { t, locale } = useI18n();
    const $q = useQuasar();
    const router = useRouter();
    const viewMode = ref("lessons");
    const activeTab = ref("hand");
    const selected = ref("hand-1");
    const selectedExam = ref("exam-deluxe");
    const pakketten = ref({
      hand: [],
      auto: [],
      her: [],
    });
    const examPackages = ref([]);
    const loading = ref(true);

    // Authentication check
    const isAuthenticated = computed(() => !!Cookies.get('auth_token'));

    const icons = { hand: "directions_car_filled", auto: "electric_car", her: "restart_alt" };

    async function fetchPackages() {
      try {
        loading.value = true;
        const response = await api.get("/exams/courses", {
          params: { locale: locale.value }
        });
        pakketten.value = response.data;
        examPackages.value = response.data.exams || [];
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        if ($q && $q.notify) {
          $q.notify({
            type: "negative",
            message: t("errors.failed_to_load_packages") || "Failed to load packages",
            position: "top"
          });
        }
        // Fallback to empty arrays
        pakketten.value = {
          hand: [],
          auto: [],
          her: [],
        };
        examPackages.value = [];
      } finally {
        loading.value = false;
      }
    }

    async function handlePurchase(pkg) {
      try {
        if ($q && $q.loading) {
          $q.loading.show({ message: t("packages.processing") || "Processing..." });
        }

        let response;

        if (isAuthenticated.value) {
          // Authenticated user - use purchase endpoint
          response = await api.post(`/payments/purchase/${pkg.id}`);
        } else {
          // Guest user - use checkout endpoint
          response = await api.post('/payments/checkout', {
            courseId: pkg.id,
            privacyAccepted: true,
            marketingOptIn: false
          });
        }

        if (response.data?.checkoutUrl) {
          // Redirect to payment provider
          window.location.href = response.data.checkoutUrl;
        }
      } catch (error) {
        console.error("Failed to initiate payment:", error);
        if ($q && $q.notify) {
          $q.notify({
            type: "negative",
            message: error.response?.data?.message || t("errors.payment_failed") || "Failed to initiate payment",
            position: "top"
          });
        }
      } finally {
        if ($q && $q.loading) {
          $q.loading.hide();
        }
      }
    }

    function heroClass(i) {
      const variants = ["variant-blue", "variant-blue", "variant-blue", "variant-blue"];
      return variants[i % variants.length];
    }

    function iconFor(tab) {
      return icons[tab];
    }

    function selectCard(key, evt) {
      selected.value = key;
      const el = evt?.currentTarget;
      if (el && window.innerWidth < 768) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function selectExam(plan) {
      selectedExam.value = plan;
    }

    function getExamByCode(code) {
      return examPackages.value.find(exam => exam.code === code);
    }

    function getExamVariantClass(code) {
      if (code.includes('lite')) return 'variant-lite';
      if (code.includes('deluxe')) return 'variant-deluxe';
      if (code.includes('vip') || code.includes('premium')) return 'variant-premium';
      return 'variant-lite'; // fallback
    }

    function getExamImage(code) {
      if (code.includes('lite')) return liteImage;
      if (code.includes('deluxe')) return deluxImage;
      if (code.includes('vip') || code.includes('premium')) return premiumImage;
      return liteImage; // fallback
    }

    async function handleExamPurchase() {
      if (!selectedExam.value) return;

      try {
        if ($q && $q.loading) {
          $q.loading.show({ message: t("packages.processing") || "Processing..." });
        }

        const selectedExamData = getExamByCode(selectedExam.value);
        if (!selectedExamData) {
          throw new Error("Selected exam package not found");
        }

        let response;

        if (isAuthenticated.value) {
          // Authenticated user - use purchase endpoint
          response = await api.post(`/payments/purchase/${selectedExamData.id}`);
        } else {
          // Guest user - use checkout endpoint
          response = await api.post('/payments/checkout', {
            courseId: selectedExamData.id,
            plan: selectedExam.value.replace('exam-', ''), // Convert exam-deluxe to deluxe
            privacyAccepted: true,
            marketingOptIn: false
          });
        }

        if (response.data?.checkoutUrl) {
          // Redirect to payment provider
          window.location.href = response.data.checkoutUrl;
        }
      } catch (error) {
        console.error("Failed to initiate payment:", error);
        if ($q && $q.notify) {
          $q.notify({
            type: "negative",
            message: error.response?.data?.message || t("errors.payment_failed") || "Failed to initiate payment",
            position: "top"
          });
        }
      } finally {
        if ($q && $q.loading) {
          $q.loading.hide();
        }
      }
    }

    onMounted(() => {
      fetchPackages();
    });

    return { t, viewMode, activeTab, selected, selectedExam, pakketten, examPackages, heroClass, selectCard, selectExam, iconFor, loading, handlePurchase, handleExamPurchase, getExamVariantClass, getExamImage, isAuthenticated };
  },
});
</script>


<style scoped>
.pricing-section {
  position: relative;
  background: #fff;
  border-radius: 20px;
  padding: 40px 60px;
  margin-bottom: 60px;
  overflow: hidden;
}
.pricing-section::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding-top: 5px;
  background: linear-gradient(90deg, rgba(37,99,235,.9), rgba(37,99,235,.35));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: .92;
}

/* Category Toggle Styles */
.category-toggle-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  padding-top: 0;
}

.category-toggle {
  display: inline-flex;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 16px;
  padding: 6px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.08);
  border: 1px solid rgba(255,255,255,.8);
  gap: 6px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  outline: none;
}

.toggle-btn:hover {
  color: #374151;
  transform: translateY(-1px);
}

.toggle-btn.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  box-shadow: 0 8px 20px -8px rgba(37,99,235,.5), inset 0 1px 0 rgba(255,255,255,.2);
}

.toggle-btn:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* View Sections */
.view-section {
  animation: fadeInUp 0.5s ease;
}

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

.section-subtitle {
  text-align: center;
  font-size: 18px;
  color: #6b7280;
  margin-top: -12px;
  margin-bottom: 32px;
  font-weight: 500;
}
.section-title {
  text-align: center;
  font-weight: 900;
  margin-bottom: 24px;
  font-size: calc(1.2vw + 22px);
}
.tabs {
  justify-content: center;
}
.pill-tabs {
  gap: 8px;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 6px;
  width: fit-content;
  margin: 0 auto;
}
.pill-tab {
  border-radius: 999px;
  padding: 8px 20px;
  font-weight: 700;
}
.pill-tab.q-tab--active {
  background: #2563eb;
  color: #fff;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 28px;
  margin-top: 24px;
}
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
.price-card {
  border-radius: 18px;
  /* overflow: hidden; */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color .25s ease;
  display: flex;
  flex-direction: column;
  outline: none;
}
.price-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
}
.price-card:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.price-card .badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .02em;
  box-shadow: 0 8px 18px -10px rgba(37,99,235,.6);
}
.card-hero {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: rgba(255,255,255,.22);
  border: 2px solid rgba(255,255,255,.35);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 8px 20px rgba(0,0,0,.12);
  backdrop-filter: blur(2px);
}
.card-body {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.title-row .spacer {
  flex: 1;
}
.title {
  font-weight: 800;
  font-size: 22px;
}
.price {
  font-weight: 900;
  font-size: 22px;
}
@media (prefers-reduced-motion: reduce) {
  .price-card,
  .cta-btn,
  .form-card { transition: none !important; }
}
.meta {
  color: #4b5563;
  font-size: 15px;
  margin-top: 6px;
}
.meta.small.old-price {
  font-size: 14px;
  opacity: 0.7;
}
.features {
  margin: 14px 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}
.divider { height: 1px; background: #eef2f7; margin: 14px 0 6px; }
.features li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #374151;
}
.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}
.cta-btn {
  border-radius: 12px;
  font-weight: 800;
  padding: 8px 16px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  box-shadow: 0 10px 24px -12px rgba(37,99,235,.6);
  transition: transform .2s ease, box-shadow .2s ease;
}
.cta-btn:hover { transform: translateY(-1px); box-shadow: 0 16px 28px -12px rgba(37,99,235,.66); }
.cta-btn:active { transform: translateY(0); box-shadow: 0 8px 18px -12px rgba(37,99,235,.6); }
/* Color variants */
.variant-orange .card-hero {
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
}
.variant-blue .card-hero {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}
.variant-green .card-hero {
  background: linear-gradient(135deg, #059669, #34d399);
}
.variant-purple .card-hero {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
}
.is-selected {
  border: 2px solid #2563eb;
  box-shadow: 0 20px 40px -20px rgba(37,99,235,.45);
  transform: translateY(-4px);
}
.notes-box {
  margin-top: 40px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.notes-header h3 {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.notes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.notes-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
}
/* Selected border per variant */
.variant-orange.is-selected {
  border: 2px solid #f59e0b;
}
.variant-blue.is-selected {
  border: 2px solid #2563eb;
}
.variant-green.is-selected {
  border: 2px solid #059669;
}
.variant-purple.is-selected {
  border: 2px solid #7c3aed;
}


/* Responsive */


/* Exam Packages Styles */
.exam-packages-wrapper {
  margin-top: 24px;
}

.exam-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 32px;
}
@media (max-width: 1024px) {
  .exam-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .exam-cards-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
}

.exam-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color .25s ease;
  display: flex;
  flex-direction: column;
  outline: none;
  background: #fff;
  border: 2px solid transparent;
}

.exam-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
}

.exam-card:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

.exam-card.is-selected {
  border: 2px solid #2563eb;
  box-shadow: 0 20px 40px -20px rgba(37,99,235,.45);
  transform: translateY(-4px);
}

.exam-card.deluxe-card {
  position: relative;
}

.recommended-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .02em;
  box-shadow: 0 8px 18px -10px rgba(251, 191, 36, .6);
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
}

.badge-icon {
  font-size: 14px;
}

.exam-card-image {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  position: relative;
  overflow: hidden;
}

.exam-plan-image {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.exam-card:hover .exam-plan-image {
  transform: scale(1.05);
}

.exam-card-body {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.exam-plan-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.exam-title {
  font-weight: 800;
  font-size: 24px;
  color: #111827;
}

.exam-price {
  font-weight: 900;
  font-size: 32px;
  color: #2563eb;
}

.exam-meta {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.5;
}

/* Variant Colors for Exam Cards */
.exam-card.variant-lite .exam-card-image {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.exam-card.variant-deluxe .exam-card-image {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.exam-card.variant-premium .exam-card-image {
  background: linear-gradient(135deg, #e9d5ff, #d8b4fe);
}

.exam-card.variant-lite.is-selected {
  border-color: #3b82f6;
}

.exam-card.variant-deluxe.is-selected {
  border-color: #f59e0b;
}

.exam-card.variant-premium.is-selected {
  border-color: #a855f7;
}

/* Features Section */
.exam-features-section {
  margin-bottom: 32px;
}

.exam-features-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.exam-features-list {
  display: grid;
  gap: 14px;
}

.exam-feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #374151;
  font-weight: 500;
}

/* CTA Section */
.exam-cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.exam-cta-btn {
  border-radius: 12px;
  font-weight: 800;
  padding: 12px 32px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  box-shadow: 0 10px 24px -12px rgba(37,99,235,.6);
  transition: transform .2s ease, box-shadow .2s ease;
  font-size: 16px;
  min-width: 200px;
}

.exam-cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px -12px rgba(37,99,235,.66);
}

.exam-cta-btn:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px -12px rgba(37,99,235,.6);
}

.exam-selection-hint {
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
}

/* Responsive adjustments for toggle */
@media (max-width: 640px) {
  .category-toggle {
    width: 100%;
    max-width: 100%;
  }

  .toggle-btn {
    flex: 1;
    padding: 12px 16px;
    font-size: 14px;
    gap: 6px;
    justify-content: center;
  }

  .toggle-btn .q-icon {
    font-size: 20px;
  }

  .pricing-section {
    padding: 24px 16px;
  }

  .category-toggle-wrapper {
    margin-bottom: 28px;
  }
}
</style>
