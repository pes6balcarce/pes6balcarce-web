<!-- src/views/DescargasView.vue -->
<template>
  <div class="descargas-view">
    <div v-if="cargando" class="cargando-mensaje">Buscando la última versión...</div>
    <div v-else-if="!versionReciente" class="sin-versiones-mensaje">
      Aún no se ha publicado ninguna versión. ¡Vuelve pronto!
    </div>

    <!-- Contenido principal que se muestra cuando ya cargó la versión -->
    <template v-else>
      <header class="page-header">
        <h1>Descarga la Versión Más Reciente</h1>
        <p>¡Aquí tienes la última actualización del parche lista para instalar!</p>
      </header>

      <div class="version-card version-mas-reciente">
        <div class="version-header">
          <h2>{{ versionReciente.nombre }} <span class="badge">Última Versión</span></h2>
          <small
            >Publicado el:
            {{
              new Date(versionReciente.fechaPublicacion.seconds * 1000).toLocaleDateString()
            }}</small
          >
        </div>
        <div class="version-body">
          <h3>Novedades en esta versión:</h3>
          <ul class="changelog">
            <li v-for="(item, index) in versionReciente.changelog" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="version-footer">
          <a
            :href="versionReciente.enlace"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-descarga"
          >
            Descargar Ahora
          </a>
        </div>
      </div>

      <div class="historial-link-container">
        <RouterLink to="/descargas/historial" class="btn-historial">
          Ver Historial de Versiones Anteriores
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

const versionReciente = ref(null)
const cargando = ref(true)

onMounted(async () => {
  try {
    const q = query(collection(db, 'versiones'), orderBy('fechaPublicacion', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      versionReciente.value = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
    }
  } catch (error) {
    console.error('Error al obtener la última versión:', error)
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
/* Estilos similares a los anteriores, pero enfocados en una sola versión */
.descargas-view {
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
.cargando-mensaje,
.sin-versiones-mensaje {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-texto-secundario);
}
.version-card {
  background-color: var(--color-superficie);
  border: 2px solid var(--color-primario);
  border-radius: var(--radio-borde);
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(232, 185, 67, 0.2);
}
.version-header {
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.version-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-texto-principal);
}
.version-header small {
  color: var(--color-texto-secundario);
}
.badge {
  background-color: var(--color-primario);
  color: #121212;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-weight: bold;
}
.version-body {
  padding: 1.5rem;
}
.version-body h3 {
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
.btn-descarga:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}
.historial-link-container {
  text-align: center;
  margin-top: 2rem;
}
.btn-historial {
  color: var(--color-texto-secundario);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-texto-secundario);
  padding-bottom: 4px;
  transition: color 0.2s;
}
.btn-historial:hover {
  color: var(--color-primario);
}
</style>
