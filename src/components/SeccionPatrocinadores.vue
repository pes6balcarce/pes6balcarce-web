<!-- src/components/SeccionPatrocinadores.vue -->
<template>
  <section class="patrocinadores-container" v-if="patrocinadores.length > 0">
    <h2>Nuestros Patrocinadores</h2>
    <div class="patrocinadores-grid">
      <a
        v-for="pat in patrocinadores"
        :key="pat.id"
        :href="pat.enlace"
        target="_blank"
        rel="noopener noreferrer"
        class="patrocinador-item"
        :title="pat.nombre"
      >
        <img :src="pat.imagen" :alt="`Logo de ${pat.nombre}`" />
      </a>
    </div>
  </section>
</template>

<script setup>
// Importamos directamente la lista desde nuestro archivo de datos local
import { listaPatrocinadores } from '@/data/patrocinadores.js'

// No necesitamos lógica compleja, solo asignamos la lista a una variable
const patrocinadores = listaPatrocinadores
</script>

<style scoped>
.patrocinadores-container {
  padding: 2rem 1rem;
  background-color: var(--color-superficie);
  margin-top: 2rem;
  border-radius: var(--radio-borde);
  border: 1px solid #2a2a2a;
}

h2 {
  text-align: center;
  color: var(--color-primario);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.patrocinadores-grid {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se muevan a la siguiente línea */
  justify-content: center;
  align-items: center;
  gap: 2rem; /* Espacio entre logos */
}

.patrocinador-item {
  display: block;
  /* En PC, limitamos el tamaño para que quepan varios en una fila */
  flex-basis: 18%; /* Aproximadamente 5 por fila */
  min-width: 120px;
  max-width: 200px;
  transition: transform 0.2s ease-in-out;
}

.patrocinador-item:hover {
  transform: scale(1.08); /* Efecto de zoom sutil al pasar el mouse */
}

.patrocinador-item img {
  width: 100%;
  height: auto; /* Mantiene la proporción de la imagen */
  filter: grayscale(100%); /* Efecto elegante en blanco y negro */
  opacity: 0.8;
  transition: all 0.3s ease;
}

.patrocinador-item:hover img {
  filter: grayscale(0%); /* Muestra el color al pasar el mouse */
  opacity: 1;
}

/* --- REGLAS PARA REDIMENSIONAR (Responsive Design) --- */

/* Para Tablets */
@media (max-width: 1024px) {
  .patrocinador-item {
    flex-basis: 25%; /* Aproximadamente 3-4 por fila */
  }
}

/* Para Celulares */
@media (max-width: 768px) {
  .patrocinadores-grid {
    gap: 1.5rem;
  }
  .patrocinador-item {
    flex-basis: 40%; /* Dos por fila en móviles */
  }
}
</style>
