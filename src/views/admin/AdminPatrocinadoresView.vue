<template>
  <div class="admin-patrocinadores-view">
    <header class="view-header">
      <h1>Gestionar Patrocinadores</h1>
      <p>Aquí puedes ver los banners activos para ambos formatos.</p>
    </header>

    <!-- Sección para Banners Horizontales -->
    <section class="seccion-patrocinadores">
      <h2>Banners Horizontales (1500x214 px)</h2>
      <div v-if="listaPatrocinadoresHorizontales.length > 0" class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patrocinador in listaPatrocinadoresHorizontales" :key="patrocinador.id">
              <td>{{ patrocinador.id }}</td>
              <td>{{ patrocinador.nombre }}</td>
              <td>
                <img
                  :src="patrocinador.imagen"
                  :alt="patrocinador.nombre"
                  class="preview-img horizontal"
                />
              </td>
              <td>
                <a :href="patrocinador.enlace" target="_blank" rel="noopener noreferrer">Visitar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No hay banners horizontales registrados.</p>
      </div>
    </section>

    <!-- Sección para Banners Verticales -->
    <section class="seccion-patrocinadores">
      <h2>Banners Verticales (214x1500 px)</h2>
      <div v-if="listaPatrocinadoresVerticales.length > 0" class="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Imagen</th>
              <th>Enlace</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patrocinador in listaPatrocinadoresVerticales" :key="patrocinador.id">
              <td>{{ patrocinador.id }}</td>
              <td>{{ patrocinador.nombre }}</td>
              <td>
                <img
                  :src="patrocinador.imagen"
                  :alt="patrocinador.nombre"
                  class="preview-img vertical"
                />
              </td>
              <td>
                <a :href="patrocinador.enlace" target="_blank" rel="noopener noreferrer">Visitar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No hay banners verticales registrados.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
// --- CAMBIO 1: Se importan las dos listas nuevas ---
// Eliminamos la importación antigua y traemos las dos listas separadas.
import { listaPatrocinadoresHorizontales } from '@/data/patrocinadoresHorizontal.js'
import { listaPatrocinadoresVerticales } from '@/data/patrocinadoresVertical.js'

// No necesitamos más lógica aquí por ahora, ya que los datos son estáticos.
// En el futuro, aquí irían las funciones para añadir, editar o eliminar patrocinadores.
</script>

<style scoped>
.admin-patrocinadores-view {
  padding: 2rem;
}

.view-header {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--color-borde);
  padding-bottom: 1.5rem;
}

.view-header h1 {
  font-size: 2.2rem;
  color: var(--color-primario);
}

.view-header p {
  color: var(--color-texto-secundario);
  font-size: 1.1rem;
}

.seccion-patrocinadores {
  margin-bottom: 3rem;
}

.seccion-patrocinadores h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-texto-principal);
}

.tabla-container {
  overflow-x: auto; /* Para que la tabla sea responsive en pantallas pequeñas */
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-superficie);
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-borde);
}

th {
  background-color: var(--color-fondo);
  color: var(--color-texto-secundario);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
}

tr:last-child td {
  border-bottom: none;
}

.preview-img {
  display: block;
  object-fit: cover;
  border-radius: 4px;
}

.preview-img.horizontal {
  width: 150px;
  height: auto;
}

.preview-img.vertical {
  width: 50px;
  height: auto;
}

a {
  color: var(--color-primario);
  font-weight: bold;
}

p {
  background-color: var(--color-superficie);
  padding: 1rem;
  border-radius: var(--radio-borde);
  border: 1px solid var(--color-borde);
}
</style>
