<template>
  <q-layout view="hHh lpR fff">
    <!-- ================= HEADER ================= -->
    <q-header elevated class="app-header">

    </q-header>


    <!-- ================= PAGE CONTENT ================= -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- ================= FOOTER ================= -->
    <footer class="footer-wrap">

    </footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import LangSwitcher from "src/components/LangSwitcher.vue";

export default defineComponent({
  name: "MainLayout",
  components: { LangSwitcher },
  setup() {
    const isMenuOpen = ref(false);
    const isPakkettenOpen = ref(false);
    const email = ref("");
    function go(path){
      // Use window.location for now; replace with router if routes exist
      try { window.location.href = path; } catch(e) {}
    }
    return { isMenuOpen, isPakkettenOpen, email, go };
  },
});
</script>

<style  >
</style>