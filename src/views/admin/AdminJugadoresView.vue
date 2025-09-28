<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'

// --- Lógica para AÑADIR jugadores ---
const nuevoJugador = ref({
  nombre: '',
  apellido: '',
  posicion: 'Arquero', // Valor por defecto
  equipo: ''
})
const mensajeExito = ref('')

const agregarJugador = async () => {
  if (!nuevoJugador.value.nombre || !nuevoJugador.value.apellido || !nuevoJugador.value.equipo) {
    alert('Todos los campos son obligatorios.');
    return;
  }
  try {
    await addDoc(collection(db, 'jugadores'), {
      ...nuevoJugador.value,
      vecesSeleccionado: 0 // La estadística empieza en 0
    });
    mensajeExito.value = `¡${nuevoJugador.value.nombre} ${nuevoJugador.value.apellido} añadido con éxito!`;
    // Recargamos la lista de jugadores para ver el nuevo
    cargarJugadores(); 
    // Limpiamos el formulario
    nuevoJugador.value = { nombre: '', apellido: '', posicion: 'Arquero', equipo: '' };
    setTimeout(() => mensajeExito.value = '', 3000);
  } catch (error) {
    console.error("Error al añadir jugador:", error);
    alert('Hubo un error al añadir el jugador.');
  }
}

// --- Lógica para MOSTRAR jugadores y estadísticas ---
const listaJugadores = ref([])
const cargando = ref(true)

const cargarJugadores = async () => {
  cargando.value = true;
  const q = query(collection(db, "jugadores"), orderBy("vecesSeleccionado", "desc"));
  const querySnapshot = await getDocs(q);
  listaJugadores.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  cargando.value = false;
}

onMounted(cargarJugadores); // Cargar los jugadores cuando la página esté lista
</script>

<template>
  <div>
    <h1>Gestionar Jugadores y Estadísticas</h1>
    
    <section class="widget">
      <h2>Añadir Nuevo Jugador</h2>
      <form @submit.prevent="agregarJugador" class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="nuevoJugador.nombre">
        </div>
        <div class="form-group">
          <label>Apellido</label>
          <input type="text" v-model="nuevoJugador.apellido">
        </div>
        <div class="form-group">
          <label>Posición</label>
          <select v-model="nuevoJugador.posicion">
            <option>Arquero</option>
            <option>Defensor</option>
            <option>Mediocampista</option>
            <option>Delantero</option>
          </select>
        </div>
        <div class="form-group">
          <label>Equipo</label>
          <input type="text" v-model="nuevoJugador.equipo">
        </div>
        <button type="submit" class="btn-principal span-full">Añadir Jugador</button>
      </form>
      <p v-if="mensajeExito" class="mensaje-exito">{{ mensajeExito }}</p>
    </section>

    <section class="widget">
      <h2>Lista de Jugadores (Estadísticas de Selección)</h2>
      <div v-if="cargando">Cargando jugadores...</div>
      <table v-else>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Equipo</th>
            <th>Posición</th>
            <th>Veces en el 11 Ideal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="jugador in listaJugadores" :key="jugador.id">
            <td>{{ jugador.nombre }} {{ jugador.apellido }}</td>
            <td>{{ jugador.equipo }}</td>
            <td>{{ jugador.posicion }}</td>
            <td><strong>{{ jugador.vecesSeleccionado }}</strong></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.widget {
  background-color: var(--color-superficie);
  padding: 2rem;
  border-radius: var(--radio-borde);
  margin-top: 2rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.span-full {
  grid-column: 1 / -1;
}
.form-group { display: flex; flex-direction: column; }
label { margin-bottom: 0.5rem; font-weight: bold; }
input, select {
  width: 100%; padding: 0.8rem; background-color: var(--color-fondo);
  border: 1px solid var(--color-texto-secundario); color: var(--color-texto-principal); border-radius: 4px;
}
.btn-principal {
  padding: 0.8rem; background-color: var(--color-primario); color: var(--color-fondo);
  border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1rem; margin-top: 1rem;
}
.mensaje-exito { color: var(--color-primario); margin-top: 1rem; text-align: center; }
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid var(--color-fondo);
}
th { font-weight: bold; color: var(--color-primario); }
tbody tr:hover { background-color: #2a2a2a; }
td strong { font-size: 1.2rem; color: var(--color-primario); }
</style>