<template>
  <q-page class="home-bg">
    <div class="programs">


      <div class="section-header">
        <h2>{{ $t('index.title') }}</h2>
        <p class="section-subtitle">{{ $t('index.subtitle') }}</p>
      </div>

      <div class="category-menu" :class="selectedCategory">
        <div
          v-for="item in categoryMenu"
          :key="item.id"
          :class="['menu-item', { active: selectedCategory === item.id }]"
          @click="selectedCategory = item.id"
        >
          <q-icon :name="item.icon" size="20px" />
          <span class="label">{{ item.label }}</span>
        </div>
        <div class="active-bar" :style="activeBarStyle"></div>
      </div>

      <transition name="fade-slide" mode="out-in">
        <div
          v-if="currentCategory"
          :key="currentCategory.id"
          class="program-category"
          :class="currentCategory.id"
        >
        <div class="category-note-container " style="    direction: rtl;">
        <span v-if="currentCategory.note" class="category-note">{{ currentCategory.note }}</span>
        </div>
          <div class="category-header">
            
            <div class="category-heading">
              <q-icon :name="menuItemFor(currentCategory.id)?.icon" size="22px" />
              <h3 class="category-title">{{ currentCategory.title }}</h3>
            </div>
            <img class="category-image" src="../assets/logo.svg" alt="category" />
          </div>

          <div class="category-grid">
            <div
              v-for="pkg in currentCategory.packages"
              :key="pkg.code"
              :class="['package-card', { recommended: isRecommended(currentCategory.id, pkg.code) }]"
            >
              <div class="card-accent" aria-hidden="true"></div>
              <div class="card-body">
                <div class="card-top">
                  <div class="pkg-label">{{ pkg.name }}</div>
                  <span v-if="isRecommended(currentCategory.id, pkg.code)" class="pkg-badge">{{ $t('index.most_chosen') }}</span>
                </div>
                <div class="pkg-desc">{{ pkg.description }}</div>
                <div class="price-row">
                  <span class="price-old">{{ pkg.normalPrice }}</span>
                  <span class="price-new">{{ pkg.packagePrice }}</span>
                </div>
                <div class="cta-row">
                  <q-btn class="cta-card" color="primary" unelevated :label="$t('cta.sign_up')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <ul class="notes">
        <li>{{ $t('index.note_all_lessons') }}</li>
        <li>{{ $t('index.note_inclusive') }}</li>
        <li>{{ $t('index.note_retake_only') }}</li>
      </ul>
    </div>
  </q-page>

</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: "IndexPage",
  setup() {
    const { t: $t } = useI18n({ useScope: 'global' })
    const selectedCategory = ref('automatic')
    const categoryMenu = computed(() => ([
      { id: 'manual', label: $t('index.manual_desc'), icon: 'directions_car' },
      { id: 'automatic', label: $t('index.automatic_desc'), icon: 'bolt' },
      { id: 'retake', label: $t('index.retake_desc'), icon: 'autorenew' },
    ]))
    // Build all labels dynamically from i18n so switching languages updates immediately
    const categories = computed(() => [
      {
        id: "manual",
        title: $t('index.manual'),
        packages: [
          {
            code: 'start',
            name: $t('index.start'),
            description: $t('index.lesson_desc', { count: 5 }),
            normalPrice: "€800",
            packagePrice: "€770",
          },
          {
            code: 'basic',
            name: $t('index.basic'),
            description: $t('index.lesson_desc', { count: 10 }),
            normalPrice: "€1.300",
            packagePrice: "€1.250",
          },
          {
            code: 'total',
            name: $t('index.total'),
            description: $t('index.lesson_desc', { count: 15 }),
            normalPrice: "€1.800",
            packagePrice: "€1.730",
          },
          {
            code: 'complete',
            name: $t('index.complete'),
            description: $t('index.lesson_desc', { count: 20 }),
            normalPrice: "€2.300",
            packagePrice: "€2.220",
          },
        ],
      },
      {
        id: "automatic",
        title: $t('index.automatic'),
        packages: [
          {
            code: 'start',
            name: $t('index.start'),
            description: $t('index.lesson_desc', { count: 5 }),
            normalPrice: "€850",
            packagePrice: "€820",
          },
          {
            code: 'basic',
            name: $t('index.basic'),
            description: $t('index.lesson_desc', { count: 10 }),
            normalPrice: "€1.400",
            packagePrice: "€1.350",
          },
          {
            code: 'total',
            name: $t('index.total'),
            description: $t('index.lesson_desc', { count: 15 }),
            normalPrice: "€1.950",
            packagePrice: "€1.870",
          },
          {
            code: 'complete',
            name: $t('index.complete'),
            description: $t('index.lesson_desc', { count: 20 }),
            normalPrice: "€2.500",
            packagePrice: "€2.400",
          },
        ],
      },
      {
        id: "retake",
        title: $t('index.retake'),
        note: $t('index.retake_note'),
        packages: [
          {
            code: 'basic_retake',
            name: $t('index.basic'),
            description: $t('index.lesson_desc_free', { count: 5 }),
            normalPrice: "€800",
            packagePrice: "€500",
          },
          {
            code: 'plus_retake',
            name: $t('index.total'),
            description: $t('index.lesson_desc_free', { count: 7 }),
            normalPrice: "€1.000",
            packagePrice: "€700",
          },
        ],
      },
    ])
    function isRecommended(categoryId, packageCode) {
      if (categoryId === "manual") return packageCode === "basic";
      if (categoryId === "automatic") return packageCode === "total";
      if (categoryId === "retake") return packageCode === "plus_retake";
      return false;
    }
    const currentCategory = computed(() => categories.value.find(c => c.id === selectedCategory.value))
    function menuItemFor(id){ return categoryMenu.value.find(m => m.id === id) }
    const activeBarStyle = computed(() => {
      const idx = categoryMenu.value.findIndex(m => m.id === selectedCategory.value)
      const width = 100 / categoryMenu.value.length
      return { width: width + '%', transform: `translateX(${idx * 100}%)` }
    })
    return { categories, isRecommended, categoryMenu, selectedCategory, currentCategory, menuItemFor, activeBarStyle };
  },
});
</script>

<style scoped lang="scss" src="./index.scss">

</style>