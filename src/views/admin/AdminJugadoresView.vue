<!-- src/views/admin/AdminJugadoresView.vue -->
<template>
  <div class="admin-jugadores">
    <h1>Gestión de Jugadores</h1>

    <!-- Formulario para crear/editar jugador -->
    <form @submit.prevent="guardarJugador" class="form-card">
      <h2>{{ editando ? 'Editar Jugador' : 'Añadir Nuevo Jugador' }}</h2>

      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nuevoJugador.nombre" required />
      </div>

      <div class="form-group">
        <label for="posicion">Posición</label>
        <input type="text" v-model="nuevoJugador.posicion" required />
      </div>

      <div class="form-group">
        <label for="numero">Número de Camiseta</label>
        <input type="number" v-model.number="nuevoJugador.numero" required />
      </div>

      <div class="form-actions">
        <button type="submit">{{ editando ? 'Actualizar Jugador' : 'Guardar Jugador' }}</button>
        <button type="button" v-if="editando" @click="cancelarEdicion">Cancelar</button>
      </div>
    </form>

    <!-- Lista de jugadores existentes -->
    <div class="lista-jugadores">
      <h2>Plantel Actual</h2>

      <!-- AQUÍ ESTÁ LA CORRECCIÓN -->
      <div v-if="cargando">Cargando jugadores...</div>

      <div v-else-if="jugadores.length === 0">No hay jugadores añadidos.</div>

      <!-- El `v-else` principal está en este div -->
      <div v-else class="table-container">
        <!-- La tabla ya NO necesita un v-else -->
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="jugador in jugadores" :key="jugador.id">
              <td>{{ jugador.numero }}</td>
              <td>{{ jugador.nombre }}</td>
              <td>{{ jugador.posicion }}</td>
              <td class="acciones">
                <button @click="editarJugador(jugador)">Editar</button>
                <button @click="eliminarJugador(jugador.id)" class="btn-eliminar">Eliminar</button>
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

const jugadores = ref([])
const cargando = ref(true)
const editando = ref(false)
const jugadorId = ref(null)

const nuevoJugador = ref({
  nombre: '',
  posicion: '',
  numero: null,
})

// Obtener jugadores de Firestore
const fetchJugadores = async () => {
  cargando.value = true
  const q = query(collection(db, 'jugadores'), orderBy('numero', 'asc'))
  const querySnapshot = await getDocs(q)
  jugadores.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  cargando.value = false
}

onMounted(fetchJugadores)

// Guardar o actualizar jugador
const guardarJugador = async () => {
  if (editando.value) {
    const docRef = doc(db, 'jugadores', jugadorId.value)
    await updateDoc(docRef, nuevoJugador.value)
  } else {
    await addDoc(collection(db, 'jugadores'), nuevoJugador.value)
  }
  resetForm()
  await fetchJugadores()
}

const editarJugador = (jugador) => {
  editando.value = true
  jugadorId.value = jugador.id
  nuevoJugador.value = { ...jugador }
}

const eliminarJugador = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
    await deleteDoc(doc(db, 'jugadores', id))
    await fetchJugadores()
  }
}

const resetForm = () => {
  editando.value = false
  jugadorId.value = null
  nuevoJugador.value = { nombre: '', posicion: '', numero: null }
}

const cancelarEdicion = () => {
  resetForm()
}
</script>

<style scoped>
/* Copiamos los estilos del otro panel para mantener la consistencia */
.admin-jugadores {
  color: var(--color-texto-principal);
}

.form-card,
.lista-jugadores {
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
input[type='number'] {
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
  overflow-x: auto;
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
