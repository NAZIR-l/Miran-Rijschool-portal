<template>
  <section class="testimonials container-lg" @mouseenter="isPaused = true" @mouseleave="isPaused = false">
    <q-tabs
      v-model="activeReviewIdx"
      class="review-tabs"
      dense
      no-caps
      outside-arrows
      mobile-arrows
      shrink
    >
      <q-tab v-for="(r, i) in reviews" :key="r.id" :name="i" :label="r.user" class="review-tab" />
    </q-tabs>
    <div class="section-head">
      <h2 class="title">Wat onze studenten zeggen</h2>
      <p class="sub">Echte ervaringen van kandidaten die met onze cursus zijn geslaagd</p>
    </div>
    <q-carousel
      v-model="slide"
      animated
      swipeable
      infinite
      arrows
      navigation
      control-color="primary"
      class="t-carousel"
    >
      <q-carousel-slide v-for="(pair, idx) in slides" :key="idx" :name="idx">
        <div class="cards">
          <q-card flat bordered class="tcard" v-for="review in pair" :key="review.id">
            <div class="t-title">{{ review.title }}</div>
            <div class="t-user">
              <q-avatar size="28px" color="grey-4" text-color="white">{{ review.user[0] }}</q-avatar>
              <span class="t-name">{{ review.user }}</span>
            </div>
            <div class="t-text">{{ review.text }}</div>
          </q-card>
        </div>
      </q-carousel-slide>
    </q-carousel>

    <div class="cta-wrap">
      <q-btn no-caps unelevated color="primary" class="cta" label="Maak een account" />
      <div class="rating">
        4.9
        <q-icon name="star" color="warning" size="16px" />
        <q-icon name="star" color="warning" size="16px" />
        <q-icon name="star" color="warning" size="16px" />
        <q-icon name="star" color="warning" size="16px" />
        <q-icon name="star" color="warning" size="16px" />
        <span class="sub">7.120 recensies Google</span>
      </div>
    </div>
  </section>

</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

export default defineComponent({
  name: 'TestimonialsSection',
  setup() {
    const reviews = ref([
      { id: 1, title: 'Echt aanrader!', user: 'Jannell', text: 'Meteen de eerste keer geslaagd na het bestuderen van de cursus. Leuke en duidelijke manier van uitleg. Maak goede aantekeningen en je haalt het!' },
      { id: 2, title: 'Echt top!!!', user: 'Senna', text: '3 weken pakket gekocht en in 1 x geslaagd. super fijn. Alles word je uitgelegd. Nu beginnen aan praktijk 🙂' },
      { id: 3, title: 'Super duidelijk', user: 'Rayan', text: 'Fijne uitleg en veel oefenexamens. Dit heeft mij echt geholpen!' },
      { id: 4, title: 'Aanrader', user: 'Lotte', text: 'Overzichtelijk en prettig tempo. Thanks!' }
    ]);

    const slide = ref(0);
    const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);
    function onResize(){ width.value = window.innerWidth; }
    onMounted(() => { window.addEventListener('resize', onResize); });
    onBeforeUnmount(() => { window.removeEventListener('resize', onResize); });
    const chunkSize = computed(() => width.value >= 1024 ? 2 : 1);
    const slides = computed(() => {
      const chunked = [];
      for (let i = 0; i < reviews.value.length; i += chunkSize.value) {
        chunked.push(reviews.value.slice(i, i + chunkSize.value));
      }
      return chunked;
    });

    const isPaused = ref(false);
    let timer;
    onMounted(() => {
      timer = setInterval(() => {
        if (!isPaused.value && slides.value.length > 0) {
          slide.value = (slide.value + 1) % slides.value.length;
        }
      }, 5000);
    });
    onBeforeUnmount(() => { if (timer) clearInterval(timer); });

    // Tabs syncing
    const activeReviewIdx = ref(0);
    watch(activeReviewIdx, (idx) => {
      const target = Math.floor(idx / chunkSize.value);
      if (target !== slide.value) slide.value = target;
    });
    watch([slide, chunkSize], () => {
      const base = slide.value * chunkSize.value;
      if (activeReviewIdx.value < base || activeReviewIdx.value >= base + chunkSize.value) {
        activeReviewIdx.value = base;
      }
    }, { immediate: true });

    return { slide, slides, isPaused, activeReviewIdx, reviews };
  }
});
</script>

<style scoped>
.testimonials { padding: 36px 12px 28px; }
.review-tabs { max-width: 100%; margin: 0 auto 6px; background: #f4f5f7; border-radius: 999px; padding: 4px; }
.review-tab { min-width: 120px; padding: 6px 12px; border-radius: 999px; font-weight: 700; color: #2b2332; }
.review-tab.q-tab--active { background: #ffffff; box-shadow: 0 6px 14px -8px rgba(16,24,40,.22); }
.section-head { text-align:center; margin-bottom: 6px; }
.section-head .title { font-size: 34px; font-weight: 900; color: #221a2d; margin: 0; }
.section-head .sub { color: #615a6a; font-weight: 600; margin: 6px 0 0; }
.t-carousel { background: transparent; }
.t-carousel :deep(.q-carousel__slides) { height: auto; }
.t-carousel :deep(.q-carousel__slide){ display: block; }
.cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; padding: 20px 6px 36px; }
.tcard { background: #ffffff; border-radius: 14px; padding: 28px; box-shadow: 0 10px 24px -16px rgba(16,24,40,.18); }
.t-title { font-weight: 900; color: #241b2d; font-size: 22px; margin-bottom: 8px; }
.t-user { display: flex; align-items: center; gap: 8px; color: #6b6474; font-weight: 700; margin-bottom: 10px; }
.t-text { color: #332a3a; font-weight: 600; line-height: 1.7; }
.cta-wrap { display: grid; justify-items: center; gap: 8px; }
.cta {  padding: 10px 22px; border-radius: 12px; background: linear-gradient(90deg, #2261ff 0%, #2e7bff 100%); }
.rating { color: #342b42; font-weight: 700; display: flex; align-items: center; gap: 4px; }
.rating .sub { opacity: .8; margin-left: 6px; }
@media (max-width: 1024px) {
  .cards { grid-template-columns: 1fr; }
  .review-tab { min-width: 100px; }
}
</style>


