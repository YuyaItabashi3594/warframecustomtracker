import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import jp from '../locales/jp.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en,
      jp
    }
  })

  vueApp.use(i18n)
})