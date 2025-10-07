<!-- src/views/NoticiaDetalleView.vue -->
<template>
  <div class="noticia-detalle-view">
    <div v-if="noticia" class="noticia-contenido">
      <header class="noticia-header">
        <h1>{{ noticia.titulo }}</h1>
        <p class="fecha-publicacion">
          Publicado el {{ new Date(noticia.creadoEn.seconds * 1000).toLocaleDateString() }}
        </p>
      </header>

      <!-- CUERPO DE LA NOTICIA DINÁMICO CON BANNERS -->
      <div class="noticia-cuerpo">
        <!-- Iteramos sobre el array de párrafos que hemos creado -->
        <template v-for="(parrafo, index) in parrafosConBanners" :key="index">
          <!-- Renderizamos el párrafo de texto -->
          <p v-html="parrafo"></p>

          <!-- Después de cada párrafo (excepto el último), insertamos un banner -->
          <BannerPatrocinador v-if="index < parrafosConBanners.length - 1" />
        </template>
      </div>
    </div>

    <div v-else class="mensaje-carga">Cargando noticia...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
// Importamos el componente de banner que ya tenemos
import BannerPatrocinador from '@/components/BannerPatrocinador.vue'

const noticia = ref(null)
const route = useRoute()

onMounted(async () => {
  const noticiaId = route.params.id
  try {
    const docRef = doc(db, 'noticias', noticiaId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      noticia.value = docSnap.data()
    } else {
      console.error('No se encontró la noticia!')
    }
  } catch (error) {
    console.error('Error al obtener la noticia:', error)
  }
})

// ¡AQUÍ ESTÁ LA NUEVA LÓGICA!
// Usamos una propiedad computada para dividir el contenido en párrafos.
const parrafosConBanners = computed(() => {
  if (noticia.value && noticia.value.contenido) {
    // 1. Dividimos el texto por dobles saltos de línea (que representan párrafos).
    //    Usamos un filtro para eliminar párrafos vacíos si los hubiera.
    return noticia.value.contenido.split('\n\n').filter((p) => p.trim() !== '')
  }
  // Si no hay contenido, devolvemos un array vacío.
  return []
})
</script>

<style scoped>
.noticia-detalle-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.mensaje-carga {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-texto-secundario);
  padding: 4rem 0;
}

.noticia-header {
  text-align: center;
  border-bottom: 2px solid var(--color-primario);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.noticia-header h1 {
  margin-bottom: 1rem;
  color: var(--color-texto-principal);
}

.fecha-publicacion {
  color: var(--color-texto-secundario);
  font-style: italic;
}

.noticia-cuerpo {
  line-height: 1.8;
  font-size: 1.1rem;
  color: var(--color-texto-principal);
}

/* Estilos para los párrafos que renderizamos */
.noticia-cuerpo :deep(p) {
  margin: 0; /* Quitamos el margen por defecto del párrafo */
}
</style>
