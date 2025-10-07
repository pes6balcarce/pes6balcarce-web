<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="logo-link">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
        <h1 class="app-title">PES 6 Balcarce</h1>
      </RouterLink>
    </div>
    <nav class="main-nav">
      <!-- Aquí está el nuevo enlace dinámico -->
      <RouterLink to="/descargas" class="nav-link download-link">
        Descargar Parche
        <span v-if="ultimaVersion" class="version-badge">{{ ultimaVersion }}</span>
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

const ultimaVersion = ref('')

onMounted(async () => {
  try {
    // Creamos una consulta que ordena por fecha y solo pide el primer resultado (el más nuevo)
    const q = query(collection(db, 'versiones'), orderBy('fechaPublicacion', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Si hay resultados, tomamos el nombre de la versión del primer documento
      ultimaVersion.value = querySnapshot.docs[0].data().nombre
    }
  } catch (error) {
    console.error('Error al obtener la última versión para el header:', error)
  }
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--color-superficie);
  color: var(--color-texto-principal);
  display: flex;
  align-items: center;
  justify-content: space-between; /* Alinea logo a la izquierda y nav a la derecha */
  padding: 0 1.5rem;
  border-bottom: 1px solid #333;
  z-index: 1000;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo {
  height: 35px;
  width: auto;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-primario);
}

.main-nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: var(--color-texto-principal);
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: var(--radio-borde);
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.download-link {
  background-color: var(--color-primario);
  color: #121212;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.version-badge {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>
