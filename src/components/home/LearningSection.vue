<template>
  <section class="learn-section container-lg">
    <div class="media">
      <img class="illustration" :src="heroImage" alt="Online leren en oefenen" />
    </div>
    <div class="content">
      <h2 class="title">Online leren en oefenen voor het theorie examen</h2>
      <p class="desc">
        Theorie leren, maar geen zin om uren uit boeken te leren? Dan is onze
        online videocursus perfect voor jou! Oefenexamens maak je online via je
        computer, laptop, tablet of smartphone.
      </p>
      <p class="desc small">
        Bij ons kun je terecht voor het <a href="#" class="link">auto theorie</a>,
        <a href="#" class="link"> bromfiets theorie</a>, en
        <a href="#" class="link"> vaarbewijs theorie</a>. Onze cursus bevat alle CBR
        onderdelen met de vragen én antwoorden die je nodig hebt om in 1 keer te
        slagen.
      </p>
      <div class="actions">
        <q-btn no-caps unelevated color="primary" class="cta" label="Bekijk de pakketten" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import heroImage from "src/assets/1757425365-2-1.webp";
export default defineComponent({
  name: "LearningSection",
  setup() {
    return { heroImage };
  }
});
</script>

<style scoped>
.learn-section { display: grid; grid-template-columns: 1.05fr .95fr; gap: 40px; align-items: center; padding: 80px 80px; background: var(--page-bg); border-radius: 20px; }
.media { display: flex; justify-content: center;  }
.illustration { width: 100%; max-width: 780px; border-radius: 16px;  padding: 20px 20px; }
.content { max-width: 600px; padding: 60px 60px; }
.title { font-weight: 900; font-size: 48px; line-height: 1.15; color: #1f1530; letter-spacing: -0.02em; }
.desc { color: #2a2530; font-size: 16px; line-height: 1.9; font-weight: 500; opacity: .95;     display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    unicode-bidi: isolate;; }
.desc.small { opacity: .95; }
.link { color: #1e40af; font-weight: 800; text-decoration: underline; text-underline-offset: 3px; }
.actions { margin-top: 22px; }
.cta { padding: 12px 22px; border-radius: 12px; background: linear-gradient(90deg, #2261ff 0%, #2e7bff 100%); }
@media (max-width: 1024px) { .learn-section { grid-template-columns: 1fr; text-align: center; gap: 22px; } .media{ order: -1; } .title{ font-size: 36px; } }
</style>


