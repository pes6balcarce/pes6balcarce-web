<!-- src/views/LinksDescargaView.vue -->
<template>
  <div class="descargas-adicionales-view page-container">
    <header class="page-header">
      <h1>Descargas Adicionales</h1>
      <p>Aquí encontrarás herramientas, mods y otros archivos compartidos por la comunidad.</p>
    </header>

    <div v-if="cargando" class="mensaje-central">Cargando descargas...</div>
    <div v-else-if="descargas.length === 0" class="mensaje-central">
      Aún no se han publicado descargas adicionales.
    </div>

    <div v-else class="lista-descargas">
      <div v-for="descarga in descargas" :key="descarga.id" class="descarga-card">
        <div class="card-contenido">
          <h3>{{ descarga.titulo }}</h3>
          <small class="fecha-publicacion">
            Publicado el:
            {{ new Date(descarga.fechaPublicacion.seconds * 1000).toLocaleDateString() }}
          </small>
          <p class="descripcion">{{ descarga.descripcion }}</p>
        </div>
        <div class="card-accion">
          <a :href="descarga.enlace" target="_blank" rel="noopener noreferrer" class="btn-descarga">
            Ir a la Descarga
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

const descargas = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    // Apuntamos a la nueva colección 'descargasLinks'
    const q = query(collection(db, 'descargasLinks'), orderBy('fechaPublicacion', 'desc'))
    const querySnapshot = await getDocs(q)
    descargas.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al obtener las descargas:', error)
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.descargas-adicionales-view {
  max-width: 900px;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: var(--color-primario);
  margin-bottom: 0.5rem;
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

.lista-descargas {
  display: grid;
  gap: 1.5rem;
}

.descarga-card {
  background-color: var(--color-superficie);
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-borde);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.3s ease;
}

.descarga-card:hover {
  border-color: var(--color-primario);
}

.card-contenido h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: var(--color-texto-principal);
}

.fecha-publicacion {
  display: block;
  color: var(--color-texto-secundario);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.descripcion {
  color: var(--color-texto-principal);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.card-accion {
  text-align: right;
}

.btn-descarga {
  display: inline-block;
  background-color: var(--color-primario);
  color: #121212;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radio-borde);
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.btn-descarga:hover {
  transform: scale(1.05);
}

/* --- ESTILOS PARA MÓVILES --- */
@media (max-width: 768px) {
  .descarga-card {
    padding: 1rem;
  }
  .card-accion {
    text-align: center;
  }
  .btn-descarga {
    width: 100%;
  }
}
</style>
