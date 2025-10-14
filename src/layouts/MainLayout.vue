<template>
  <q-layout view="hHh lpR fff ">
    <!-- ================= HEADER ================= -->
    <q-header v-if="!isExamMode" class="top-header" elevated>
      <div class="topbar">
        <div class="left">
          <q-btn
            outline
            dense
            round
            size="md"
            color="primary"
            icon="menu"
            aria-label="Open menu"
            class="menu-btn"
            @click="isDrawerOpen = !isDrawerOpen"
          />
          <div class="logo-container">
            <img src="../assets/Logo-test1.png" alt="Logo" class="logo" />
          </div>
        </div>
        <div class="right">
          <!-- <div class="user-greeting">
            <span class="hi">{{ $t("header.hello") }}</span>
            <span class="username">Tareqyt01</span>
          </div> -->

          <!-- Notifications Bell Icon -->
          <div class="notifications-bell">
            <q-btn flat dense round icon="notifications" class="bell-btn">
              <q-badge
                v-if="hasUnread"
                floating
                color="red"
                :label="unreadCount"
                class="notification-badge"
              />
              <q-tooltip>Notifications</q-tooltip>

              <!-- Notifications Dropdown -->
              <q-menu
                anchor="bottom right"
                self="top right"
                class="notifications-menu"
                :offset="[0, 8]"
                max-width="400px"
                max-height="500px"
              >
                <div class="notifications-dropdown">
                  <div class="notifications-header">
                    <div class="header-title">
                      <q-icon
                        name="notifications"
                        size="20px"
                        color="primary"
                      />
                      <span>Notifications</span>
                      <q-badge
                        v-if="hasUnread"
                        color="red"
                        :label="unreadCount"
                        class="unread-badge"
                      />
                    </div>
                    <div class="header-actions">
                      <q-btn
                        flat
                        dense
                        round
                        icon="refresh"
                        size="sm"
                        color="grey-6"
                        @click="refreshNotifications"
                        :loading="refreshing"
                      >
                        <q-tooltip>Refresh</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        dense
                        round
                        icon="done_all"
                        size="sm"
                        color="grey-6"
                        @click="markAllAsRead"
                        :disable="!hasUnread"
                      >
                        <q-tooltip>Mark all as read</q-tooltip>
                      </q-btn>
                    </div>
                  </div>

                  <q-separator />

                  <div class="notifications-list">
                    <div
                      v-if="notifications.length === 0"
                      class="no-notifications"
                    >
                      <q-icon
                        name="notifications_off"
                        size="32px"
                        color="grey-4"
                      />
                      <p>No notifications</p>
                      <span>You're all caught up!</span>
                    </div>

                    <div v-else class="notification-items">
                      <div
                        v-for="notification in notifications.slice(0, 6)"
                        :key="notification.id"
                        class="notification-item"
                        :class="[
                          `notification-${notification.type}`,
                          { unread: !notification.read },
                        ]"
                      >
                        <div class="notification-icon">
                          <q-icon
                            :name="getNotificationIcon(notification.type)"
                            :color="getNotificationColor(notification.type)"
                            size="18px"
                          />
                          <div
                            v-if="!notification.read"
                            class="unread-dot"
                          ></div>
                        </div>

                        <div
                          class="notification-content"
                          @click="markAsRead(notification.id)"
                        >
                          <div class="notification-title">
                            {{ notification.title }}
                          </div>
                          <div class="notification-message">
                            {{ notification.message }}
                          </div>
                          <div class="notification-time">
                            {{ formatTime(notification.timestamp) }}
                          </div>
                        </div>

                        <q-btn
                          flat
                          dense
                          round
                          icon="close"
                          size="xs"
                          color="grey-5"
                          @click="dismissNotification(notification.id)"
                          class="dismiss-btn"
                        >
                          <q-tooltip>Dismiss</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <q-separator v-if="notifications.length > 0" />

                  <!-- <div v-if="notifications.length > 0" class="notifications-footer">
                  <q-btn
                    flat
                    no-caps
                    color="primary"
                    label="View All Notifications"
                    @click="viewAllNotifications"
                    class="view-all-btn"
                  />
                </div> -->
                </div>
              </q-menu>
            </q-btn>
          </div>

          <HeaderLangSwitcher />
        </div>
      </div>
    </q-header>

    <!-- Mobile Drawer (must be a direct child of q-layout) -->
    <q-drawer
      v-if="!isExamMode"
      v-model="isDrawerOpen"
      side="left"
      overlay
      elevated
      behavior="mobile"
      class="mobile-drawer"
      :width="260"
    >
      <div class="nav-brand">
        <img src="../assets/Logo-test1.png" alt="Logo" class="brand-logo" />
      </div>
      <nav>
        <ul class="nav-list">
          <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/') }]"
            @click="navigate('/')"
          >
            <q-icon name="dashboard" size="18px" />
            <span>{{ $t("nav.dashboard") }}</span>
          </li>
          <!-- <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/my-programs') }]"
            @click="navigate('/my-programs')"
          >
            <q-icon name="school" size="18px" />
            <span>{{ $t("nav.my-programs") }}</span>
          </li> -->
          <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/practice-exams') }]"
            @click="navigate('/practice-exams')"
          >
            <q-icon name="school" size="18px" />
            <span>{{ $t("nav.practice-exams") }}</span>
          </li>
          <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/signals') }]"
            @click="navigate('/signals')"
          >
            <q-icon name="traffic" size="18px" />
            <span>{{ $t("nav.signals") }}</span>
          </li>
          <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/downloads') }]"
            @click="navigate('/downloads')"
          >
            <q-icon name="download" size="18px" />
            <span>{{ $t("nav.downloads") }}</span>
          </li>
          <!-- <li
                :class="['menu-item', { active: isActive('/account') }]"
                @click="navigate('/account')"
              >
                <q-icon name="person" size="18px" />
                <span>{{ $t('nav.account') }}</span>
                <span class="badge">1</span>
              </li> -->
          <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/profile-purchases') }]"
            @click="navigate('/profile-purchases')"
          >
            <q-icon name="person" size="18px" />
            <span>{{ $t("nav.profile-purchases") }}</span>
          </li>

          <li
            v-if="hasActivePrograms"
            :class="['menu-item', { active: isActive('/support') }]"
            @click="navigate('/support')"
          >
            <q-icon name="download" size="18px" />
            <span>{{ $t("nav.support") }}</span>
          </li>
          <li
            :class="['menu-item', { active: isActive('/courses') }]"
            @click="navigate('/courses')"
          >
            <q-icon name="inventory_2" size="18px" />
            <span>{{ $t("nav.packages") }}</span>
          </li>

          <li
            :class="['menu-item', { active: isActive('/orders') }]"
            @click="navigate('/orders')"
          >
            <q-icon name="receipt" size="18px" />
            <span>{{ $t("nav.orders") }}</span>
          </li>

          <li class="menu-item logout" @click="handleLogout">
            <q-icon name="logout" size="18px" />
            <span>{{ $t("nav.logout") }}</span>
          </li>
        </ul>
      </nav>
    </q-drawer>

    <!-- ================= PAGE CONTENT ================= -->
    <q-page-container>
      <div v-if="loading" class="card-body text-center q-pa-xl">
        <q-spinner color="primary" size="50px" />
      </div>
      <div
        v-else
        class="layout-wrap app-container"
        :class="{ 'drawer-open': isDrawerOpen }"
      >
        <aside class="sidebar" v-if="!isExamMode">
          <!-- <div class="nav-brand">
            <img src="../assets/logo.svg" alt="Logo" class="brand-logo" />
          </div> -->
          <nav>
            <ul class="nav-list">
              <li
                v-if="hasActivePrograms"
                :class="['menu-item', { active: isActive('/') }]"
                @click="navigate('/')"
              >
                <q-icon name="dashboard" size="18px" />
                <span>{{ $t("nav.dashboard") }}</span>
              </li>
              <!-- <li
                v-if="hasActivePrograms"
                :class="['menu-item', { active: isActive('/my-programs') }]"
                @click="navigate('/my-programs')"
              >
                <q-icon name="school" size="18px" />
                <span>{{ $t("nav.my-programs") }}</span>
              </li> -->
              <li
                v-if="hasActivePrograms"
                :class="['menu-item', { active: isActive('/practice-exams') }]"
                @click="navigate('/practice-exams')"
              >
                <q-icon name="school" size="18px" />
                <span>{{ $t("nav.practice-exams") }}</span>
              </li>
              <li
                v-if="hasActivePrograms"
                :class="['menu-item', { active: isActive('/signals') }]"
                @click="navigate('/signals')"
              >
                <q-icon name="traffic" size="18px" />
                <span>{{ $t("nav.signals") }}</span>
              </li>
              <li
                v-if="hasActivePrograms"
                :class="['menu-item', { active: isActive('/downloads') }]"
                @click="navigate('/downloads')"
              >
                <q-icon name="download" size="18px" />
                <span>{{ $t("nav.downloads") }}</span>
              </li>
              <!-- <li
                :class="['menu-item', { active: isActive('/account') }]"
                @click="navigate('/account')"
              >
                <q-icon name="person" size="18px" />
                <span>{{ $t('nav.account') }}</span>
                <span class="badge">1</span>
              </li> -->
              <li
                v-if="hasActivePrograms"
                :class="[
                  'menu-item',
                  { active: isActive('/profile-purchases') },
                ]"
                @click="navigate('/profile-purchases')"
              >
                <q-icon name="person" size="18px" />
                <span>{{ $t("nav.profile-purchases") }}</span>
              </li>

              <li
                v-if="hasActivePrograms"
                :class="['menu-item', { active: isActive('/support') }]"
                @click="navigate('/support')"
              >
                <q-icon name="download" size="18px" />
                <span>{{ $t("nav.support") }}</span>
              </li>
              <li
                :class="['menu-item', { active: isActive('/courses') }]"
                @click="navigate('/courses')"
              >
                <q-icon name="inventory_2" size="18px" />
                <span>{{ $t("nav.packages") }}</span>
              </li>

              <li
                :class="['menu-item', { active: isActive('/orders') }]"
                @click="navigate('/orders')"
              >
                <q-icon name="receipt" size="18px" />
                <span>{{ $t("nav.orders") }}</span>
              </li>
              <li class="menu-item logout" @click="handleLogout">
                <q-icon name="logout" size="18px" />
                <span>{{ $t("nav.logout") }}</span>
              </li>
            </ul>
          </nav>
        </aside>
        <main class="content content-aligned">
          <div class="content-container">
            <div class="page-header"></div>
            <router-view />
            <footer class="footer-wrap">
              <div class="footer-top">
                <div class="footer-col brand">
                  <div class="image-container">
                  <img
                    src="../assets/Logo-test1.png"
                    alt="Theorie Toppers"
                    class="footer-logo"
                    />
                  </div>
                  <p class="tagline">Learn smarter. Pass faster.</p>
                
                </div>

                <div class="footer-col contact">
                  <div class="col-title">Contact</div>
                  <ul class="list">
                    <li>
                      <q-icon name="call" size="16px" />
                      <span>020 261 7438</span>
                    </li>
                    <li>
                      <q-icon name="chat" size="16px" />
                      <span>WhatsApp: 06 18 99 20</span>
                    </li>
                    <li>
                      <q-icon name="mail" size="16px" />
                      <a href="mailto:69slagen@theorietoppers.nl"
                        >69slagen@theorietoppers.nl</a
                      >
                    </li>
                  </ul>
                </div>
              </div>

              <div class="footer-bottom">
                <div class="copy">© 2025 Theorie Toppers</div>
                <div class="footer-links">
                  <span>Terms and Conditions</span>
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
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import HeaderLangSwitcher from "src/components/HeaderLangSwitcher.vue";
import { useNotifications } from "src/composables/useNotifications.js";
import { api } from "src/boot/axios.js";
import { Cookies } from "quasar";

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
    const loading = ref(true);
    const currentTitle = computed(() => currentRoute.meta?.title || "");
    const isExamMode = computed(() => currentRoute.meta?.hideSidebar === true);
    const userPrograms = ref([]);
    const hasActivePrograms = computed(() => userPrograms.value.length > 0);
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

    // Notifications functionality
    const {
      notifications,
      unreadCount,
      hasUnread,
      refreshing,
      getNotificationIcon,
      getNotificationColor,
      formatTime,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      refreshNotifications,
    } = useNotifications();

    function viewAllNotifications() {
      navigate("/support");
    }

    async function fetchUserPrograms() {
      try {
        loading.value = true;
        const response = await api.get("/exams/my-courses");
        userPrograms.value = response.data || [];
      } catch (error) {
        // User might not be authenticated or no programs available
        userPrograms.value = [];
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      fetchUserPrograms();
    });

    async function handleLogout() {
      try {
        try {
          await api.post("/auth/logout");
        } catch (_) {}
        Cookies.remove("auth_token", { path: "/" });
        window.location.assign("/");
      } finally {
        isDrawerOpen.value = false;
        redirect("/");
      }
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
      // Notifications
      notifications,
      unreadCount,
      hasUnread,
      refreshing,
      getNotificationIcon,
      getNotificationColor,
      formatTime,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      refreshNotifications,
      viewAllNotifications,
      isExamMode,
      handleLogout,
      // User Programs
      hasActivePrograms,
      loading,
    };
  },
});
</script>

<style  >
/* Top header styling to resemble a professional marketing navbar */
.top-header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: saturate(1.2) blur(12px);
}
.topbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.menu-item span {
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
}
.topbar .left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.topbar .right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-container {
  max-width: 180px;
}
.logo {
  width: 100%;
  height: 60px;
}
.menu-btn {
  box-shadow: 0 2px 8px rgba(2, 6, 23, 0.08);
}
.user-greeting {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14px;
  white-space: nowrap;
}
.user-greeting .hi {
  color: #64748b;
}
.user-greeting .username {
  font-weight: 800;
  color: #0f172a;
}

/* Creative subtle entrance animation */
.topbar {
  animation: slideDownFade 0.45s ease both;
}
@keyframes slideDownFade {
  0% {
    transform: translateY(-12px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
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
  padding: 0 24px;
  gap: 24px;
}
.layout-wrap.drawer-open {
  overflow: hidden;
}
.sidebar {
  width: 220px;
  padding: 16px 0;
}
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
.content-aligned {
  flex: 1;
}
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
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
    border-color 0.2s ease, box-shadow 0.2s ease;
}
.sidebar nav li:hover {
  background: #f8fafc;
}
.sidebar nav li.active {
  color: #0f172a;
  background: linear-gradient(
    180deg,
    rgba(248, 250, 252, 0.85),
    rgba(255, 255, 255, 0.9)
  );
  border-color: #e5e7eb;
  border-left: 5px solid #2b3bff;
  border-right: 5px solid #2b3bff;
  box-shadow: 20px 16px 24px rgba(0, 0, 0, 0.06);
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
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* Ensure mobile drawer overlays above header */
.mobile-drawer {
  background: #ffffff;
  z-index: 3000;
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
  width: 4px;
  border-radius: 4px;
  /* background: #2b3bff; */
  /* border-left: 15px solid #2b3bff; */
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

.content-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.footer-wrap {
  padding: 40px 0 0;
}
/* New professional footer styles */
.footer-top {
  display: grid;
  grid-template-columns: 1.2fr 1fr ;
  gap: 24px;
  padding: 32px 0 16px;
  border-top: 1px solid #eef2f7;
}
.image-container{
  width: 100px;          /* size of the div */
  display: flex;          /* center the image */
  justify-content: center;
  align-items: center;
}

.footer-col .col-title {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.footer-col.brand {
  color: #475569;
}

.footer-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.footer-logo {
  height: 50px;
  width: auto;
  margin-bottom: 10px;
}

.tagline {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 14px;
}

.socials {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}
.social-link a,
.social-link span,
.footer-col.contact a {
  color: #334155;
  text-decoration: none;
}
.social-link a:hover,
.footer-col.contact a:hover {
  text-decoration: underline;
}

.footer-col .list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #334155;
}

.footer-col.hours .list li,
.footer-col.contact .list li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-col.hours .list li {
  justify-content: space-between;
}

.footer-bottom {
  padding: 14px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  color: #64748b;
  border-top: 1px dashed #e5e7eb;
  white-space: nowrap;
}

.footer-links {
  display: flex;
  gap: 16px;
}
.footer-links span {
  cursor: pointer;
}
.footer-links span:hover {
  color: #0f172a;
}

/* Responsive footer */
@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ================= NOTIFICATIONS STYLES ================= */
.notifications-bell {
  position: relative;
  margin: 0 8px;
}

.bell-btn {
  color: #64748b;
  transition: all 0.2s ease;
}

.bell-btn:hover {
  color: #1e293b;
  background-color: #f1f5f9;
}

.notification-badge {
  font-size: 10px;
  min-width: 16px;
  height: 16px;
}

.notifications-dropdown {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  width: 380px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
}

.notifications-header {
  padding: 16px 20px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
}

.unread-badge {
  font-size: 10px;
  margin-left: 4px;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 320px;
}

.no-notifications {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.no-notifications p {
  margin: 8px 0 4px 0;
  font-weight: 500;
}

.no-notifications span {
  font-size: 14px;
  color: #9ca3af;
}

.notification-items {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f8fafc;
}

.notification-item.unread {
  background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
  border-left: 3px solid #3b82f6;
}

.notification-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  flex-shrink: 0;
}

.notification-exam .notification-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.notification-payment .notification-icon {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.notification-announcement .notification-icon {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
}

.unread-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  border: 1px solid #ffffff;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 2px;
}

.notification-message {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
}

.dismiss-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.notification-item:hover .dismiss-btn {
  opacity: 1;
}

.notifications-footer {
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.view-all-btn {
  width: 100%;
  font-weight: 500;
}

/* Responsive styles for notifications */
@media (max-width: 480px) {
  .notifications-dropdown {
    width: 320px;
    max-height: 400px;
  }

  .notification-item {
    padding: 10px 16px;
  }

  .notifications-header,
  .notifications-footer {
    padding: 12px 16px;
  }
}
</style>