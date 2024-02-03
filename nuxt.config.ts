// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss",'@vueuse/nuxt'],
  css: ["vuetify/lib/styles/main.sass"],
  build: {
    transpile: [
      "vuetify"
    ],
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: 'WarframeCustomTracker',
    }
  }
})
