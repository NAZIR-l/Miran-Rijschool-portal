import { Quasar, Cookies } from "quasar";

export default async ({ app, ssrContext }) => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies;
  const langIso = cookies.has("locale") ? cookies.get("locale") : "ar";

  try {
    await import(
      /* webpackInclude: /(ar|en).js$/ */
      "quasar/lang/" + langIso
    ).then((lang) => {
      Quasar.lang.set(lang.default, ssrContext);
    });
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
};
