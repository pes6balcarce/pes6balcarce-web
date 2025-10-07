// src/firebase/config.js

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// --- CONFIGURACIÓN DIRECTA EN EL CÓDIGO ---
// Este método es más simple y evita problemas con variables de entorno en Vercel.
const firebaseConfig = {
  apiKey: 'AIzaSyAXfKdc6dfdi0ZxV-aIMzi_cRD654asPU4',
  authDomain: 'pes6balcarce2026.firebaseapp.com',
  projectId: 'pes6balcarce2026',
  storageBucket: 'pes6balcarce2026.appspot.com', // Verifica si es .appspot.com o .firebasestorage.app en tu consola
  messagingSenderId: '896058552329',
  appId: '1:896058552329:web:35790a6652671130c108d8',
  measurementId: 'G-KQ25EKH280',
}
// ------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
const db = getFirestore(app)
const auth = getAuth(app)

// Exportamos todo para usarlo en la app
export { db, auth }
