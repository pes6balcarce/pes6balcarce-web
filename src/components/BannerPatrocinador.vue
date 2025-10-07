<!-- src/components/BannerPatrocinador.vue -->
<template>
  <!-- El banner solo se renderiza si se ha seleccionado un patrocinador -->
  <div v-if="sponsorSeleccionado" class="banner-patrocinador-container">
    <a
      :href="sponsorSeleccionado.enlace"
      target="_blank"
      rel="noopener noreferrer"
      class="banner-link"
    >
      <img
        :src="sponsorSeleccionado.imagen"
        :alt="`Patrocinado por ${sponsorSeleccionado.nombre}`"
        class="banner-image"
      />
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Importamos la lista de patrocinadores desde nuestro archivo de datos
import { listaPatrocinadores } from '@/data/patrocinadores.js'

const sponsorSeleccionado = ref(null)

// onMounted se asegura de que este código se ejecute solo en el navegador
onMounted(() => {
  if (listaPatrocinadores && listaPatrocinadores.length > 0) {
    // Escogemos un índice aleatorio del array de patrocinadores
    const randomIndex = Math.floor(Math.random() * listaPatrocinadores.length)
    // Asignamos el patrocinador aleatorio a nuestra variable reactiva
    sponsorSeleccionado.value = listaPatrocinadores[randomIndex]
  }
})
</script>

<style scoped>
.banner-patrocinador-container {
  /* El banner ocupará todo el ancho disponible */
  width: 100%;
  margin: 1.5rem 0; /* Mantenemos el mismo espaciado que el gap de HomeView */
}

.banner-link {
  display: block; /* Para que ocupe todo el contenedor */
  border-radius: var(--radio-borde);
  overflow: hidden; /* Asegura que la imagen respete los bordes redondeados */
  border: 1px solid #2a2a2a;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.banner-link:hover {
  transform: scale(1.02); /* Efecto sutil de crecimiento al pasar el mouse */
  box-shadow: 0 0 15px rgba(232, 185, 67, 0.3); /* Sombra con tu color primario */
}

.banner-image {
  display: block; /* Elimina espacios extra debajo de la imagen */
  width: 100%; /* La imagen se estira para llenar el contenedor */
  height: auto;
  /* Para un look de banner, puedes forzar una altura y usar object-fit */
  /* Por ejemplo, para un banner de 100px de alto: */
  /* height: 100px; */
  /* object-fit: cover; */
}
</style>
