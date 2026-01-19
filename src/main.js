import { createApp } from 'vue'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import router from './router'

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')

// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
// import 'vuetify/styles'
// import '@mdi/font/css/materialdesignicons.css'

// export const vuetify = createVuetify({
//   components,
//   directives,
//   icons: {
//     defaultSet: 'mdi',
//   },
// })
