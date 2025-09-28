// Importa tu configuración de Firebase aquí. Esto asegura que se inicialice.
import '@/firebase/config';

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')