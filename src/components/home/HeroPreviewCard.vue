<template>
  <div class="hero-card-wrap">
    <q-btn round unelevated class="nav-btn left" icon="chevron_left" @click="prev" />

    <div class="card-stage">
      <transition :name="transitionName" mode="out-in">
        <q-card
          :key="current.key"
          flat
          bordered
          class="hero-card"
          :class="{
            recommended: current.recommended,
            selected: selected === current.key
          }"
        >
          <div v-if="current.recommended" class="badge">Aanbevolen</div>
          <div class="card-hero" :class="current.heroClass"></div>
          <div class="card-body">
            <div class="title-row">
              <q-radio v-model="selected" :val="current.key" color="primary" size="md" />
              <div class="title">{{ current.title }}</div>
              <div class="spacer"></div>
              <div class="price">{{ current.price }}</div>
            </div>
            <div class="meta">{{ current.days }} dagen toegang<br>{{ current.modules }} CBR examenmodules</div>

            <div class="benefits">
              <div v-for="(b, bi) in current.benefits" :key="bi" class="benefit">
                <q-icon name="check_circle" color="positive" /> {{ b }}
              </div>
            </div>
          </div>
        </q-card>
      </transition>
    </div>

    <q-btn round unelevated class="nav-btn right" icon="chevron_right" @click="next" />

    <div class="dots">
      <span
        v-for="(p, i) in packages"
        :key="p.key"
        class="dot"
        :class="{
          active: i === index,
          selected: selected === p.key
        }"
        @click="go(i)"
      ></span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
export default defineComponent({
  name: "HeroPreviewCard",
  setup() {
    const packages = ref([
      {
        key: "lite",
        title: "Auto Lite",
        price: "€49,99",
        days: 7,
        modules: 3,
        heroClass: "hero-lite",
        recommended: false,
        benefits: ["Verkeersborden", "Verkeersbegrippen", "Engelse ondertiteling", "Geweldige klantenservice"],
      },
      {
        key: "deluxe",
        title: "Auto Deluxe",
        price: "€69,99",
        days: 31,
        modules: 7,
        heroClass: "hero-deluxe",
        recommended: true,
        benefits: ["Verkeersborden", "Verkeersbegrippen", "Engelse ondertiteling", "Geweldige klantenservice"],
      },
      {
        key: "premium",
        title: "Auto Premium",
        price: "€59,99",
        days: 21,
        modules: 5,
        heroClass: "hero-premium",
        recommended: false,
        benefits: ["Verkeersborden", "Verkeersbegrippen", "Engelse ondertiteling", "Geweldige klantenservice"],
      },
    ]);

    const index = ref(1); // default to Deluxe
    const selected = ref(packages.value[index.value].key);
    const current = computed(() => packages.value[index.value]);
    const transitionName = ref("slide-left");

    function go(i) {
      const newIndex = (i + packages.value.length) % packages.value.length;
      transitionName.value = newIndex > index.value ? "slide-left" : "slide-right";
      index.value = newIndex;
      selected.value = packages.value[index.value].key;
    }
    function prev() { transitionName.value = "slide-right"; go(index.value - 1); }
    function next() { transitionName.value = "slide-left"; go(index.value + 1); }

    // تحديث المؤشر عند تغيير الاختيار
    watch(selected, (newVal) => {
      const newIndex = packages.value.findIndex(p => p.key === newVal);
      if (newIndex !== -1 && newIndex !== index.value) {
        transitionName.value = newIndex > index.value ? "slide-left" : "slide-right";
        index.value = newIndex;
      }
    });

    return { packages, index, current, selected, go, prev, next, transitionName };
  }
});
</script>

<style scoped>
.hero-card-wrap {
  position: relative;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.hero-card {
  background: linear-gradient(180deg, #eef5ff 0%, #f6f8ff 100%);
  border-radius: 16px;
  border: 2px solid #dbe6ff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.hero-card.recommended {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.hero-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25), 0 0 0 2px #3b82f6 inset;
  transform: translateY(-5px);
}

.badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #3b82f6;
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .2px;
  z-index: 10;
}

.card-stage {
  position: relative;
  min-height: 420px;
}

.card-hero {
  height: 220px;
}

.hero-deluxe {
  background: radial-gradient(120% 80% at 20% 20%, rgba(59,130,246,.25) 0%, rgba(59,130,246,0) 60%), #eef5ff;
}

.hero-lite {
  background: radial-gradient(120% 80% at 20% 20%, rgba(245,158,11,.22) 0%, rgba(245,158,11,0) 60%), #fff8ec;
}

.hero-premium {
  background: radial-gradient(120% 80% at 20% 20%, rgba(16,185,129,.22) 0%, rgba(16,185,129,0) 60%), #effcf7;
}

.card-body {
  padding: 20px 22px 16px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-row .spacer {
  flex: 1;
}

.title {
  font-weight: 900;
  font-size: 22px;
  color: #0f0b18;
}

.price {
  font-weight: 900;
  font-size: 20px;
  color: #0f0b18;
}

.meta {
  color: #2d2a34;
  opacity: .75;
  font-size: 14px;
  margin: 6px 0 10px;
  font-weight: 600;
}

.benefits {
  display: grid;
  gap: 8px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2a2530;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #2a2530;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  z-index: 10;
}

.nav-btn.left {
  left: -36px;
}

.nav-btn.right {
  right: -36px;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cfd6ea;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #3b82f6;
  width: 18px;
  border-radius: 6px;
}

.dot.selected {
  background: #3b82f6;
  transform: scale(1.2);
}

/* slide animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform .35s ease, opacity .35s ease;
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-40px);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(40px);
  opacity: 0;
}

@media (max-width: 1024px) {
  .nav-btn.left {
    left: -8px;
  }

  .nav-btn.right {
    right: -8px;
  }
}
</style>