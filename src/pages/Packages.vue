<template>
  <section class="pricing-section container-lg">
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
        <div class="cards-grid">
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
            :aria-label="`${p.name} €${p.pakketprijs}`"
            v-ripple
          >
            <div v-if="i === 1" class="badge">{{ t('packages.retake_note') }}</div>
         
            <div class="card-body">
              <div class="title-row">
                <q-radio v-model="selected" :val="`${tab}-${i}`" color="primary" size="md" />
                <div class="title">{{ p.name }}</div>
                <div class="spacer"></div>
                <div class="price">€{{ p.pakketprijs }}</div>
              </div>
              <div class="meta small old-price">
                {{ t('packages.normal_price') }}: <del>€{{ p.normaalprijs }}</del>
              </div>
              <div class="divider"></div>
              <ul class="features">
                <li v-for="(f, fi) in parseInhoud(p.inhoud)" :key="fi">
                  <q-icon name="check_circle" color="positive" size="18px" />
                  <span>{{ f }}</span>
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

  </section>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "RijlesPakketten",
  setup() {
    const { t } = useI18n();
    const activeTab = ref("hand");
    const selected = ref("hand-1");

    const pakketten = {
      hand: [
              { name: t('packages.start'), inhoud: "5 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 800, pakketprijs: 770 },
        { name: t('packages.basic'), inhoud: "10 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 1300, pakketprijs: 1250 },
        { name: t('packages.total'), inhoud: "15 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 1800, pakketprijs: 1730 },
        { name: t('packages.complete'), inhoud: "20 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 2300, pakketprijs: 2220 },
      ],
      auto: [
        { name: t('packages.start'), inhoud: "5 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 850, pakketprijs: 820 },
        { name: t('packages.basic'), inhoud: "10 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 1400, pakketprijs: 1350 },
        { name: t('packages.total'), inhoud: "15 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 1950, pakketprijs: 1870 },
        { name: t('packages.complete'), inhoud: "20 lessen (100 min.) + 1 praktijkexamen", normaalprijs: 2500, pakketprijs: 2400 },
      ],
      her: [
            { name: t('packages.retake'), inhoud: "5 lessen (100 min.) + GRATIS praktijkexamen", normaalprijs: 800, pakketprijs: 500 },
        { name: t('packages.retake'), inhoud: "7 lessen (100 min.) + GRATIS praktijkexamen", normaalprijs: 1000, pakketprijs: 700 },
      ],
    };

    const icons = { hand: "directions_car_filled", auto: "electric_car", her: "restart_alt" };

    function heroClass(i) {
      const variants = ["variant-blue", "variant-blue", "variant-blue", "variant-blue"];
      return variants[i % variants.length];
    }
    function iconFor(tab) {
      return icons[tab];
    }
    function parseInhoud(txt) {
      return txt.split("+").map(t => t.trim());
    }
    function selectCard(key, evt) {
      selected.value = key;
      const el = evt?.currentTarget;
      if (el && window.innerWidth < 768) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return { t, activeTab, selected, pakketten, heroClass, parseInhoud, selectCard, iconFor };
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
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-top: 24px;
}
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(1, 1fr) !important;
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
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
@media (max-width: 768px) {
  .pricing-section {
    padding: 20px 14px;
  }
  .cards-grid {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .price-card {
    min-width: 80%;
    scroll-snap-align: center;
  }
}
</style>
