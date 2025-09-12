<template>
  <section class="info-section container-lg">
    <div class="grid">
      <div class="col">
        <h2 class="title">Met Theorie Toppers online theorie oefenen</h2>
        <p class="para">
          Er zijn veel verschillende aspecten die tijdens het examen aan bod komen,
          en slagen vereist nu eenmaal veel studeren. Probeer dus niet de informatie in één dag in
           je hoofd te proppen met een normale manier van leren. Gun jezelf in plaats daarvan ruim de tijd
            om het te verwerken. Theorie Toppers raad je aan een maand voor je theorie-examen te beginnen met oefenen.
        </p>
      </div>
      <div class="col">
        <p class="para">
          De modules die we aanbieden zijn voorzien van een grondige foutenanalyse om te laten zien op welke
           punten je goed zit en op welke punten je meer moet oefenen, ook bevatten ze vragen die hetzelfde zijn
            als die op het CBR theorie-examen. Je bent je dus volledig bewust van de onderwerpen die je
            verder moet bestuderen.
          Wil je jouw theorie snel halen? Neem dan snel contact met ons op!
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "InfoSection"
});
</script>

<style scoped>
.info-section { background: #ffffff; border-radius: 28px; padding: 120px 120px 120px 120px; border: 1px solid #ecebf3; box-shadow: 0 10px 30px -12px rgba(16, 24, 40, .12); font-family: 'Poppins', 'Montserrat', sans-serif;  }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 64px; align-items: start; }
.col { max-width: 900px; }
.title { font-weight: 900; font-size: 36px; line-height: 1.2; letter-spacing: -0.02em; color: #1f1530; margin: 6px 0 14px; }
.para { color: #2a2530; font-size: 14px; line-height: 1.9; font-weight: 500; opacity: .95;     display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    unicode-bidi: isolate;
 }
.link { color: #1e40af; text-decoration: underline; text-underline-offset: 3px; font-weight: 800; }
@media (max-width: 1200px) { .title { font-size: 40px; } }
@media (max-width: 1024px) { .info-section{ padding: 32px 18px; } .grid { grid-template-columns: 1fr; gap: 24px; } .title { font-size: 32px; } .para{ font-size: 16.5px; line-height: 1.85; } }
</style>


