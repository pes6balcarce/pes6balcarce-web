<!-- src/views/OnceIdealView.vue -->
<template>
  <div class="page-container once-ideal-view">
    <header class="page-header">
      <h1>Crea tu Once Ideal</h1>
      <p>Selecciona a los mejores jugadores del parche y guarda tu formación soñada.</p>
    </header>

    <div v-if="cargando" class="loading-message">Cargando jugadores...</div>

    <div v-else class="constructor-grid">
      <!-- Columna para seleccionar jugadores -->
      <div class="lista-jugadores-columna">
        <h3>Plantel Disponible</h3>
        <div class="jugadores-lista">
          <button
            v-for="jugador in jugadores"
            :key="jugador.id"
            @click="seleccionarJugador(jugador)"
            class="jugador-item"
            :class="{ seleccionado: estaSeleccionado(jugador.id) }"
          >
            <span class="numero">{{ jugador.numero }}</span>
            <span class="nombre">{{ jugador.nombre }} {{ jugador.apellido }}</span>
            <span class="posicion">{{ jugador.posicion }}</span>
          </button>
        </div>
      </div>

      <!-- Columna para ver el equipo seleccionado -->
      <div class="equipo-seleccionado-columna">
        <h3>Tu Equipo ({{ jugadoresSeleccionados.length }}/11)</h3>
        <div class="cancha">
          <div
            v-for="jugador in jugadoresSeleccionados"
            :key="jugador.id"
            class="jugador-en-cancha"
          >
            {{ jugador.nombre }} {{ jugador.apellido }}
          </div>
        </div>
        <button
          @click="guardarOnceIdeal"
          class="btn-guardar"
          :disabled="jugadoresSeleccionados.length !== 11 || guardando"
        >
          {{ guardando ? 'Guardando...' : 'Guardar mi Once Ideal' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase/config'
// ¡LA CORRECCIÓN ESTÁ AQUÍ! Hemos añadido 'doc' y 'writeBatch' a la importación.
import { collection, getDocs, query, orderBy, doc, writeBatch, increment } from 'firebase/firestore'

const jugadores = ref([])
const cargando = ref(true)
const guardando = ref(false)
const jugadoresSeleccionados = ref([])

onMounted(async () => {
  try {
    const q = query(collection(db, 'jugadores'), orderBy('nombre', 'asc'))
    const querySnapshot = await getDocs(q)
    jugadores.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error al cargar jugadores:', error)
  } finally {
    cargando.value = false
  }
})

const seleccionarJugador = (jugador) => {
  const index = jugadoresSeleccionados.value.findIndex((j) => j.id === jugador.id)
  if (index > -1) {
    // Si ya está seleccionado, lo quitamos
    jugadoresSeleccionados.value.splice(index, 1)
  } else if (jugadoresSeleccionados.value.length < 11) {
    // Si no está y hay espacio, lo añadimos
    jugadoresSeleccionados.value.push(jugador)
  } else {
    alert('Ya has seleccionado 11 jugadores. Quita uno para añadir otro.')
  }
}

const estaSeleccionado = (jugadorId) => {
  return jugadoresSeleccionados.value.some((j) => j.id === jugadorId)
}

const guardarOnceIdeal = async () => {
  if (jugadoresSeleccionados.value.length !== 11) {
    alert('Debes seleccionar exactamente 11 jugadores.')
    return
  }

  guardando.value = true
  try {
    // Creamos un lote de escritura para actualizar todos los jugadores a la vez
    const batch = writeBatch(db)

    jugadoresSeleccionados.value.forEach((jugador) => {
      // Usamos la función 'doc' (que ahora sí está definida) para obtener la referencia
      const jugadorRef = doc(db, 'jugadores', jugador.id)
      // Añadimos la operación de actualización al lote
      batch.update(jugadorRef, {
        vecesSeleccionado: increment(1), // Incrementamos el contador en 1
      })
    })

    // Ejecutamos todas las actualizaciones en una sola operación
    await batch.commit()

    alert(
      '¡Tu Once Ideal ha sido guardado con éxito! Se ha incrementado el contador de selección para cada jugador.',
    )
    jugadoresSeleccionados.value = [] // Limpiamos la selección
  } catch (error) {
    console.error('Error al guardar el Once Ideal:', error)
    alert('Hubo un error al guardar tu selección.')
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.loading-message {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-texto-secundario);
}

.constructor-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 992px) {
  .constructor-grid {
    grid-template-columns: 1fr 1fr; /* Dos columnas en PC */
  }
}

.lista-jugadores-columna,
.equipo-seleccionado-columna {
  background-color: var(--color-superficie);
  padding: 1.5rem;
  border-radius: var(--radio-borde);
  border: 1px solid var(--color-borde);
}
h3 {
  margin-top: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-borde);
}

.jugadores-lista {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 1rem;
}
.jugador-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-borde);
  background-color: var(--color-fondo);
  color: var(--color-texto-principal);
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  text-align: left;
}
.jugador-item:hover {
  background-color: #2a2a2a;
  border-color: #444;
}
.jugador-item.seleccionado {
  background-color: var(--color-primario);
  color: #101010;
  border-color: var(--color-primario);
  font-weight: bold;
}
.jugador-item .numero {
  font-weight: bold;
  margin-right: 1rem;
}
.jugador-item .nombre {
  flex-grow: 1;
}
.jugador-item .posicion {
  font-size: 0.85rem;
  color: var(--color-texto-secundario);
}
.jugador-item.seleccionado .posicion {
  color: #101010;
}

.cancha {
  min-height: 300px; /* Espacio para ver los seleccionados */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px dashed var(--color-borde);
  border-radius: var(--radio-borde);
  margin-bottom: 1.5rem;
}
.jugador-en-cancha {
  background-color: var(--color-fondo);
  padding: 0.5rem;
  border-radius: 4px;
}

.btn-guardar {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background-color: var(--color-primario);
  color: #101010;
  border: none;
  border-radius: var(--radio-borde);
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-guardar:disabled {
  background-color: #444;
  color: #888;
  cursor: not-allowed;
}
</style>
