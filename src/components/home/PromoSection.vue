<template>
  <section class="promo-section container-lg">
    <div class="content">
      <h2 class="title"><b>De grootste Winactie van het jaar is terug!</b></h2>
      <p class="lead">Je Ordernummer is je Lotnummer!</p>
      <p class="desc">
        We geven een spliksplinternieuwe Volkswagen Polo weg! Exact hetzelfde model en (grijze) kleur als op de afbeelding.
      </p>
      <p class="desc">
        <b>Elke bestelling in de maand September doet automatisch mee!</b> Het maakt niet uit of je een auto, bromfiets, motor, of vaarbewijs pakket bestelt.
      </p>
      <p class="desc">Iedereen maakt kans!</p>
      <div class="actions">
        <q-btn no-caps unelevated color="primary" class="cta" label="OMG! Direct bestellen" />
      </div>
    </div>
    <div class="media">
      <img class="illustration" :src="rightImage" alt="Winactie element" />
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import rightImage from "src/assets/1756905039-element.webp";
export default defineComponent({
  name: "PromoSection",
  setup() {
    return { rightImage };
  }
});
</script>

<style scoped>
.promo-section { display: grid; grid-template-columns: 1.05fr .95fr; gap: 40px; align-items: center; padding: 100px 100px 100px 100px }
.content { max-width: 820px; }
.title { font-weight: 900; font-size: 48px; line-height: 1.15; color: #261a34; letter-spacing: -0.02em; }
.lead { margin-top: 10px; color: #3a2f43; font-weight: 900; }
.desc { margin-top: 12px; color: #3a2f43; font-size: 18px; line-height: 1.9; font-weight: 600; }
.actions { margin-top: 22px; }
.cta { padding: 12px 22px; border-radius: 12px; background: linear-gradient(90deg, #2261ff 0%, #2e7bff 100%); }
.media { display: flex; justify-content: center; }
.illustration { width: 100%; max-width: 820px; border-radius: 16px;  }
@media (max-width: 1024px) { .promo-section { grid-template-columns: 1fr; text-align: left; gap: 22px; } .media{ order: -1; } .title{ font-size: 36px; } }
</style>


