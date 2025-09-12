<template>
  <section class="info-section container-lg">
    <div class="grid">
      <div class="col">
        <h2 class="title">Voorbereiden op het theorie-examen?</h2>
        <p class="para">
          Om er zeker van te zijn dat je klaar bent voor alle vragen die tijdens je
          theorie examen gesteld kunnen worden, moet je je ruim van tevoren
          voorbereiden. Het is belangrijk goed je
          <a href="#" class="link">theorie examen te oefenen</a>
          voor het examen. Veel personen onderschatten vaak het theorie-examen, waardoor
          veel mensen zakken. Wil je <strong>online theorie oefenen</strong> voor je theorie-examen
          maar weet je niet goed waar je moet beginnen? Zo ja, dan ben je bij Theorie
          Toppers aan het juiste adres! Wij bieden je de kans om een
          <strong> theorie cursus</strong> te volgen zodat jij meer kans hebt om te slagen.
        </p>
      </div>
      <div class="col">
        <h2 class="title">Tijdens de theoriecursus van Theorie Toppers leer je... alles!</h2>
        <p class="para">
          Je kennis van rijvaardigheid wordt op de ultieme proef gesteld tijdens het
          CBR examen. Deze vragen zullen verschillende thema's bevatten. Van
          veiligheid en gezondheid tot verschillende wegen en verkeersborden. De
          theoriecursus bestaat, net als het theorie-examen, uit verschillende
          onderdelen en CBR oefenvragen. Het is belangrijk om eerst de theorie onder
          de knie te krijgen voordat je klaar bent voor het examen. Theorie Toppers
          stoomt je klaar voor het theorie examen! Meer weten? Hier lees je
          <a href="#" class="link">hoe het werkt</a>.
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


