<template>
  <section class="hero container-lg">
    <div class="hero-content">
      <h2 class="hero-title">Slagen voor je theorie?</h2>
      <p class="hero-sub">Waar wacht je nog op? Maak een account aan en let's go!</p>
      <q-btn no-caps unelevated color="primary" class="hero-cta" label="Start met het Deluxe Pakket" />
    </div>
    <div class="hero-art">
      <HeroPreviewCard />
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import HeroPreviewCard from "./HeroPreviewCard.vue";
export default defineComponent({ name: "HeroSection", components: { HeroPreviewCard } });
</script>

<style scoped>
.hero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 24px; align-items: center; padding: 100px 100px 100px 100px }
.hero-title { font-weight: 900; font-size: 44px; color: #281c33; ; }
.hero-sub { margin-top: 8px; color: #433a4b; }
.hero-cta { margin-top: 18px; padding: 10px 22px; border-radius: 12px; background: linear-gradient(90deg, #2261ff 0%, #2e7bff 100%); }
.hero-art { display: flex; justify-content: center; }
@media (max-width: 1024px) { .hero { grid-template-columns: 1fr; text-align: center; } .hero-art { order: -1; } }
</style>


