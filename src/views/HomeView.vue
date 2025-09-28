<script setup>
import EncuestaActiva from '@/components/EncuestaActiva.vue' // <-- IMPORTAR
</script>

<template>
  <div class="home">
    <h1>¡Bienvenido a la Web de PES 6 Balcarce!</h1>
    <p>
      Este es el sitio oficial del parche. Revisa la sección de 
      <RouterLink to="/noticias">Noticias</RouterLink> 
      para ver las últimas actualizaciones.
    </p>

    <!-- AÑADIR EL COMPONENTE DE LA ENCUESTA -->
    <EncuestaActiva />

  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding-top: 50px;
}
.home h1 {
  margin-bottom: 1rem;
}
</style>