<template>
  <section class="three-cards container-lg">
    <div class="grid">
      <div class="card border-amber">
        <h3 class="title">Spoed pakket</h3>

        <div class="icon"><q-icon name="schedule" color="amber-7" size="64px" /></div>
        <p class="desc">
          <strong>Last minute toch slagen?</strong> Neem het Spoed pakket! 24 uur onbeperkt
          leren vanaf €29,99.
        </p>
        <q-btn flat no-caps color="primary" class="link-btn" label="Bestel direct" />
      </div>

      <div class="card border-blue">
        <h3 class="title">Theorie cursus cadeau?</h3>

        <div class="icon"><q-icon name="card_giftcard" color="primary" size="64px" /></div>
        <p class="desc">
          Het leukste cadeau voor iedereen die wilt slagen voor het theorie examen!
        </p>
        <q-btn flat no-caps color="primary" class="link-btn" label="Het leukste cadeau om te geven" />
      </div>

      <div class="card border-red">
                <h3 class="title">Contact</h3>

        <div class="icon"><q-icon name="chat_bubble_outline" color="deep-orange-5" size="64px" /></div>
        <p class="desc">
          Heb je een vraag? Wij staan voor je klaar. Bel ons of stuur een berichtje.
        </p>
        <q-btn flat no-caps color="primary" class="link-btn" label="Contact" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({ name: "ThreeCards" });
</script>

<style scoped>
.three-cards { background: #ffffff; border-radius: 20px; padding: 20px 100px 20px 100px; margin-bottom: 48px; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
.card {  background: #f1f0ee; border-radius: 16px; padding: 100px 40px 100px 40px; border: 2px solid #e8e7ef; box-shadow: 0 8px 22px -12px rgba(16,24,40,.12); }
.border-amber { border-color: #f59e0b; }
.border-blue { border-color: #2563eb; }
.border-red { border-color: #ef4444; }
.icon { display: flex; align-items: center; justify-content: center; height: 120px; }
.title { text-align: left; font-weight: 900; font-size: 28px; color: #261a34; margin: 8px 0 6px; }
.desc { color: #41374a; font-weight: 600; line-height: 1.8; }
.link-btn { margin-top: 10px; font-weight: 800; }
@media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } .icon{ height: 80px; } }
</style>


