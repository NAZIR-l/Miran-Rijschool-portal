import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { Cookies } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  // Persist token from query string into cookie on app init (runs once)
  try {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      Cookies.set('auth_token', token, { path: '/', sameSite: 'Lax' })
      // Remove token from URL without reload
      const url = new URL(window.location.href)
      url.searchParams.delete('token')
      window.history.replaceState({}, document.title, url.toString())
    }
  } catch (_) {}

  return pinia
})
