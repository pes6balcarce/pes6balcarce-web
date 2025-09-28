<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, doc, writeBatch, deleteDoc, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase/config'

const encuestas = ref([])
const cargando = ref(true)

// Función para obtener los datos cuando el componente se carga
onMounted(async () => {
  const q = query(collection(db, "encuestas"), orderBy("fechaCreacion", "desc"));
  const querySnapshot = await getDocs(q);
  encuestas.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  cargando.value = false;
});

// Función para activar una encuesta (y desactivar las demás)
const activarEncuesta = async (idEncuestaActivar) => {
  const batch = writeBatch(db);
  encuestas.value.forEach(encuesta => {
    const docRef = doc(db, 'encuestas', encuesta.id);
    const debeEstarActiva = encuesta.id === idEncuestaActivar;
    batch.update(docRef, { estaActiva: debeEstarActiva });
  });
  await batch.commit();
  // Actualizamos el estado local para reflejar el cambio al instante
  encuestas.value.forEach(enc => enc.estaActiva = (enc.id === idEncuestaActivar));
}

// Función para eliminar una encuesta
const eliminarEncuesta = async (idEncuestaEliminar) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta encuesta? Esta acción es irreversible.')) {
    await deleteDoc(doc(db, "encuestas", idEncuestaEliminar));
    // Eliminamos la encuesta del array local
    encuestas.value = encuestas.value.filter(enc => enc.id !== idEncuestaEliminar);
  }
}

// Funciones para los gráficos
const calcularTotalVotos = (encuesta) => {
  return encuesta.opciones.reduce((total, opcion) => total + opcion.votos, 0);
}
const calcularPorcentaje = (votos, total) => {
  if (total === 0) return 0;
  return (votos / total) * 100;
}
</script>

<template>
  <div>
    <h1>Gestionar Encuestas</h1>
    <div v-if="cargando">Cargando encuestas...</div>
    <div v-else class="encuestas-lista">
      <div v-for="encuesta in encuestas" :key="encuesta.id" class="encuesta-card">
        <h4>{{ encuesta.pregunta || 'Pregunta no disponible' }} <span :class="['status', { active: encuesta.estaActiva }]">{{ encuesta.estaActiva ? 'Activa' : 'Inactiva' }}</span></h4>
        
        <div class="resultados">
          <!-- Comprobamos si el array de opciones existe y tiene elementos -->
          <div v-if="Array.isArray(encuesta.opciones) && encuesta.opciones.length > 0">
            <div v-for="(opcion, index) in encuesta.opciones" :key="index" class="opcion-resultado">
              <div class="info">
                <!-- Si opcion.texto no existe, mostramos 'Opción sin texto'. Si opcion.votos no existe, mostramos 0. -->
                <span>{{ opcion.texto || 'Opción sin texto' }}</span>
                <span>{{ opcion.votos || 0 }} votos</span>
              </div>
              <div class="barra-grafico">
                <div class="barra-progreso" :style="{ width: calcularPorcentaje(opcion.votos || 0, calcularTotalVotos(encuesta)) + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Esta encuesta no tiene opciones configuradas.</p>
          </div>
        </div>

        <div class="acciones">
          <button v-if="!encuesta.estaActiva" @click="activarEncuesta(encuesta.id)" class="btn-activar">Activar</button>
          <button @click="eliminarEncuesta(encuesta.id)" class="btn-eliminar">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.encuestas-lista {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}
.encuesta-card {
  background-color: var(--color-superficie);
  padding: 1.5rem;
  border-radius: var(--radio-borde);
}
.encuesta-card h4 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
}
.status {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  background-color: #555;
}
.status.active {
  background-color: var(--color-primario);
  color: var(--color-fondo);
}
.opcion-resultado {
  margin-bottom: 1rem;
}
.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}
.barra-grafico {
  height: 20px;
  width: 100%;
  background-color: var(--color-fondo);
  border-radius: 10px;
  overflow: hidden;
}
.barra-progreso {
  height: 100%;
  background-color: var(--color-primario);
  border-radius: 10px;
  transition: width 0.5s ease;
}
.acciones {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}
.acciones button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radio-borde);
  cursor: pointer;
}
.btn-activar {
  background-color: var(--color-primario);
  color: var(--color-fondo);
}
.btn-eliminar {
  background-color: #c53030;
  color: white;
}
</style>