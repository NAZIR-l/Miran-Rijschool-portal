<template>
  <q-layout view="hHh lpR fff">
    <!-- ================= HEADER ================= -->
    <q-header elevated class="app-header">
      <div class="container header-inner">
        <!-- Logo -->
        <div class="logo">THEORIE<span>TOPPERS</span></div>

        <!-- Desktop Navigation -->
        <nav class="nav-links desktop-only">
          <!-- Pakketten Dropdown: simplified hover list -->
          <div class="nav-dropdown" @mouseenter="isPakkettenOpen = true" @mouseleave="isPakkettenOpen = false">
            <button class="nav-item simple-btn">Pakketten</button>
            <transition name="fade-down">
              <div v-show="isPakkettenOpen" class="simple-menu">
                <a href="#" @click.prevent="go('/packages/theorie')">Theorie Pakketen</a>
                <a href="#" @click.prevent="go('/packages/online-theorie')">Theorie Cursus Online</a>
                <a href="#" @click.prevent="go('/packages/theorie-praktijk')">Theorie/praktijk Pakketen</a>
              </div>
            </transition>
          </div>

          <router-link class="nav-item" to="/how-it-works">Hoe werkt het?</router-link>
          <router-link class="nav-item" to="/traffic-signs">Verkeersborden</router-link>
          <router-link class="nav-item" to="/contact">Contact</router-link>
        </nav>

        <!-- Desktop actions -->
        <div class="actions desktop-only">
          <q-btn no-caps unelevated class="btn-order" label="BESTELLEN" />
          <q-btn no-caps unelevated class="btn-login" label="LOGIN" />
        </div>

        <!-- Mobile menu button -->
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="mobile-only menu-btn"
          @click="isMenuOpen = true"
        />
      </div>
    </q-header>

    <!-- ================= MOBILE DRAWER ================= -->
    <q-drawer
      v-model="isMenuOpen"
      side="right"
      overlay
      behavior="mobile"
      class="mobile-drawer"
    >
      <div class="drawer-content">
        <q-btn flat round dense icon="close" class="close-btn" @click="isMenuOpen = false" />

        <div class="drawer-logo">THEORIE<span>TOPPERS</span></div>

        <!-- Pakketten Expansion -->
        <q-expansion-item label="Pakketten" expand-separator dense>
      <q-list padding>
            <q-item clickable v-ripple><q-item-section>Theorie Pakketen</q-item-section></q-item>
            <q-item clickable v-ripple><q-item-section>Theorie Cursus Online</q-item-section></q-item>
            <q-item clickable v-ripple><q-item-section>Theorie/praktijk Pakketen</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

        <router-link class="drawer-link" to="/how-it-works" @click="isMenuOpen=false">Hoe werkt het?</router-link>
        <router-link class="drawer-link" to="/traffic-signs" @click="isMenuOpen=false">Verkeersborden</router-link>
        <router-link class="drawer-link" to="/contact" @click="isMenuOpen=false">Contact</router-link>

        <div class="drawer-actions">
          <q-btn no-caps unelevated class="btn-order full-width q-mb-sm" label="BESTELLEN" />
          <q-btn no-caps unelevated class="btn-login full-width" label="LOGIN" />
        </div>

        <LangSwitcher />
      </div>
    </q-drawer>

    <!-- ================= PAGE CONTENT ================= -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- ================= FOOTER ================= -->
    <footer class="footer-wrap">
      <section class="container footer-inner">
        <div class="newsletter">
          <div class="nl-title">Blijf op de hoogte met onze nieuwsbrief</div>
          <div class="nl-form">
            <q-input v-model="email" dense borderless placeholder="e-mailadres" class="nl-input"/>
            <q-btn round color="deep-orange" icon="arrow_forward" class="nl-btn" />
          </div>
          <div class="nl-consent">
            Ik ga akkoord met het <a href="#">privacybeleid</a>
          </div>
        </div>

        <div class="links-grid">
          <div class="col">
            <h5 class="col-title">Theorie Examen Oefenen</h5>
            <ul class="link-list">
              <li><router-link to="#">Auto theorie</router-link></li>
              <li><router-link to="#">Bromfiets theorie</router-link></li>
              <li><router-link to="#">Motor theorie</router-link></li>
              <li><router-link to="#">Vaarbewijs</router-link></li>
            </ul>
          </div>
          <div class="col">
            <h5 class="col-title">24 uur gratis oefenen</h5>
            <ul class="link-list">
              <li><router-link to="#">Gratis auto theorie oefenen</router-link></li>
              <li><router-link to="#">Gratis bromfiets theorie oefenen</router-link></li>
              <li><router-link to="#">Gratis motor theorie oefenen</router-link></li>
              <li><router-link to="#">Gratis vaarbewijs oefenen</router-link></li>
            </ul>
          </div>
          <div class="col">
            <h5 class="col-title">Meer</h5>
            <ul class="link-list">
              <li><router-link to="#">Blog</router-link></li>
              <li><router-link to="#">Contact</router-link></li>
              <li><router-link to="#">Demo</router-link></li>
              <li><router-link to="#">Restitutie Beleid</router-link></li>
              <li><router-link to="#">Algemene voorwaarden</router-link></li>
            </ul>
          </div>
          <div class="col">
            <h5 class="col-title">Land</h5>
            <div class="country">🇳🇱 Nederland</div>
            <router-link class="country-change" to="#">Kies een ander land</router-link>

            <div class="social">
              <div class="social-title">Volg ons</div>
              <div class="icons">
                <q-btn round flat icon="fa-brands fa-youtube" style="color:#ff0000" />
                <q-btn round flat icon="fa-brands fa-tiktok" style="color:#000000" />
                <q-btn round flat icon="fa-brands fa-instagram" style="color:#E1306C" />
                <q-btn round flat icon="fa-brands fa-snapchat" style="color:#FFFC00" />
                <q-btn round flat icon="fa-brands fa-facebook" style="color:#1877F2" />
              </div>
            </div>

            <div class="contact">
              <div class="line"><q-icon name="phone" /> 020 261 74 38</div>
              <div class="line"><q-icon name="mail" /> slagen@theorietoppers.nl</div>
              <div class="line"><q-icon name="chat" /> 06 18 99 20 69</div>
            </div>
          </div>
        </div>
      </section>
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

<style lang="scss" scoped>
/* ================= HEADER ================= */
.app-header {
  background: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
.header-inner {
  display:flex; justify-content:space-between; align-items:center; padding:12px 24px;
}
.logo { font-size:26px; font-weight:900; font-family:"Montserrat", sans-serif; color:#222;
  span{ color:#ff5a1f; }
}
.nav-links { display:flex; gap:20px; align-items:center; }
.nav-item { font-weight:600; color:#333; text-decoration:none; transition:0.3s; padding:6px 12px; border-radius:6px;
  &:hover { color:#fff; background: linear-gradient(90deg,#2261ff,#2e7bff); }
}
.nav-dropdown{ position:relative; }
.simple-btn{ background:transparent; border:0; cursor:pointer; font-weight:600; color:#333; padding:6px 12px; border-radius:6px; }
.simple-btn:hover{ color:#fff; background: linear-gradient(90deg,#2261ff,#2e7bff); }
.simple-menu{ position:absolute; top:100%; left:0; background:#fff; border:1px solid #eee; border-radius:12px; padding:8px 6px; min-width:240px; box-shadow:0 10px 20px -12px rgba(16,24,40,.18); }
.simple-menu a{ display:block; padding:10px 12px; color:#241b2d; text-decoration:none; border-radius:8px; font-weight:600; }
.simple-menu a:hover{ background:#f2f5ff; }
.fade-down-enter-active,.fade-down-leave-active{ transition: all .16s ease; transform-origin: top; }
.fade-down-enter-from,.fade-down-leave-to{ opacity:0; transform: translateY(-6px) scale(.98); }
.dropdown-item { padding:8px 16px; border-radius:6px; transition:0.2s;
  &:hover { background:#2261ff; color:#fff; }
}
.mega-menu{ width:640px; padding:12px; }
.menu-grid{ display:grid; grid-template-columns:1fr; gap:6px; }
.mega-item{ border-radius:10px; transition:0.2s; }
.mega-item:hover{ background:#f2f5ff; }
.mi-title{ font-weight:800; color:#1f1630; }
.mi-desc{ color:#6b6474; font-size:12px; }
.menu-footer{ display:flex; justify-content:flex-end; padding-top:6px; }
.actions { display:flex; gap:12px; }
.btn-order { color:#fff; border-radius:12px; background:linear-gradient(90deg,#2261ff,#2e7bff); }
.btn-login { color:#fff; border-radius:12px; background:linear-gradient(90deg,#ff5a1f,#ff2d20); }

/* ================= DRAWER ================= */
.mobile-drawer { width:280px; padding:20px; z-index:9999; }
.drawer-content{ display:flex; flex-direction:column; gap:20px; }
.close-btn{ align-self:flex-end; }
.drawer-logo{ font-size:24px; font-weight:900; margin-bottom:20px; }
.drawer-link{ font-weight:600; color:#333; text-decoration:none; padding:10px 0; display:block; &:hover{ color:#ff5a1f; } }

/* ================= FOOTER ================= */
.footer-wrap{ background:#f5f4f2; padding:40px 60px; margin-top:40px; }
.newsletter{ display:grid; grid-template-columns:1fr auto; gap:10px 18px; align-items:center; margin-bottom:24px; }
.nl-title{ font-weight:800; color:#1e1727; grid-column:1/-1; }
.nl-form{ display:flex; align-items:center; width:100%; max-width:520px; background:#fff; border-radius:999px; padding-left:16px; }
.nl-input{ flex:1; }
.nl-btn{ margin-left:6px; }
.nl-consent{ color:#5b5364; font-size:13px; grid-column:1/-1; }
.nl-consent a{ color:#1e40af; font-weight:700; }
.links-grid{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:28px; padding-top:10px; }
.col-title{ font-weight:900; color:#241b2d; margin-bottom:10px; }
.link-list{ list-style:none; margin:0; padding:0; display:grid; gap:10px; }
.link-list a{ color:#3c3447; text-decoration:none; font-weight:600; }
.country{ margin:4px 0; font-weight:700; }
.country-change{ color:#1e40af; font-weight:700; text-decoration:none; }
.social{ margin-top:14px; }
.social-title{ font-weight:800; margin-bottom:6px; }
.icons :deep(.q-btn){ font-size:20px; }
.contact{ margin-top:12px; color:#3b3243; font-weight:600; }
.contact .line{ display:flex; align-items:center; gap:8px; margin-top:6px; }

/* ================= RESPONSIVE ================= */
.desktop-only{ display:flex; }
.mobile-only{ display:none; }
@media(max-width:768px){
  .desktop-only{ display:none !important; }
  .mobile-only{ display:flex !important; }
  .links-grid{ grid-template-columns:1fr 1fr; }
  .newsletter{ grid-template-columns:1fr; }
}
@media(max-width:640px){ .links-grid{ grid-template-columns:1fr; } }
</style>
