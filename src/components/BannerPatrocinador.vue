<template>
  <div class="banner-patrocinador-container">
    <a
      v-if="patrocinador"
      :href="patrocinador.enlace"
      target="_blank"
      rel="noopener noreferrer"
      class="banner-link"
    >
      <img :src="patrocinador.imagen" :alt="`Patrocinador: ${patrocinador.nombre}`" />
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// --- CAMBIO IMPORTANTE ---
// Ahora importamos desde el archivo específico para banners horizontales.
import { listaPatrocinadoresHorizontales } from '@/data/patrocinadoresHorizontal.js'

const patrocinador = ref(null)

onMounted(() => {
  // Y usamos la lista correcta.
  if (listaPatrocinadoresHorizontales && listaPatrocinadoresHorizontales.length > 0) {
    const randomIndex = Math.floor(Math.random() * listaPatrocinadoresHorizontales.length)
    patrocinador.value = listaPatrocinadoresHorizontales[randomIndex]
  }
})
</script>

<style scoped>
/* Estilos para el banner horizontal */
.banner-patrocinador-container {
  width: 100%;
  max-width: 1500px;
  margin: 2rem auto; /* Espaciado antes del footer */
  padding: 0 1.5rem;
}

.banner-link img {
  width: 100%;
  height: auto; /* Mantiene la proporción de la imagen 1500x214 */
  display: block;
  border-radius: var(--radio-borde);
}
</style>
