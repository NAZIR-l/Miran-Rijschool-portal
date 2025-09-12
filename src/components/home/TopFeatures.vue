<template>
  <section class="top-features container-lg">
    <div class="grid">
      <div class="feature">
        <img class="feature-img" :src="icon1" alt="Theorie leren" />
        <h3 class="feature-title">Theorie leren</h3>
        <p class="feature-desc">
          De videocursus en de oefenexamens zijn examengericht. Bekijk onderdelen die je
          kunt verwachten tijdens het CBR examen.
        </p>
      </div>
      <div class="feature">
        <img class="feature-img" :src="icon2" alt="Geslaagden" />
        <h3 class="feature-title">400.000+ Geslaagden!</h3>
        <p class="feature-desc">
          Elke maand duizenden geslaagden. Ben jij de volgende?
        </p>
      </div>
      <div class="feature">
        <img class="feature-img" :src="icon3" alt="Tevreden" />
        <h3 class="feature-title">99% Tevreden</h3>
        <p class="feature-desc">
          Wij leven voor tevreden kandidaten. Je zult er geen spijt van krijgen!
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import icon1 from "src/assets/icon1.webp";
import icon2 from "src/assets/icon2.webp";
import icon3 from "src/assets/icon3.webp";

export default defineComponent({
  name: "TopFeatures",
  setup() {
    return { icon1, icon2, icon3 };
  }
});
</script>

<style scoped>
.top-features {
  padding: 100px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
  align-items: stretch; /* تغيير من start إلى stretch */
}

.feature {
  text-align: center;
  padding: 30px 20px; /* زيادة المساحة الداخلية */
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%; /* إضافة ارتفاع كامل */
}

.feature-img {
  width: 120px; /* تصغير حجم الصورة */
  height: 120px;
  object-fit: contain;
  display: block; /* تغيير من inline-block إلى block */
  margin: 0 auto 20px; /* إضافة هامش سفلي */
}

.feature-title {
  font-weight: 900;
  font-size: 26px; /* تصغير حجم الخط */
  color: #21172c;
  margin: 10px 0 15px; /* تعديل الهوامش */
  line-height: 1.2;
}

.feature-desc {
  color: #3c3545;
  font-weight: 500; /* تغيير سمك الخط */
  opacity: .95;
  max-width: 320px; /* تقليل العرض الأقصى */
  margin: 0 auto;
  line-height: 1.7;
  font-size: 16px;
  margin-top: auto; /* دفع النص إلى الأسفل لمحاذاة متساوية */
}

@media (max-width: 1024px) {
  .top-features {
    padding: 80px 40px; /* تعديل المساحة للشاشات المتوسطة */
  }

  .grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }

  .feature-img {
    width: 100px;
    height: 100px;
  }

  .feature-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .top-features {
    padding: 60px 20px; /* تعديل المساحة للشاشات الصغيرة */
  }

  .feature {
    padding: 25px 15px;
  }

  .feature-title {
    font-size: 22px;
  }

  .feature-desc {
    font-size: 15px;
  }
}
</style>