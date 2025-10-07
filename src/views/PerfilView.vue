<!-- src/views/PerfilView.vue -->
<template>
  <div class="perfil-view">
    <div v-if="user" class="profile-card">
      <header class="card-header">
        <div class="avatar">
          <!-- Mostramos la primera letra del email como avatar por defecto -->
          <span>{{ user.email.charAt(0).toUpperCase() }}</span>
        </div>
        <h1>Mi Perfil</h1>
      </header>

      <div class="card-body">
        <div class="info-item">
          <span class="label">Email de la Cuenta</span>
          <span class="value">{{ user.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">Miembro Desde</span>
          <!-- Mostramos la fecha de creación de la cuenta -->
          <span class="value">{{ new Date(user.metadata.creationTime).toLocaleDateString() }}</span>
        </div>
        <!-- Aquí podrías añadir más información del perfil en el futuro -->
      </div>

      <footer class="card-footer">
        <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
      </footer>
    </div>

    <div v-else class="loading-message">Cargando perfil...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const user = ref(null)
const router = useRouter()
let unsubscribeAuth

onMounted(() => {
  // Escuchamos cambios para asegurarnos de que el usuario está cargado
  unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }
})

// --- LÓGICA PARA CERRAR SESIÓN ---
const handleLogout = async () => {
  try {
    await signOut(auth)
    // Redirigimos al usuario a la página de inicio después de cerrar sesión
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    alert('Hubo un error al intentar cerrar sesión.')
  }
}
</script>

<style scoped>
.perfil-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
}

.profile-card {
  width: 100%;
  max-width: 600px;
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
  border: 1px solid #2a2a2a;
  overflow: hidden;
  box-shadow: var(--sombra-suave);
}

.card-header {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #2a2a2a;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-primario);
  color: #121212;
  font-size: 3rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.5rem auto;
  border: 4px solid var(--color-superficie);
}

.card-header h1 {
  margin: 0;
  color: var(--color-texto-principal);
}

.card-body {
  padding: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #2a2a2a;
}
.info-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--color-texto-secundario);
  font-weight: bold;
}

.value {
  color: var(--color-texto-principal);
}

.card-footer {
  padding: 1.5rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.btn-logout {
  background-color: #c0392b;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: var(--radio-borde);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-logout:hover {
  background-color: #e74c3c;
}

.loading-message {
  color: var(--color-texto-secundario);
  font-size: 1.5rem;
}
</style>
