<template>
  <q-page class="q-pa-md home-bg">
    <MainBanner class="q-mt-xl" />
    <PricingSection class="q-mt-xl" />
    <InfoSection class="q-mt-xl" />
    <LearningSection class="q-mt-xl"/>
    <VideosSection class="q-mt-xl"/>

    <PromoSection class="q-mt-xl"/>
    <TestimonialsSection class="q-mt-xl" />

    <TopFeatures class="q-mt-xl" />
    <HeroSection />
    <ThreeCards class="q-mt-xl" />
    <OnlinetheorySection />

  </q-page>

</template>

<script>
import { defineComponent } from "vue";
import HeroSection from "src/components/home/HeroSection.vue";
import PricingSection from "src/components/home/PricingSection.vue";
import InfoSection from "src/components/home/InfoSection.vue";
import LearningSection from "src/components/home/LearningSection.vue";
import PromoSection from "src/components/home/PromoSection.vue";
import ThreeCards from "src/components/home/ThreeCards.vue";
import MainBanner from "src/components/home/MainBanner.vue";
import OnlinetheorySection from "src/components/home/OnlinetheorySection.vue";
import TopFeatures from "src/components/home/TopFeatures.vue";
import VideosSection from "src/components/home/VideosSection.vue";
import TestimonialsSection from "src/components/home/TestimonialsSection.vue";





export default defineComponent({
  name: "IndexPage",
  components: { HeroSection, PricingSection, InfoSection, LearningSection, PromoSection, ThreeCards, MainBanner, OnlinetheorySection, TopFeatures, TestimonialsSection, VideosSection }
});
</script>

<style scoped></style>