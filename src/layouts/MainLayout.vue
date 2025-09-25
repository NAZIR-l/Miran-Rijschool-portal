<template>
  <q-layout view="hHh lpR fff ">
    <!-- ================= HEADER ================= -->
    <q-header class="top-header" elevated>
      <div class="topbar">
        <div class="left">
          <q-btn
            flat
            dense
            round
            icon="menu"
            class="menu-btn"
            @click="isDrawerOpen = true"
          />
          <img src="../assets/logo.svg" alt="Logo" class="logo" />
        </div>
        <div class="right">
          <div class="user-greeting">
            <span class="hi">{{$t('header.hello')}}</span>
            <span class="username">Tareqyt01</span>
          </div>
          <HeaderLangSwitcher />
        </div>
      </div>
    </q-header>

    <!-- ================= PAGE CONTENT ================= -->
    <q-page-container>
      <div
        class="layout-wrap app-container"
        :class="{ 'drawer-open': isDrawerOpen }"
      >
        <!-- Mobile Drawer -->
        <q-drawer
          v-model="isDrawerOpen"
          side="left"
          overlay
          class="mobile-drawer"
          :width="260"
          :breakpoint="1024"
          behavior="mobile"
        >
          <div class="nav-brand">
            <img src="../assets/logo.svg" alt="Logo" class="brand-logo" />
          </div>
          <nav>
            <ul class="nav-list">
              <li
                :class="['menu-item', { active: isActive('/') }]"
                @click="navigateAndClose('/')"
              >
                <q-icon name="dashboard" size="18px" />
                <span>{{ $t('nav.dashboard') }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/downloads') }]"
                @click="navigateAndClose('/downloads')"
              >
                <q-icon name="download" size="18px" />
                <span>{{ $t('nav.downloads') }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/account') }]"
                @click="navigateAndClose('/account')"
              >
                <q-icon name="person" size="18px" />
                <span>{{ $t('nav.account') }}</span>
                <!-- <span class="badge">1</span> -->
              </li>
              <li
                :class="['menu-item', { active: isActive('/orders') }]"
                @click="navigateAndClose('/orders')"
              >
                <q-icon name="receipt" size="18px" />
                <span>{{ $t('nav.orders') }}</span>
              </li>
              <li class="menu-item logout">
                <q-icon name="logout" size="18px" />
                <span>{{ $t('nav.logout') }}</span>
              </li>
            </ul>
          </nav>
        </q-drawer>

        <aside class="sidebar">
          <!-- <div class="nav-brand">
            <img src="../assets/logo.svg" alt="Logo" class="brand-logo" />
          </div> -->
          <nav>
            <ul class="nav-list">
              <li :class="['menu-item', { active: isActive('/') }]" @click="navigate('/')">
                <q-icon name="dashboard" size="18px" />
                <span>{{ $t('nav.dashboard') }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/downloads') }]"
                @click="navigate('/downloads')"
              >
                <q-icon name="download" size="18px" />
                <span>{{ $t('nav.downloads') }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/account') }]"
                @click="navigate('/account')"
              >
                <q-icon name="person" size="18px" />
                <span>{{ $t('nav.account') }}</span>
                <!-- <span class="badge">1</span> -->
              </li>
              <li
                :class="['menu-item', { active: isActive('/signals') }]"
                @click="navigate('/signals')"
              >
                <q-icon name="traffic" size="18px" />
                <span>{{ $t('nav.signals') }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/packages') }]"
                @click="navigate('/packages')"
              >
                <q-icon name="inventory_2" size="18px" />
                <span>{{ $t('nav.packages') }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/orders') }]"
                @click="navigate('/orders')"
              >
                <q-icon name="receipt" size="18px" />
                <span>{{ $t('nav.orders') }}</span>
              </li>
              <li class="menu-item logout">
                <q-icon name="logout" size="18px" />
                <span>{{ $t('nav.logout') }}</span>
              </li>

            </ul>
          </nav>
        </aside>
        <main class="content content-aligned">
          <div class="content-container">
            <div class="page-header"></div>
            <router-view />
            <!-- Content footer inside page content -->
            <footer class="footer-wrap">
              <div class="footer-inner">
                <div class="left">
                  <div>Call us: 020 261 7438</div>
                  <div>Mon - Fri 09:00 to 17:30</div>
                  <div>Sat 11:00 to 16:00</div>
                  <div>Sun closed</div>
                </div>
                <div class="middle">
                  <div>WhatsApp: 06 18 99 20</div>
                  <div>69slagen@theorietoppers.nl</div>
                </div>
                <div class="right">
                  <div>Terms and Conditions © Theorie Toppers 2025</div>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import HeaderLangSwitcher from "src/components/HeaderLangSwitcher.vue";

export default defineComponent({
  name: "MainLayout",
  components: { HeaderLangSwitcher },
  setup() {
    const isMenuOpen = ref(false);
    const isDrawerOpen = ref(false);
    const isPakkettenOpen = ref(false);
    const email = ref("");
    const router = useRouter();
    const currentRoute = useRoute();
    const currentTitle = computed(() => currentRoute.meta?.title || "");
    function navigate(path) {
      try {
        router.push(path);
      } catch (e) {}
    }
    function navigateAndClose(path) {
      navigate(path);
      isDrawerOpen.value = false;
    }
    function isActive(path) {
      return (
        currentRoute.path === path ||
        (path === "/" && currentRoute.path === "/")
      );
    }
    return {
      isMenuOpen,
      isPakkettenOpen,
      email,
      navigate,
      isActive,
      currentTitle,
      isDrawerOpen,
      navigateAndClose,
    };
  },
});
</script>

<style  >
/* Top header styling to resemble a professional marketing navbar */
.top-header {
  background: rgba(255,255,255,0.7);
  backdrop-filter: saturate(1.2) blur(12px);
}
.topbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.topbar .left { display: flex; align-items: center; gap: 10px; }
.topbar .right { display: flex; align-items: center; gap: 12px; }
.logo { height: 32px; width: auto; }
.user-greeting { display: flex; align-items: baseline; gap: 6px; font-size: 14px; }
.user-greeting .hi { color: #64748b; }
.user-greeting .username { font-weight: 800; color: #0f172a; }

/* Creative subtle entrance animation */
.topbar { animation: slideDownFade .45s ease both; }
@keyframes slideDownFade {
  0% { transform: translateY(-12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@media (min-width: 768px) {
    .css-na5tku img {
        width: 14px;
    }
}

.css-na5tku img {
    margin-right: 4px;
    width: 14px;
}
.css-y3dqpa {
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  font-size: 14px;
}
.css-na5tku {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #ff9900;
  font-size: 18px;
  background: -webkit-linear-gradient(
      180deg,
      rgba(255, 3, 3, 0.2) 8.85%,
      rgba(255, 184, 0, 0.042) 100%
    ),
    #ff9900;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  margin-right: 8px;
}
@media (min-width: 768px) {
    .css-na5tku {
        margin-right: 16px;
        font-size: 22px;
    }
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.app-header {
  background: #0d5be0;
}
.header-inner {
  display: flex;
  align-items: center;
  height: 64px;
}
.header-inner.minimal {
  justify-content: flex-start;
}
/* removing empty ruleset to satisfy linter */
.spacer {
  flex: 1;
}
.user-area {
  display: flex;
  align-items: center;
  color: #ffffff;
  gap: 8px;
}
.mr-6 {
  margin-right: 6px;
}
.mr-16 {
  margin-right: 16px;
}
.hello {
  font-weight: 500;
}

.layout-wrap {
  display: flex;
  gap: 24px;
}
.sidebar {
  width: 220px;
  padding: 16px 0;
}
.content-aligned{ flex:1; }
.nav-brand {
  padding: 0 10px;
  height: 74px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: 16px;
  
  overflow: hidden;
  position: relative;
  pointer-events: none;
}
.brand-logo {
  height: 36px;
  width: auto;
}
.sidebar {
  display: flex;
  flex-direction: column;
}
.sidebar nav {
  flex: 1;
  height: 100%;
  
}
.sidebar nav ul {
  height: max-content !important; 
  list-style: none;
  margin: 0;
  font-size: 16px;
  font-weight: blod;
  unicode-bidi: isolate;
  padding: 0;
  padding-top: 16px;
  
  height: 100%;
  margin-top: 14px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: flex-start;
  border-top: 5px solid #2b3bff !important;
}
.sidebar nav li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: #334155;
  border: 1px solid transparent;
  transition: background-color .2s ease, color .2s ease, transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.sidebar nav li:hover {
  background: #f8fafc;
}
.sidebar nav li.active {
  color: #0f172a;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.85), rgba(255, 255, 255, 0.9));
  border-color: #e5e7eb;
  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.06);
  transform: translateY(-1px);
}
.sidebar nav li .badge {
  margin-left: auto;
  background: #ff3b30;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}
.sidebar nav li.logout {
  color: #e24d3a;
}

/* Drawer and sidebar: container surface like category menu */
.mobile-drawer .nav-list,
.sidebar .nav-list {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
}

/* Left accent bar on active state */
.sidebar nav li.active,
.mobile-drawer nav li.active {
  position: relative;
}
.sidebar nav li.active::before,
.mobile-drawer nav li.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: 4px;
  background: linear-gradient(180deg, #1275ff, #2b3bff);
}

/* Icon color harmony */
.sidebar nav li .q-icon,
.mobile-drawer nav li .q-icon {
  color: #64748b;
}
.sidebar nav li.active .q-icon,
.mobile-drawer nav li.active .q-icon {
  color: #0f172a;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 91vh;
}
/* Stick footer to bottom of viewport when content is short */
.content-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.content-container > .footer-wrap {
  margin-top: auto;
}

.content-container{
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.footer-wrap {
  padding: 40px 0 0;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  color: #666;
  font-size: 14px;
}
.footer-inner .left,
.footer-inner .middle {
  font-size: 14px;
  color: #281931;
}
.footer-inner .right {
  font-size: 14px;
  display: flex;
  align-items: flex-end;
  color: #b1b1b1;
  margin: 0 0 0.5em;
}
.footer-inner .left div + div,
.footer-inner .middle div + div {
  margin-top: 4px;
}
</style>