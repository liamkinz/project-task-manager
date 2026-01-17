// import { createVuetify } from 'vuetify'
// import 'vuetify/styles'

// export const vuetify = createVuetify()

// 2. Vuetify Imports
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// 1. CSS Imports
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export const vuetify = createVuetify({
  components, // <--- MUST HAVE THIS
  directives, // <--- MUST HAVE THIS
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
