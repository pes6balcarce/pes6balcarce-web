<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

const usuario = ref(null)
const medallas = ref([])
const cargando = ref(true)

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    // 1. Obtenemos la información básica del perfil de Auth
    usuario.value = {
      displayName: user.displayName,
      email: user.email
    }

    // 2. Obtenemos los datos extra (medallas) desde nuestra colección 'users'
    const userDocRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userDocRef)
    if (docSnap.exists()) {
      medallas.value = docSnap.data().medals
    }
  }
  cargando.value = false
})
</script>

<template>
  <div>
    <h1>Mi Perfil</h1>
    <div v-if="cargando">Cargando perfil...</div>
    <div v-else-if="usuario" class="perfil-container">
      <p><strong>Nombre de Usuario:</strong> {{ usuario.displayName }}</p>
      <p><strong>Email:</strong> {{ usuario.email }}</p>

      <section class="medallas-section">
        <h2>Mis Medallas</h2>
        <ul v-if="medallas.length > 0">
          <li v-for="(medalla, index) in medallas" :key="index">🏆 {{ medalla }}</li>
        </ul>
        <p v-else>Aún no has ganado ninguna medalla. ¡Participa en la comunidad para conseguirlas!</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.perfil-container {
  background-color: var(--color-superficie);
  padding: 2rem;
  border-radius: var(--radio-borde);
}
.medallas-section {
  margin-top: 2rem;
}
.medallas-section h2 {
  color: var(--color-primario);
  margin-bottom: 1rem;
}
.medallas-section ul {
  list-style: none;
}
.medallas-section li {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
</style>