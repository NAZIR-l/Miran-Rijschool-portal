import { Quasar, Cookies } from "quasar";

export default async ({ app, ssrContext }) => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;
  const langIso = cookies.has("locale") ? cookies.get("locale") : "ar";

  // Map locale to Quasar language pack
  const quasarLangMap = {
    'en': 'en-US',
    'ar': 'ar',
    'nl': 'nl'
  };
  
  const quasarLang = quasarLangMap[langIso] || 'en-US';

  try {
    await import(
      /* webpackInclude: /(ar|en-US|nl).js$/ */
      "quasar/lang/" + quasarLang
    ).then((lang) => {
      Quasar.lang.set(lang.default, ssrContext);
    });
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
};
