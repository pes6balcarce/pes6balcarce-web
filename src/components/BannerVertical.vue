<template>
  <aside class="banner-vertical-container">
    <a
      v-if="patrocinador"
      :href="patrocinador.enlace"
      target="_blank"
      rel="noopener noreferrer"
      class="banner-vertical-link"
      :title="`Patrocinador: ${patrocinador.nombre}`"
    >
      <img :src="patrocinador.imagen" :alt="`Publicidad de ${patrocinador.nombre}`" />
    </a>
    <div v-else class="placeholder">Espacio Publicitario</div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// --- CAMBIO IMPORTANTE ---
// Ahora importamos desde el archivo específico para banners verticales.
import { listaPatrocinadoresVerticales } from '@/data/patrocinadoresVertical.js'

const patrocinador = ref(null)

onMounted(() => {
  // Y usamos la lista correcta.
  if (listaPatrocinadoresVerticales && listaPatrocinadoresVerticales.length > 0) {
    const randomIndex = Math.floor(Math.random() * listaPatrocinadoresVerticales.length)
    patrocinador.value = listaPatrocinadoresVerticales[randomIndex]
  }
})
</script>

<style scoped>
/* Los estilos de este componente no necesitan cambiar */
.banner-vertical-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 214px;
  margin: 1rem auto;
}

.banner-vertical-link img {
  display: block;
  width: 214px;
  height: auto;
  max-height: 1500px;
  object-fit: contain;
  border-radius: var(--radio-borde, 8px);
  background-color: var(--color-superficie, #1c1c1c);
  transition: transform 0.3s ease;
}

.banner-vertical-link img:hover {
  transform: scale(1.02);
}

.placeholder {
  width: 214px;
  height: 600px;
  background-color: var(--color-superficie, #1c1c1c);
  border: 2px dashed var(--color-borde, #2a2a2a);
  border-radius: var(--radio-borde, 8px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-texto-secundario, #a0a0a0);
}
</style>
