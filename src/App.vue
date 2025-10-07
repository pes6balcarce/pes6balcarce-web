<!-- src/App.vue -->
<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue' // 1. Importamos el nuevo header
</script>

<template>
  <AppHeader />
  <!-- 2. Lo usamos aquí, fuera del RouterView -->

  <main class="main-content">
    <RouterView />
    <!-- 3. Aquí se cargarán todas tus páginas (Home, Noticias, etc.) -->
  </main>
</template>

<style scoped>
.main-content {
  /* Añadimos padding para que el contenido no pegue a los bordes */
  padding: 1rem;

  /* Para pantallas más grandes, podemos centrar el contenido */
  max-width: 1200px;
  margin: 0 auto;
}
</style>
