// src/firebase/config.js

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// ¡ESTE ES EL ARCHIVO IMPORTANTE AHORA!
// La conexión a Firebase se establece aquí con estas claves.
const firebaseConfig = {
  apiKey: 'AIzaSyAXfKdc6dfdi0ZxV-aIMzi_cRD654asPU4',
  authDomain: 'pes6balcarce2026.firebaseapp.com',
  projectId: 'pes6balcarce2026',
  storageBucket: 'pes6balcarce2026.appspot.com',
  messagingSenderId: '896058552329',
  appId: '1:896058552329:web:35790a6652671130c108d8',
  measurementId: 'G-KQ25EKH280',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
