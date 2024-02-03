import '@mdi/font/css/materialdesignicons.css'
import * as components from "vuetify/components";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    theme:{
      defaultTheme: 'dark'
    }
  })
  app.vueApp.use(vuetify)
})