<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore' // <- 'increment' ya no es necesario
import { db } from '@/firebase/config'

const encuesta = ref(null)
const cargando = ref(true)
const haVotado = ref(false)

onMounted(async () => {
  const q = query(collection(db, "encuestas"), where("estaActiva", "==", true));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnapshot = querySnapshot.docs[0];
    encuesta.value = { id: docSnapshot.id, ...docSnapshot.data() };
  }
  cargando.value = false;
})

// --- INICIO DE LA FUNCIÓN CORREGIDA ---
const votar = async (indiceOpcion) => {
  if (haVotado.value) {
    alert('Ya has votado en esta encuesta.');
    return;
  }

  try {
    const encuestaDocRef = doc(db, 'encuestas', encuesta.value.id);

    // 1. Creamos una copia del array de opciones para modificarla de forma segura
    const opcionesActualizadas = [...encuesta.value.opciones];

    // 2. Le sumamos 1 al contador de la opción que el usuario eligió
    opcionesActualizadas[indiceOpcion].votos++;

    // 3. Reemplazamos el array 'opciones' en Firestore con nuestro nuevo array modificado
    await updateDoc(encuestaDocRef, {
      opciones: opcionesActualizadas
    });

    // 4. Actualizamos el estado local para reflejar el cambio al instante
    encuesta.value.opciones = opcionesActualizadas;
    haVotado.value = true;

  } catch (error) {
    console.error("Error al votar:", error);
    alert('Hubo un error al registrar tu voto.');
  }
}
// --- FIN DE LA FUNCIÓN CORREGIDA ---
</script>

<template>
  <div class="encuesta-widget" v-if="!cargando && encuesta">
    <h3>{{ encuesta.pregunta || 'Pregunta no disponible' }}</h3>
    
    <!-- Comprobamos si el array de opciones existe y tiene elementos -->
    <ul v-if="Array.isArray(encuesta.opciones) && encuesta.opciones.length > 0">
      <li v-for="(opcion, index) in encuesta.opciones" :key="index" @click="!haVotado && votar(index)" :class="{ 'votado': haVotado }">
        <!-- Si opcion.texto no existe, mostramos 'Opción sin texto'. Si opcion.votos no existe, mostramos 0. -->
        <span class="texto-opcion">{{ opcion.texto || 'Opción sin texto' }}</span>
        <span class="votos" v-if="haVotado"> ({{ opcion.votos || 0 }} votos)</span>
      </li>
    </ul>
     <div v-else>
      <p>Esta encuesta aún no tiene opciones para votar.</p>
    </div>

    <p v-if="haVotado" class="gracias-voto">¡Gracias por tu voto!</p>
  </div>
</template>

<style scoped>
.encuesta-widget {
  background-color: var(--color-superficie);
  padding: 1.5rem;
  border-radius: var(--radio-borde);
  margin-top: 2rem;
}
h3 {
  text-align: center;
  margin-bottom: 1.5rem;
}
ul {
  list-style: none;
}
li {
  background-color: var(--color-fondo);
  border: 1px solid var(--color-texto-secundario);
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;
}
li:not(.votado):hover {
  background-color: #333;
  border-color: var(--color-primario);
}
li.votado {
  cursor: not-allowed;
  opacity: 0.8;
}
.gracias-voto {
  text-align: center;
  color: var(--color-primario);
  margin-top: 1rem;
  font-weight: bold;
}
</style>