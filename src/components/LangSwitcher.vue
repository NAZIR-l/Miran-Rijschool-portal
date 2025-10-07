<template>
  <q-btn-dropdown :label="langLabel">
    <q-list>
      <q-item clickable v-close-popup @click="lang = 'ar'"  :class="{ ActiveLang: lang === 'ar' }" >
        <q-item-section>
          <q-item-label>العربية</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="lang = 'en-US'" :class="{ ActiveLang: lang === 'en-US' }">
        <q-item-section>
          <q-item-label>English</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="lang = 'nl'" :class="{ ActiveLang: lang === 'nl' }">
        <q-item-section>
          <q-item-label>Nederlands</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import $ from "jquery";
import { useI18n } from "vue-i18n";
import languages from "quasar/lang/index.json";

const appLanguages = languages.filter(lang =>
  ["ar", "en-US", "nl"].includes(lang.isoName)
);
$(".English").hide();
export default {
  name: "LangSwitcher",
  data() {
    return {
      lang: this.$q.lang.isoName,
      langOptions: []
    };
  },
  setup() {
    const { locale } = useI18n({ useScope: "global" });
    $(".English").toggleClass("ActiveLang");

    return {
      locale
    };
  },
  created() {
    if (this.$q.cookies.has("locale"))
      this.lang = this.$q.cookies.get("locale");
    this.langOptions = appLanguages.map(lang => ({
      label: lang.nativeName.split(" ")[0],
      value: lang.isoName
    }));
  },

  computed: {
    langLabel() {
      return this.langOptions.find(val => val.value == this.lang).label;
    }
  },

  watch: {
    lang(lang) {
      // dynamic import, so loading on demand onlyFDSAF
      import(
        /* webpackInclude: /(ar|en-US|nl)\.js$/ */
        "quasar/lang/" + lang
      ).then(lang => {
        this.$q.lang.set(lang.default);
        this.locale = lang.default.isoName;
        this.$q.cookies.set("locale", lang.default.isoName);
        try {
          document.documentElement.setAttribute('dir', this.locale === 'ar' ? 'rtl' : 'ltr');
          document.documentElement.setAttribute('lang', this.locale);
        } catch (e) {}
      });
    }
  }
};
</script>
<style>
.ActiveLang {
  background: #043ca1!important;
  color: white!important;
}
.q-menu{
  border-radius: 12px;
}
.q-menu .q-list{
  display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 12px 24px;

position: relative;
width: 200px;
height: 128px;

background: #FFFFFF;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 12px;
}
.q-menu .q-list .q-item{
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 10px 44px;
gap: 10px;
width: 200px;
height: 52px;
background: rgb(255, 255, 255);
color:Black;
text-align: center;
}
</style>