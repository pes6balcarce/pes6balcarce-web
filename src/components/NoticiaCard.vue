<template>
  <RouterLink :to="{ name: 'noticia-detalle', params: { id: noticia.id } }" class="noticia-card">
    <div class="card-imagen">
      <!-- Idealmente aquí iría una imagen de la noticia -->
      <img src="@/assets/images/logo.png" alt="Imagen de la noticia" />
    </div>
    <div class="card-contenido">
      <h3>{{ noticia.titulo }}</h3>
      <p>{{ noticia.resumen }}</p>
      <span class="ver-mas">Leer más &rarr;</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  noticia: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.noticia-card {
  display: block;
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
  overflow: hidden;
  border: 1px solid var(--color-borde);
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
  color: var(--color-texto-principal);
  text-decoration: none;
}

.noticia-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primario);
}

.card-imagen img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.card-contenido {
  padding: 1.5rem;
}

.card-contenido h3 {
  margin-bottom: 0.5rem;
  color: var(--color-texto-principal);
}

.card-contenido p {
  color: var(--color-texto-secundario);
  margin-bottom: 1rem;
}

.ver-mas {
  color: var(--color-primario);
  font-weight: bold;
}
</style>
