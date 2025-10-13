<template>
  <q-page class="home-bg">
    <div class="dashboard">
      <div class="dashboard-grid three">
        <!-- Greeting -->
        <div class="dash-card greeting-card d-col-12">
          <div class="greeting-inner">
            <div class="copy">
              <div class="eyebrow">{{ $t('dashboard.welcome_back') }}</div>
              <h2 class="headline">{{ username }}!</h2>
              <div class="sub">{{ $t('dashboard.ready') }}</div>
              <div class="actions">
                <q-btn color="primary" unelevated no-caps icon="play_arrow" :label="$t('dashboard.btn_continue')" class="" @click="goto('/practice-exams')" />
                <q-btn outline color="primary" no-caps icon="menu_book" :label="$t('dashboard.btn_browse')" @click="goto('/downloads')" />
              </div>
            </div>
            <div class="art">
              <img src="../assets/Logo-test1.png" alt="art" />
            </div>
          </div>
        </div>

        <!-- Overview -->
        <!-- <div class="dash-card overview-card d-col-6">
          <div class="card-title with-badge">
            <span>{{ $t('dashboard.overview') }}</span>
            <q-chip color="green-6" text-color="white" size="sm">{{ currentPackage.name }}</q-chip>
          </div>
          <div class="overview-rows">
            <div class="row-line">
              <span class="muted">{{ $t('dashboard.days_left') }}</span>
              <span class="value">{{ daysLeft }} {{ $t('dashboard.days') }}</span>
            </div>
            <div class="row-line">
              <span class="muted">{{ $t('dashboard.expires') }}</span>
              <span class="value">{{ currentPackage.expires }}</span>
            </div>
          </div>
          <div class="quick-links">
            <q-btn flat color="primary" no-caps icon="download" :label="$t('dashboard.quick_downloads')" @click="goto('/downloads')" />
            <q-btn flat color="primary" no-caps icon="person" :label="$t('dashboard.quick_account')" @click="goto('/profile-purchases')" />
            <q-btn flat color="primary" no-caps icon="receipt" :label="$t('dashboard.quick_orders')" @click="goto('/orders')" />
          </div>
        </div> -->

        <!-- Progress -->
        <!-- <div class="dash-card progress-card d-col-6">
          <div class="card-title">{{ $t('dashboard.progress') }}</div>
          <div class="muted">{{ $t('dashboard.exams_attempted') }}</div>
          <div class="progress-line">
            <div class="percent">{{ progressPercent }}%</div>
            <div class="ratio">({{ practice.done }}/{{ practice.total }})</div>
          </div>
          <q-linear-progress :value="practiceProgress" color="primary" track-color="grey-3" rounded class="q-mt-sm" />
          <div class="hint">{{ $t('dashboard.hint') }}</div>
        </div> -->
      </div>
    </div>
  </q-page>

</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
export default defineComponent({
  name: "IndexPage",
  setup() {
    const router = useRouter();
    const username = ref("");

    const practice = ref({ done: 2, total: 7 });
    const practiceProgress = computed(() => {
      if (practice.value.total === 0) return 0;
      return practice.value.done / practice.value.total;
    });
    const progressPercent = computed(() => Math.round(practiceProgress.value * 100));

    const currentPackage = ref({ name: '-', expires: '-', daysUsed: 0, totalDays: 0 })
    const myPrograms = ref([])
    const daysLeft = computed(() => {
      const total = currentPackage.value.totalDays || 0;
      const used = currentPackage.value.daysUsed || 0;
      const left = Math.max(total - used, 0);
      return left;
    });

    function goto(path){
      try { router.push(path); } catch(e) {}
    }

    onMounted(async () => {
      try {
        const res = await api.get('/auth/me');
        const user = res?.data;
        if (user && (user.firstName || user.lastName)) {
          const first = user.firstName || '';
          const last = user.lastName || '';
          username.value = `${first} ${last}`.trim();
        } else if (user?.email) {
          username.value = user.email;
        } else {
          username.value = 'User';
        }
      } catch (e) {}

      try {
        const res2 = await api.get('/exams/me/list')
        myPrograms.value = res2?.data || []
        if (myPrograms.value.length > 0) {
          const first = myPrograms.value[0]
          currentPackage.value.name = first.name || 'program'
          currentPackage.value.expires = '-'
          currentPackage.value.daysUsed = 0
          currentPackage.value.totalDays = 0
        }
      } catch (_) {}
    });

    return { username, practice, practiceProgress, progressPercent, currentPackage, daysLeft, goto, myPrograms };
  },
});
</script>

<style scoped lang="scss" src="../css/dashboard.scss">

</style>