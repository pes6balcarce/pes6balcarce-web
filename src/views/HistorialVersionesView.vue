<!-- src/views/HistorialVersionesView.vue -->
<template>
  <div class="historial-view">
    <header class="page-header">
      <h1>Historial de Versiones</h1>
      <p>Todas las publicaciones del parche, desde la más reciente a la más antigua.</p>
      <RouterLink to="/descargas" class="btn-volver">&larr; Volver a la última versión</RouterLink>
    </header>

    <div v-if="cargando" class="cargando-mensaje">Cargando historial...</div>
    <div v-else class="versiones-lista">
      <div class="version-card" v-for="version in versiones" :key="version.id">
        <div class="version-header">
          <h3>{{ version.nombre }}</h3>
          <small
            >Publicado el:
            {{ new Date(version.fechaPublicacion.seconds * 1000).toLocaleDateString() }}</small
          >
        </div>
        <div class="version-body">
          <h4>Novedades:</h4>
          <ul class="changelog">
            <li v-for="(item, index) in version.changelog" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="version-footer">
          <a
            :href="version.enlace"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-descarga btn-secundario"
          >
            Descargar esta versión
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const versiones = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    const q = query(collection(db, 'versiones'), orderBy('fechaPublicacion', 'desc'))
    const querySnapshot = await getDocs(q)
    versiones.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener el historial de versiones:', error)
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
/* Reutilizamos y adaptamos los estilos de la página de descargas */
.historial-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header h1 {
  color: var(--color-primario);
}
.page-header p {
  color: var(--color-texto-secundario);
  font-size: 1.1rem;
}
.btn-volver {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-primario);
  text-decoration: none;
}
.cargando-mensaje {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-texto-secundario);
}
.version-card {
  background-color: var(--color-superficie);
  border: 1px solid #2a2a2a;
  border-radius: var(--radio-borde);
  margin-bottom: 1.5rem;
}
.version-header {
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.version-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-texto-principal);
}
.version-header small {
  color: var(--color-texto-secundario);
}
.version-body {
  padding: 1.5rem;
}
.version-body h4 {
  margin-top: 0;
  color: var(--color-primario);
}
.changelog {
  list-style-type: '✓ ';
  padding-left: 1.5rem;
  color: var(--color-texto-principal);
}
.changelog li {
  margin-bottom: 0.5rem;
}
.version-footer {
  padding: 1rem 1.5rem;
  text-align: right;
  background-color: rgba(0, 0, 0, 0.2);
}
.btn-descarga {
  display: inline-block;
  background-color: var(--color-primario);
  color: #121212;
  padding: 0.75rem 2rem;
  border-radius: var(--radio-borde);
  font-weight: bold;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}
.btn-secundario {
  background-color: transparent;
  border: 2px solid var(--color-primario);
  color: var(--color-primario);
}
.btn-descarga:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}
</style>
