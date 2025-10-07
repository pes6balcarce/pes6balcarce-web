<!-- src/App.vue -->
<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import SubHeader from '@/components/SubHeader.vue'
import AppFooter from '@/components/AppFooter.vue' // 1. Importamos el nuevo footer
</script>

<template>
  <div class="app-wrapper">
    <AppHeader />
    <SubHeader />

    <main class="main-content">
      <RouterView />
    </main>

    <AppFooter />
    <!-- 2. Lo colocamos al final del layout -->
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1; /* Esto es clave: hace que el contenido principal ocupe el espacio disponible */
  /* El padding ya no lo necesitamos aquí, lo manejaremos con la clase .page-container */
}
</style>
