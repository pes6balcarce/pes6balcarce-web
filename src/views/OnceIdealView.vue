<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

const jugadoresDisponibles = ref([])
const cargando = ref(true)
const filtroNombre = ref('')
const filtroPosicion = ref('Todas')

// La estructura de nuestra alineación. 4-4-2 por defecto.
const alineacion = ref({
  ARQ: null,
  DEF1: null, DEF2: null, DEF3: null, DEF4: null,
  MED1: null, MED2: null, MED3: null, MED4: null,
  DEL1: null, DEL2: null
})

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "jugadores"));
  jugadoresDisponibles.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  cargando.value = false;
});

const jugadoresFiltrados = computed(() => {
  return jugadoresDisponibles.value.filter(j => {
    const nombreCompleto = `${j.nombre} ${j.apellido}`.toLowerCase()
    const coincideNombre = nombreCompleto.includes(filtroNombre.value.toLowerCase())
    const coincidePosicion = filtroPosicion.value === 'Todas' || j.posicion === filtroPosicion.value
    return coincideNombre && coincidePosicion
  })
})

const seleccionarJugador = (jugador) => {
  // Buscar el primer hueco libre en la alineación para esa posición
  let posicionAsignada = false;
  for (const pos in alineacion.value) {
    if (pos.includes(jugador.posicion.substring(0, 3).toUpperCase()) && !alineacion.value[pos]) {
      alineacion.value[pos] = jugador;
      posicionAsignada = true;
      break;
    }
  }
  if (!posicionAsignada) alert(`No hay más huecos para la posición: ${jugador.posicion}`);
}

const quitarJugador = (posicion) => {
  alineacion.value[posicion] = null;
}

const estaEnAlineacion = (jugadorId) => {
  return Object.values(alineacion.value).some(j => j && j.id === jugadorId)
}

const guardarAlineacion = async () => {
  const jugadoresSeleccionados = Object.values(alineacion.value).filter(j => j !== null);
  if (jugadoresSeleccionados.length !== 11) {
    alert('Debes completar el 11 inicial para poder guardarlo.');
    return;
  }

  // Usamos un batch para asegurar que todas las operaciones se hagan a la vez
  const batch = writeBatch(db);

  // 1. Guardar la nueva alineación
  const idsJugadores = jugadoresSeleccionados.map(j => j.id);
  const alineacionRef = collection(db, 'alineaciones');
  batch.set(doc(alineacionRef), {
    jugadores: idsJugadores,
    fechaCreacion: serverTimestamp()
  });

  // 2. Actualizar el contador de cada jugador
  jugadoresSeleccionados.forEach(jugador => {
    const jugadorRef = doc(db, 'jugadores', jugador.id);
    batch.update(jugadorRef, { vecesSeleccionado: (jugador.vecesSeleccionado || 0) + 1 });
  });

  try {
    await batch.commit();
    alert('¡Tu 11 Ideal ha sido guardado con éxito! Gracias por participar.');
    // Opcional: limpiar la alineación después de guardar
    Object.keys(alineacion.value).forEach(key => alineacion.value[key] = null);
  } catch (error) {
    console.error("Error al guardar la alineación:", error);
    alert('Hubo un error al guardar tu alineación.');
  }
}
</script>

<template>
  <div>
    <h1>Crea tu 11 Ideal</h1>
    <p>Selecciona a los mejores jugadores del parche para formar tu equipo soñado.</p>
    
    <div class="creador-grid">
      <!-- Columna de Jugadores Disponibles -->
      <div class="panel-jugadores">
        <h3>Jugadores Disponibles</h3>
        <div class="filtros">
          <input type="text" v-model="filtroNombre" placeholder="Buscar por nombre...">
          <select v-model="filtroPosicion">
            <option>Todas</option>
            <option>Arquero</option>
            <option>Defensor</option>
            <option>Mediocampista</option>
            <option>Delantero</option>
          </select>
        </div>
        <div v-if="cargando">Cargando...</div>
        <ul v-else class="lista-jugadores">
          <li v-for="jugador in jugadoresFiltrados" :key="jugador.id" @click="!estaEnAlineacion(jugador.id) && seleccionarJugador(jugador)" :class="{ 'disabled': estaEnAlineacion(jugador.id) }">
            <strong>{{ jugador.nombre }} {{ jugador.apellido }}</strong>
            <span>{{ jugador.equipo }} - {{ jugador.posicion }}</span>
          </li>
        </ul>
      </div>

      <!-- Columna del Campo de Juego -->
      <div class="panel-campo">
        <h3>Tu Alineación (4-4-2)</h3>
        <div class="campo">
          <!-- Delanteros -->
          <div class="fila-posicion">
            <div class="posicion" @click="quitarJugador('DEL1')">{{ alineacion.DEL1 ? `${alineacion.DEL1.apellido}` : 'DEL' }}</div>
            <div class="posicion" @click="quitarJugador('DEL2')">{{ alineacion.DEL2 ? `${alineacion.DEL2.apellido}` : 'DEL' }}</div>
          </div>
          <!-- Mediocampistas -->
          <div class="fila-posicion">
            <div class="posicion" @click="quitarJugador('MED1')">{{ alineacion.MED1 ? `${alineacion.MED1.apellido}` : 'MED' }}</div>
            <div class="posicion" @click="quitarJugador('MED2')">{{ alineacion.MED2 ? `${alineacion.MED2.apellido}` : 'MED' }}</div>
            <div class="posicion" @click="quitarJugador('MED3')">{{ alineacion.MED3 ? `${alineacion.MED3.apellido}` : 'MED' }}</div>
            <div class="posicion" @click="quitarJugador('MED4')">{{ alineacion.MED4 ? `${alineacion.MED4.apellido}` : 'MED' }}</div>
          </div>
          <!-- Defensores -->
          <div class="fila-posicion">
            <div class="posicion" @click="quitarJugador('DEF1')">{{ alineacion.DEF1 ? `${alineacion.DEF1.apellido}` : 'DEF' }}</div>
            <div class="posicion" @click="quitarJugador('DEF2')">{{ alineacion.DEF2 ? `${alineacion.DEF2.apellido}` : 'DEF' }}</div>
            <div class="posicion" @click="quitarJugador('DEF3')">{{ alineacion.DEF3 ? `${alineacion.DEF3.apellido}` : 'DEF' }}</div>
            <div class="posicion" @click="quitarJugador('DEF4')">{{ alineacion.DEF4 ? `${alineacion.DEF4.apellido}` : 'DEF' }}</div>
          </div>
          <!-- Arquero -->
          <div class="fila-posicion">
            <div class="posicion arquero" @click="quitarJugador('ARQ')">{{ alineacion.ARQ ? `${alineacion.ARQ.apellido}` : 'ARQ' }}</div>
          </div>
        </div>
        <button @click="guardarAlineacion" class="btn-guardar">Guardar 11 Ideal</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.creador-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; margin-top: 2rem; }
.panel-jugadores, .panel-campo { background-color: var(--color-superficie); padding: 1.5rem; border-radius: var(--radio-borde); }
h3 { margin-bottom: 1rem; }
.filtros { display: flex; gap: 1rem; margin-bottom: 1rem; }
.filtros input, .filtros select { width: 100%; padding: 0.5rem; background-color: var(--color-fondo); border: 1px solid var(--color-texto-secundario); color: var(--color-texto-principal); border-radius: 4px; }
.lista-jugadores { list-style: none; max-height: 500px; overflow-y: auto; }
.lista-jugadores li { display: flex; justify-content: space-between; padding: 0.8rem; border-bottom: 1px solid var(--color-fondo); cursor: pointer; }
.lista-jugadores li:hover { background-color: #2a2a2a; }
.lista-jugadores li.disabled { cursor: not-allowed; opacity: 0.5; }
.campo { background-color: #004d00; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23006600' fill-opacity='0.4'%3E%3Crect x='0' y='0' width='100' height='1px'/%3E%3C/g%3E%3C/svg%3E"); border: 2px solid white; padding: 1rem; border-radius: var(--radio-borde); height: 500px; display: flex; flex-direction: column; justify-content: space-around; }
.fila-posicion { display: flex; justify-content: space-around; }
.posicion { width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border: 1px solid white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; color: white; cursor: pointer; }
.posicion:not(.arquero) { background-color: rgba(232, 185, 67, 0.8); color: var(--color-fondo); }
.posicion.arquero { background-color: rgba(50, 50, 50, 0.8); }
.btn-guardar { width: 100%; padding: 1rem; background-color: var(--color-primario); color: var(--color-fondo); border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1.2rem; margin-top: 1rem; }
</style>