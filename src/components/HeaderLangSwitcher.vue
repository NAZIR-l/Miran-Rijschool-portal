<template>
  <q-btn-dropdown
    dense
    flat
    round
    class="lang-dropdown"
    :label="currentFlag"
    no-caps
  >
    <q-list>
      <q-item v-for="opt in options" :key="opt.value" clickable v-close-popup @click="setLanguage(opt.value)">
        <q-item-section avatar>
          <span class="flag-emoji">{{ opt.flag }}</span>
        </q-item-section>
        <q-item-section>
          <!-- <q-item-label>{{ opt.label }}</q-item-label> -->
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'HeaderLangSwitcher',
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const $q = useQuasar()
    const current = ref(locale.value)
    const options = [
      { value: 'en-US', label: 'English', flag: '🇬🇧' },
      { value: 'ar', label: 'العربية', flag: '🇸🇦' },
      { value: 'nl', label: 'Nederlands', flag: '🇳🇱' }
    ]
    const currentFlag = computed(() => (options.find(o => o.value === current.value)?.flag) || '🌐')

    function setLanguage(lang) {
      import(
        /* webpackInclude: /(ar|en-US|nl)\.js$/ */
        'quasar/lang/' + lang
      ).then(mod => {
        const qlang = mod.default
        if (qlang) {
          // Quasar lang
          $q.lang.set(qlang)
          // Vue i18n
          locale.value = qlang.isoName || lang
          // Persist
          $q.cookies.set('locale', locale.value)
          current.value = lang
          // Set direction for Arabic
          try { document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr') } catch (e) {}
          // Force reload to ensure all content re-hydrates in the new locale
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }
      })
    }

    watch(locale, (val) => { current.value = val })

    return { options, current, currentFlag, setLanguage }
  }
})
</script>

<style scoped>
.lang-dropdown .q-btn__content { font-size: 18px; }
.flag-emoji { font-size: 18px; line-height: 1; }
</style>


