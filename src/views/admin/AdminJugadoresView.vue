<!-- src/views/admin/AdminJugadoresView.vue -->
<template>
  <div class="admin-jugadores">
    <h1>Gestión de Jugadores</h1>

    <!-- CAMBIO: Hemos añadido todos los campos a la estructura definitiva del formulario -->
    <form @submit.prevent="guardarJugador" class="form-card">
      <h2>{{ editando ? 'Editar Jugador' : 'Añadir Nuevo Jugador' }}</h2>

      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="nuevoJugador.nombre" required />
      </div>

      <div class="form-group">
        <label for="apellido">Apellido</label>
        <input type="text" v-model="nuevoJugador.apellido" required />
      </div>

      <div class="form-group">
        <label for="posicion">Posición</label>
        <input type="text" v-model="nuevoJugador.posicion" required />
      </div>

      <div class="form-group">
        <label for="equipo">Equipo</label>
        <input type="text" v-model="nuevoJugador.equipo" required />
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

    <!-- La lista de jugadores no cambia -->
    <div class="lista-jugadores">
      <h2>Plantel Actual</h2>
      <div v-if="cargando">Cargando jugadores...</div>
      <div v-else-if="jugadores.length === 0">No hay jugadores añadidos.</div>
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Nombre Completo</th>
              <th>Posición</th>
              <th>Equipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="jugador in jugadores" :key="jugador.id">
              <td>{{ jugador.numero }}</td>
              <td>{{ jugador.nombre }} {{ jugador.apellido }}</td>
              <td>{{ jugador.posicion }}</td>
              <td>{{ jugador.equipo }}</td>
              <td class="acciones">
                <button @click="editarJugador(jugador)">Editar</button>
                <button @click="eliminarJugador(jugador.id)" class="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

// --- CAMBIO CLAVE: DEFINIMOS LA ESTRUCTURA POR DEFECTO ---
const crearJugadorPorDefecto = () => ({
  nombre: '',
  apellido: '',
  posicion: '',
  equipo: '',
  numero: null,
  vecesSeleccionado: 0, // Lo inicializamos siempre en 0
})

const jugadores = ref([])
const cargando = ref(true)
const editando = ref(false)
const jugadorId = ref(null)
// Inicializamos el formulario con la estructura limpia
const nuevoJugador = ref(crearJugadorPorDefecto())

const fetchJugadores = async () => {
  cargando.value = true
  const q = query(collection(db, 'jugadores'), orderBy('numero', 'asc'))
  const querySnapshot = await getDocs(q)
  jugadores.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  cargando.value = false
}

onMounted(fetchJugadores)

const guardarJugador = async () => {
  // Creamos un objeto limpio para enviar, asegurando que tenga la estructura correcta
  const jugadorParaGuardar = {
    nombre: nuevoJugador.value.nombre,
    apellido: nuevoJugador.value.apellido,
    posicion: nuevoJugador.value.posicion,
    equipo: nuevoJugador.value.equipo,
    numero: nuevoJugador.value.numero,
    // Mantenemos el valor de vecesSeleccionado si estamos editando, o lo ponemos en 0 si es nuevo
    vecesSeleccionado: nuevoJugador.value.vecesSeleccionado || 0,
  }

  if (editando.value) {
    const docRef = doc(db, 'jugadores', jugadorId.value)
    await updateDoc(docRef, jugadorParaGuardar)
  } else {
    await addDoc(collection(db, 'jugadores'), jugadorParaGuardar)
  }
  resetForm()
  await fetchJugadores()
}

const editarJugador = (jugador) => {
  editando.value = true
  jugadorId.value = jugador.id
  // Usamos la estructura por defecto para asegurarnos de que todos los campos existan en el formulario
  nuevoJugador.value = { ...crearJugadorPorDefecto(), ...jugador }
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
  // Al resetear, SIEMPRE volvemos a la estructura limpia y por defecto
  nuevoJugador.value = crearJugadorPorDefecto()
}

const cancelarEdicion = () => {
  resetForm()
}
</script>

<style scoped>
/* Los estilos no necesitan cambios, son genéricos */
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
