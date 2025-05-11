import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

// Utiliser le store et le router
app.use(store)
app.use(router)

app.mount('#app')
