import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Theme from '@primeuix/themes/material'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router'
import { PiniaUndo } from 'pinia-undo'

const app = createApp(App)

const pinia = createPinia()
pinia.use(PiniaUndo)
app.use(pinia)
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Theme,
  },
})
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.mount('#app')
