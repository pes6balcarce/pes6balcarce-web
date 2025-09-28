console.log("--- DEBUGGING VERCEL ENV VARIABLES ---");
console.log("Project ID recibido:", import.meta.env.VITE_PROJECT_ID);
console.log("API Key recibida:", import.meta.env.VITE_API_KEY);

// Importa tu configuración de Firebase aquí. Esto asegura que se inicialice.
import '@/firebase/config';

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')