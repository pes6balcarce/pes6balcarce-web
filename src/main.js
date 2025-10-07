// src/main.js

// 1. Eliminamos los console.log que leían las variables de entorno.
// Ya no son necesarios porque la configuración está directamente en config.js.

// 2. Importa tu configuración de Firebase. Esto asegura que se inicialice.
import '@/firebase/config'

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
