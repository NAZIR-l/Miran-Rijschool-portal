<template>
  <section class="pricing-section container-lg">
    <h1 class="section-title">Kies je pakket!</h1>

    <q-tabs v-model="activeTab" class="tabs pill-tabs" active-color="primary" indicator-color="transparent" dense no-caps>
      <q-tab name="auto" label="Auto" class="pill-tab" />
      <q-tab name="motor" label="Motor" class="pill-tab" />
      <q-tab name="bromfiets" label="Bromfiets" class="pill-tab" />
      <q-tab name="vaarbewijs" label="Vaarbewijs" class="pill-tab" />
    </q-tabs>

    <q-separator spaced color="transparent" class="tab-separator" />

    <q-tab-panels v-model="activeTab" animated transition-prev="jump-up" transition-next="jump-up">
      <q-tab-panel name="auto">
        <div class="cards-grid">
          <q-card flat bordered class="price-card">
            <div class="card-hero hero-lite"></div>
            <div class="card-body">
              <div class="title-row">
                <q-radio v-model="selected" val="lite" color="primary" size="md" />
                <div class="title">Auto Lite</div>
                <div class="spacer"></div>
                <div class="price">€19</div>
              </div>
              <div class="meta">15 dagen toegang<br>14 CBR examenmodules</div>
            </div>
          </q-card>

          <q-card flat bordered class="price-card recommended">
            <div class="badge">Aanbevolen</div>
            <div class="card-hero hero-deluxe"></div>
            <div class="card-body">
              <div class="title-row">
                <q-radio v-model="selected" val="deluxe" color="primary" size="md" />
                <div class="title">Auto Deluxe</div>
                <div class="spacer"></div>
                <div class="price">€35</div>
              </div>
              <div class="meta">31 dagen toegang<br>14 CBR examenmodules</div>
            </div>
          </q-card>

          <q-card flat bordered class="price-card">
            <div class="card-hero hero-premium"></div>
            <div class="card-body">
              <div class="title-row">
                <q-radio v-model="selected" val="premium" color="primary" size="md" />
                <div class="title">Auto Premium</div>
                <div class="spacer"></div>
                <div class="price">€49</div>
              </div>
              <div class="meta">90 dagen toegang<br>14 CBR examenmodules</div>
            </div>
          </q-card>
        </div>

        <div class="bullets">
          <div class="bullet"><q-icon name="check_circle" color="positive" /> Verkeersborden</div>
          <div class="bullet"><q-icon name="check_circle" color="positive" /> Engelse ondertiteling</div>
          <div class="bullet"><q-icon name="check_circle" color="positive" /> Geweldige klantenservice</div>
        </div>

        <div class="cta">
          <q-btn no-caps unelevated color="primary" class="cta-btn" label="Direct starten" />
        </div>
      </q-tab-panel>


      <q-tab-panel name="motor"><div class="placeholder">Motor pakketten komen hier.</div></q-tab-panel>
      <q-tab-panel name="bromfiets"><div class="placeholder">Bromfiets pakketten komen hier.</div></q-tab-panel>
      <q-tab-panel name="vaarbewijs"><div class="placeholder">Vaarbewijs pakketten komen hier.</div></q-tab-panel>
    </q-tab-panels>
  </section>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "PricingSection",
  setup() {
    const activeTab = ref("auto");
    const selected = ref("deluxe");
    return { activeTab, selected };
  }
});
</script>

<style scoped>
.pricing-section { background: #ffffff; border-radius: 14px; padding: 32px 16px; }
.section-title { text-align: center; font-weight: 800; margin: 8px 0 12px; font-size: calc(1.31vw + 21.07px); }
.tabs { justify-content: center; }
.pill-tabs { gap: 10px; background: #f4f5f7; border-radius: 999px; padding: 6px; width: fit-content; margin: 0 auto; }
.pill-tab { background: transparent; border-radius: 999px; padding: 8px 18px; color: #2a2530; font-weight: 800; }
.pill-tab.q-tab--active { background: #fff; box-shadow: 0 6px 14px -8px rgba(16,24,40,.25); }
.tab-separator { max-width: 240px; margin: 0 auto; }
.cards-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 20px; }
.price-card { background: linear-gradient(180deg, #eef5ff 0%, #f6f8ff 100%); border-radius: 16px; overflow: hidden; position: relative; border: 2px solid #dbe6ff; }
.price-card.recommended { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6 inset; }
.price-card .badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: #fff; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; letter-spacing: .2px; }
.card-hero { height: 260px; background: radial-gradient(120% 80% at 20% 20%, rgba(59,130,246,.18) 0%, rgba(59,130,246,0) 60%), #eef5ff; display: flex; align-items: center; justify-content: center; }
.hero-deluxe { background: radial-gradient(120% 80% at 20% 20%, rgba(59,130,246,.25) 0%, rgba(59,130,246,0) 60%), #eef5ff; }
.hero-lite { background: radial-gradient(120% 80% at 20% 20%, rgba(245,158,11,.22) 0%, rgba(245,158,11,0) 60%), #fff8ec; }
.hero-premium { background: radial-gradient(120% 80% at 20% 20%, rgba(16,185,129,.22) 0%, rgba(16,185,129,0) 60%), #effcf7; }
.card-body { padding: 24px; }
.title-row { display: flex; align-items: center; gap: 12px; }
.title-row .spacer { flex: 1; }
.title { font-weight: 900; font-size: 26px; color: #0f0b18; }
.price { font-weight: 900; font-size: 26px; color: #0f0b18; }
.meta { color: #2d2a34; opacity: .75; font-size: 16px; margin-top: 8px; font-weight: 600; }
.bullets { display: flex; gap: 28px; justify-content: center; margin: 24px 0; flex-wrap: wrap; }
.bullet { display: flex; align-items: center; gap: 8px; color: #2a2530; }
.cta { display: flex; justify-content: center; }
.cta-btn { padding: 10px 22px; border-radius: 12px; background: linear-gradient(90deg, #2261ff 0%, #2e7bff 100%); }
@media (max-width: 1024px) { .cards-grid { grid-template-columns: 1fr; } }
</style>


