<!-- src/views/admin/AdminVersionesView.vue -->
<template>
  <div class="admin-versiones">
    <h1>Gestión de Versiones del Parche</h1>

    <form @submit.prevent="guardarVersion" class="form-card">
      <h2>Publicar Nueva Versión</h2>

      <div class="form-group">
        <label for="nombreVersion">Nombre de la Versión (ej: v1.0, v1.1 Hotfix)</label>
        <input type="text" v-model="nuevaVersion.nombre" id="nombreVersion" required />
      </div>

      <div class="form-group">
        <label for="enlaceDescarga">Enlace de Descarga (MediaFire, Google Drive, etc.)</label>
        <input
          type="url"
          v-model="nuevaVersion.enlace"
          id="enlaceDescarga"
          placeholder="https://..."
          required
        />
      </div>

      <div class="form-group">
        <label for="changelog">Notas de la Versión / Changelog (una novedad por línea)</label>
        <textarea
          v-model="nuevaVersion.changelog"
          id="changelog"
          rows="6"
          placeholder="Añadida la Sub-15.&#10;Corregidos los kits de Racing de Balcarce.&#10;Actualizadas las stats de los delanteros."
          required
        ></textarea>
      </div>

      <button type="submit">Publicar Versión</button>
    </form>

    <div class="lista-versiones">
      <h2>Versiones Publicadas</h2>
      <div v-if="cargando">Cargando...</div>
      <div v-else-if="versiones.length === 0">No hay versiones publicadas.</div>
      <ul v-else>
        <li v-for="version in versiones" :key="version.id">
          <div class="version-info">
            <h3>{{ version.nombre }}</h3>
            <small>{{ new Date(version.fechaPublicacion.seconds * 1000).toLocaleString() }}</small>
          </div>
          <button @click="eliminarVersion(version.id)" class="btn-eliminar">Eliminar</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

const nuevaVersion = ref({
  nombre: '',
  enlace: '',
  changelog: '',
})
const versiones = ref([])
const cargando = ref(true)

const fetchVersiones = async () => {
  cargando.value = true
  const q = query(collection(db, 'versiones'), orderBy('fechaPublicacion', 'desc'))
  const querySnapshot = await getDocs(q)
  versiones.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  cargando.value = false
}

onMounted(fetchVersiones)

const guardarVersion = async () => {
  if (!nuevaVersion.value.nombre || !nuevaVersion.value.enlace || !nuevaVersion.value.changelog) {
    alert('Por favor, completa todos los campos.')
    return
  }
  try {
    await addDoc(collection(db, 'versiones'), {
      nombre: nuevaVersion.value.nombre,
      enlace: nuevaVersion.value.enlace,
      // Guardamos el changelog como un array, dividiendo por saltos de línea
      changelog: nuevaVersion.value.changelog.split('\n'),
      fechaPublicacion: serverTimestamp(), // Firebase pone la fecha del servidor
    })

    nuevaVersion.value = { nombre: '', enlace: '', changelog: '' }
    await fetchVersiones()
    alert('¡Versión publicada con éxito!')
  } catch (error) {
    console.error('Error al publicar la versión:', error)
    alert('Ocurrió un error.')
  }
}

const eliminarVersion = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta versión?')) return
  try {
    await deleteDoc(doc(db, 'versiones', id))
    await fetchVersiones()
    alert('Versión eliminada.')
  } catch (error) {
    console.error('Error al eliminar:', error)
    alert('Ocurrió un error al eliminar.')
  }
}
</script>

<style scoped>
/* Estilos para el panel de admin, consistentes con los demás */
.admin-versiones {
  color: var(--color-texto-principal);
}
.form-card,
.lista-versiones {
  background-color: var(--color-superficie);
  padding: 2rem;
  border-radius: var(--radio-borde);
  margin-top: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input[type='text'],
input[type='url'],
textarea {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-fondo);
  border: 1px solid #444;
  border-radius: var(--radio-borde);
  color: var(--color-texto-principal);
}
button {
  background-color: var(--color-primario);
  color: #121212;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radio-borde);
  cursor: pointer;
  font-weight: bold;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #333;
}
li:last-child {
  border-bottom: none;
}
.version-info h3 {
  margin: 0;
}
.version-info small {
  color: var(--color-texto-secundario);
}
.btn-eliminar {
  background-color: #c0392b;
  color: white;
}
</style>
