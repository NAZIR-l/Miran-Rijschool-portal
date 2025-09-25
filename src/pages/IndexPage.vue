<template>
  <q-page class="home-bg">
    <div class="dashboard">
      <div class="dashboard-grid three">
        <!-- Greeting -->
        <div class="dash-card greeting-card d-col-12">
          <div class="greeting-inner">
            <div class="copy">
              <div class="eyebrow">Welcome back</div>
              <h2 class="headline">{{ username }}!</h2>
              <div class="sub">Ready to continue learning? Pick up where you left off.</div>
              <div class="actions">
                <q-btn color="primary" unelevated no-caps icon="play_arrow" label="Continue" class="q-mr-sm" />
                <q-btn outline color="primary" no-caps icon="menu_book" label="Browse chapters" />
              </div>
            </div>
            <div class="art">
              <img src="../assets/logo.svg" alt="art" />
            </div>
          </div>
        </div>

        <!-- Overview -->
        <div class="dash-card overview-card d-col-6">
          <div class="card-title with-badge">
            <span>Overview</span>
            <q-chip color="green-6" text-color="white" size="sm">{{ currentPackage.name }}</q-chip>
          </div>
          <div class="overview-rows">
            <div class="row-line">
              <span class="muted">Days left</span>
              <span class="value">{{ daysLeft }} days</span>
            </div>
            <div class="row-line">
              <span class="muted">Expires</span>
              <span class="value">{{ currentPackage.expires }}</span>
            </div>
          </div>
          <div class="quick-links">
            <q-btn flat color="primary" no-caps icon="download" label="Downloads" @click="goto('/downloads')" />
            <q-btn flat color="primary" no-caps icon="person" label="Account" @click="goto('/account')" />
            <q-btn flat color="primary" no-caps icon="receipt" label="Orders" @click="goto('/orders')" />
          </div>
        </div>

        <!-- Progress -->
        <div class="dash-card progress-card d-col-6">
          <div class="card-title">Progress</div>
          <div class="muted">Exams attempted</div>
          <div class="progress-line">
            <div class="percent">{{ progressPercent }}%</div>
            <div class="ratio">({{ practice.done }}/{{ practice.total }})</div>
          </div>
          <q-linear-progress :value="practiceProgress" color="primary" track-color="grey-3" rounded class="q-mt-sm" />
          <div class="hint">Keep going—you’re almost there!</div>
        </div>
      </div>
    </div>
  </q-page>

</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "IndexPage",
  setup() {
    const router = useRouter();
    const username = ref("Tareqyt01");

    const practice = ref({ done: 2, total: 7 });
    const practiceProgress = computed(() => {
      if (practice.value.total === 0) return 0;
      return practice.value.done / practice.value.total;
    });
    const progressPercent = computed(() => Math.round(practiceProgress.value * 100));

    const currentPackage = ref({
      name: 'deluxe',
      expires: '26-10-25 14:07',
      daysUsed: 10,
      totalDays: 31,
    });
    const daysLeft = computed(() => {
      const total = currentPackage.value.totalDays || 0;
      const used = currentPackage.value.daysUsed || 0;
      const left = Math.max(total - used, 0);
      return left;
    });

    function goto(path){
      try { router.push(path); } catch(e) {}
    }

    return { username, practice, practiceProgress, progressPercent, currentPackage, daysLeft, goto };
  },
});
</script>

<style scoped lang="scss" src="../css/dashboard.scss">

</style>