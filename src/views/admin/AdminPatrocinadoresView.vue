<!-- src/views/admin/AdminPatrocinadoresView.vue -->
<template>
  <div class="admin-patrocinadores">
    <h1>Gestión de Patrocinadores</h1>

    <div class="form-card">
      <h2>Añadir Nuevo Patrocinador</h2>
      <p>
        Esta funcionalidad se ha movido a un sistema manual para evitar la configuración de
        facturación de Firebase. Para añadir un nuevo patrocinador, sigue las instrucciones en la
        documentación del proyecto.
      </p>
      <!-- Puedes dejar este mensaje o eliminarlo y poner el formulario si decides configurar Firebase más adelante -->
    </div>

    <!-- Lista de Patrocinadores (versión manual) -->
    <div class="lista-patrocinadores">
      <h2>Patrocinadores Actuales (desde el código)</h2>
      <div v-if="patrocinadoresLocales.length === 0">
        No hay patrocinadores configurados en el archivo local.
      </div>
      <ul>
        <li v-for="pat in patrocinadoresLocales" :key="pat.id">
          <img :src="pat.imagen" :alt="pat.nombre" class="sponsor-logo" />
          <span>{{ pat.nombre }}</span>
          <a :href="pat.enlace" target="_blank">Visitar Sitio</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { listaPatrocinadores } from '@/data/patrocinadores.js'

// Usamos la lista de patrocinadores importada desde el archivo local
const patrocinadoresLocales = listaPatrocinadores
</script>

<style scoped>
.admin-patrocinadores {
  color: var(--color-texto-principal);
}

.form-card {
  background-color: var(--color-superficie);
  padding: 2rem;
  border-radius: var(--radio-borde);
  margin-top: 1.5rem;
  border: 1px dashed var(--color-primario);
}
.form-card p {
  color: var(--color-texto-secundario);
  line-height: 1.6;
}

.lista-patrocinadores {
  margin-top: 3rem;
  background-color: var(--color-superficie);
  padding: 2rem;
  border-radius: var(--radio-borde);
}

.lista-patrocinadores ul {
  list-style: none;
  padding: 0;
}

.lista-patrocinadores li {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #333;
}
.lista-patrocinadores li:last-child {
  border-bottom: none;
}

.sponsor-logo {
  height: 40px;
  max-width: 160px;
  object-fit: contain;
  margin-right: 1.5rem;
  background-color: #fff; /* Fondo blanco para que los logos se vean bien */
  padding: 5px;
  border-radius: 4px;
}

.lista-patrocinadores span {
  flex-grow: 1;
  font-weight: bold;
}
</style>
