import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default boot(({ app }) => {
  // Pull locale from cookie if available
  let startLocale = "en";
  try {
    const q = app.config.globalProperties.$q
    if (q?.cookies?.has('locale')) startLocale = q.cookies.get('locale') || startLocale
  } catch (e) {}

  const i18n = createI18n({
    locale: startLocale,
    globalInjection: true,
    legacy: false,
    messages,
  });

  // Set i18n instance on app
  app.use(i18n)
  app.config.globalProperties.$i18n = i18n;

  // Set direction for Arabic on load
  try { document.documentElement.setAttribute('dir', startLocale === 'ar' ? 'rtl' : 'ltr') } catch (e) {}
})
