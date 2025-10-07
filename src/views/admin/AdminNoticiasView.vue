<!-- src/views/admin/AdminNoticiasView.vue -->
<template>
  <div class="admin-noticias">
    <h1>Gestión de Noticias</h1>

    <!-- Formulario para crear/editar noticias -->
    <form @submit.prevent="guardarNoticia" class="form-card">
      <h2>{{ editando ? 'Editar Noticia' : 'Crear Nueva Noticia' }}</h2>

      <div class="form-group">
        <label for="titulo">Título</label>
        <input type="text" v-model="nuevaNoticia.titulo" required />
      </div>

      <div class="form-group">
        <label for="contenido">Contenido</label>
        <textarea v-model="nuevaNoticia.contenido" rows="5" required></textarea>
      </div>

      <div class="form-actions">
        <button type="submit">{{ editando ? 'Actualizar Noticia' : 'Guardar Noticia' }}</button>
        <button type="button" v-if="editando" @click="cancelarEdicion">Cancelar Edición</button>
      </div>
    </form>

    <!-- Lista de noticias existentes -->
    <div class="lista-noticias">
      <h2>Noticias Actuales</h2>

      <!-- AQUÍ ESTÁ LA CORRECCIÓN -->
      <div v-if="cargando">Cargando noticias...</div>

      <div v-else-if="noticias.length === 0">No hay noticias para mostrar.</div>

      <!-- El `v-else` principal está en este div -->
      <div v-else class="table-container">
        <!-- La tabla ya NO necesita un v-else -->
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="noticia in noticias" :key="noticia.id">
              <td>{{ noticia.titulo }}</td>
              <td>{{ new Date(noticia.creadoEn.seconds * 1000).toLocaleDateString() }}</td>
              <td class="acciones">
                <button @click="editarNoticia(noticia)">Editar</button>
                <button @click="eliminarNoticia(noticia.id)" class="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- FIN DE LA CORRECCIÓN -->
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
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore'

const noticias = ref([])
const cargando = ref(true)
const editando = ref(false)
const noticiaId = ref(null)

const nuevaNoticia = ref({
  titulo: '',
  contenido: '',
})

// Obtener noticias de Firestore
const fetchNoticias = async () => {
  cargando.value = true
  const q = query(collection(db, 'noticias'), orderBy('creadoEn', 'desc'))
  const querySnapshot = await getDocs(q)
  noticias.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  cargando.value = false
}

onMounted(fetchNoticias)

// Guardar o actualizar noticia
const guardarNoticia = async () => {
  if (editando.value) {
    // Actualizar
    const docRef = doc(db, 'noticias', noticiaId.value)
    await updateDoc(docRef, {
      titulo: nuevaNoticia.value.titulo,
      contenido: nuevaNoticia.value.contenido,
    })
  } else {
    // Crear
    await addDoc(collection(db, 'noticias'), {
      ...nuevaNoticia.value,
      creadoEn: new Date(),
    })
  }
  resetForm()
  await fetchNoticias()
}

const editarNoticia = (noticia) => {
  editando.value = true
  noticiaId.value = noticia.id
  nuevaNoticia.value.titulo = noticia.titulo
  nuevaNoticia.value.contenido = noticia.contenido
}

const eliminarNoticia = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
    await deleteDoc(doc(db, 'noticias', id))
    await fetchNoticias()
  }
}

const resetForm = () => {
  editando.value = false
  noticiaId.value = null
  nuevaNoticia.value = { titulo: '', contenido: '' }
}

const cancelarEdicion = () => {
  resetForm()
}
</script>

<style scoped>
/* Estilos para que se vea bien, puedes personalizarlos */
.admin-noticias {
  color: var(--color-texto-principal);
}

.form-card,
.lista-noticias {
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
textarea {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-fondo);
  border: 1px solid #444;
  border-radius: var(--radio-borde);
  color: var(--color-texto-principal);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
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

.table-container {
  overflow-x: auto; /* Para que la tabla sea responsive en móviles */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  border-bottom: 1px solid #444;
  text-align: left;
}

th {
  color: var(--color-primario);
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-eliminar {
  background-color: #c0392b;
  color: white;
}
</style>
