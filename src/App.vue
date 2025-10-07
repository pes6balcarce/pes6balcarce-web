<!-- src/App.vue -->
<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import SubHeader from '@/components/SubHeader.vue' // 1. Importamos el nuevo subheader
</script>

<template>
  <AppHeader />
  <SubHeader />
  <!-- 2. Lo colocamos justo debajo del header principal -->

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.main-content {
  padding: 1.5rem 1rem; /* Añadimos un poco más de padding vertical */

  max-width: 1200px;
  margin: 0 auto;
}
</style>
