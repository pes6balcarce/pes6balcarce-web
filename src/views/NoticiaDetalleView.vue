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
        <!-- Iteramos sobre los segmentos de texto que hemos creado -->
        <template v-for="(segmento, index) in segmentosDeContenido" :key="index">
          <!-- Renderizamos el segmento de texto -->
          <!-- Usamos v-html para que los saltos de línea se conviertan en párrafos -->
          <div v-html="formatearParrafos(segmento)"></div>

          <!-- Si este no es el último segmento, insertamos un banner -->
          <BannerPatrocinador v-if="index < segmentosDeContenido.length - 1" />
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

// ¡NUEVA LÓGICA MEJORADA!
const segmentosDeContenido = computed(() => {
  if (noticia.value && noticia.value.contenido) {
    // 1. Dividimos el contenido usando '...' como separador.
    return noticia.value.contenido.split('...')
  }
  return []
})

// Nueva función para convertir los saltos de línea de cada segmento en párrafos HTML
const formatearParrafos = (texto) => {
  if (!texto) return ''
  // 1. Quitamos espacios en blanco al principio y al final.
  // 2. Dividimos por dobles saltos de línea para crear un array de párrafos.
  // 3. Envolvemos cada elemento del array en etiquetas <p>.
  // 4. Unimos todo de nuevo en un solo string HTML.
  return texto
    .trim()
    .split(/\n\s*\n/) // Expresión regular que busca uno o más saltos de línea
    .map((parrafo) => `<p>${parrafo.replace(/\n/g, '<br>')}</p>`) // Reemplaza saltos simples con <br>
    .join('')
}
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

/* Estilos para los párrafos generados por v-html */
.noticia-cuerpo :deep(p) {
  margin-bottom: 1.5rem;
}
</style>
