<template>
  <section class="main-banner">
    <!-- الصورة الخلفية -->
    <div class="banner-background">
      <img :src="mainBg" alt="Main banner" />
      <div class="banner-overlay"></div>
    </div>

    <!-- المحتوى النصي -->
    <div class="banner-content">
      <div class="text-card">
        <h1 class="banner-title">Snel en gemakkelijk slagen voor je theorie-examen!</h1>
        <p class="banner-subtitle">Met onze slimme leermethoden en oefenexamens haal je in no-time je theoriecertificaat.</p>
        <q-btn no-caps unelevated class="cta-button" label="Bestel direct!" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import mainBg from "src/assets/main.webp";

export default defineComponent({
  name: "MainBanner",
  setup() {
    return { mainBg };
  }
});
</script>

<style scoped>
/* ====================== STRUCTURE ====================== */
.main-banner {
  position: relative;
  width: 100%;
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.banner-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-background img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Fill area elegantly */
  object-position: center;
  display: block;
  filter: saturate(1.05) contrast(1.03);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.25));
  z-index: 1;
}

/* ====================== CONTENT ====================== */
.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
}

.text-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: fadeInUp 0.8s ease-out forwards;
}

.banner-title {
  font-family: "Montserrat", sans-serif;
  font-size: 56px;
  font-weight: 900;
  line-height: 1.1;
  color: #111;
  margin-bottom: 20px;
}

.banner-subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
  line-height: 1.5;
}

/* ====================== CTA BUTTON ====================== */
.cta-button {
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(90deg,#2261ff 0%,#2e7bff 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(34,97,255,0.35);
  transition: all 0.3s ease-in-out;
}

.cta-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 14px 28px rgba(34,97,255,0.45);
  filter: brightness(1.1);
}

/* ====================== ANIMATION ====================== */
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ====================== RESPONSIVE ====================== */
@media (max-width: 1024px) {
  .banner-title { font-size: 48px; }
  .banner-subtitle { font-size: 18px; }
  .text-card { padding: 32px 24px; }
}

@media (max-width: 768px) {
  .banner-title { font-size: 36px; }
  .banner-subtitle { font-size: 16px; }
  .text-card { padding: 28px 20px; }
  .cta-button { padding: 14px 32px; font-size: 16px; }
}

@media (max-width: 480px) {
  .banner-title { font-size: 28px; }
  .banner-subtitle { font-size: 14px; }
  .text-card { padding: 20px 16px; }
  .cta-button { padding: 12px 28px; font-size: 15px; }
}
</style>
