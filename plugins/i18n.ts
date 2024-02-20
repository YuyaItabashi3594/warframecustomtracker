import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import jp from "../locales/jp.json";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: "en",
    },
    messages: {
      en,
      jp,
    },
    locales: [
      {
        code: "en",
        iso: "en-US",
      },
      {
        code: "jp",
        iso: "ja-JP"
      },
    ],
  });
  vueApp.use(i18n);
});
