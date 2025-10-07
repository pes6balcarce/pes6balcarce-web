<!-- src/views/NoticiasView.vue -->
<template>
  <div class="noticias-view">
    <header class="page-header">
      <h1>Noticias</h1>
      <p>Todas las novedades sobre el parche y la comunidad.</p>
    </header>

    <div v-if="cargando" class="mensaje-central">Cargando noticias...</div>
    <div v-else-if="noticias.length === 0" class="mensaje-central">No hay noticias publicadas.</div>

    <div v-else class="noticias-grid">
      <!-- Usamos un <template> para poder insertar el banner entre las noticias sin romper la estructura -->
      <template v-for="(noticia, index) in noticias" :key="noticia.id">
        <!-- 1. Renderizamos la tarjeta de la noticia -->
        <RouterLink :to="`/noticias/${noticia.id}`" class="noticia-card">
          <div class="card-content">
            <h2>{{ noticia.titulo }}</h2>
            <p>{{ noticia.contenido.substring(0, 100) }}...</p>
            <small>{{ new Date(noticia.creadoEn.seconds * 1000).toLocaleDateString() }}</small>
          </div>
        </RouterLink>

        <!-- 2. Después de cada 2 noticias, insertamos un banner -->
        <BannerPatrocinador v-if="(index + 1) % 2 === 0 && index < noticias.length - 1" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
// Importamos el componente del banner
import BannerPatrocinador from '@/components/BannerPatrocinador.vue'

const noticias = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    const q = query(collection(db, 'noticias'), orderBy('creadoEn', 'desc'))
    const querySnapshot = await getDocs(q)
    noticias.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener noticias:', error)
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
/* Estilos para que la vista de noticias se vea bien */
.noticias-view {
  max-width: 1200px;
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
.mensaje-central {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-texto-secundario);
}

.noticias-grid {
  display: grid;
  grid-template-columns: 1fr; /* Una columna por defecto */
  gap: 1.5rem;
}

.noticia-card {
  background-color: var(--color-superficie);
  border: 1px solid #2a2a2a;
  border-radius: var(--radio-borde);
  text-decoration: none;
  color: var(--color-texto-principal);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}
.noticia-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primario);
}
.card-content {
  padding: 1.5rem;
}
.card-content h2 {
  margin-top: 0;
  color: var(--color-primario);
}
.card-content p {
  color: var(--color-texto-secundario);
}
.card-content small {
  display: block;
  margin-top: 1rem;
  text-align: right;
  color: var(--color-texto-secundario);
}
</style>
