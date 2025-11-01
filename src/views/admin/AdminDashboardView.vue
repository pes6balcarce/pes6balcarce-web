<!-- src/views/admin/AdminDashboardView.vue -->
<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

// --- INICIO: Nueva Lógica para el formulario de VERSIONES DEL PARCHE ---
const nuevaVersion = ref({
  nombre: '',
  enlace: '',
  changelog: '',
})
const versionExito = ref('')

const guardarVersion = async () => {
  if (!nuevaVersion.value.nombre || !nuevaVersion.value.enlace || !nuevaVersion.value.changelog) {
    alert('Por favor, completa todos los campos para publicar la versión.')
    return
  }
  try {
    // Apuntamos a la colección 'versiones'
    await addDoc(collection(db, 'versiones'), {
      nombre: nuevaVersion.value.nombre,
      enlace: nuevaVersion.value.enlace,
      // Guardamos el changelog como un array, dividiendo por saltos de línea
      changelog: nuevaVersion.value.changelog.split('\n').filter((line) => line.trim() !== ''),
      fechaPublicacion: serverTimestamp(), // Firebase pone la fecha del servidor
    })

    versionExito.value = '¡Nueva versión del parche publicada con éxito!'
    // Limpiamos el formulario
    nuevaVersion.value = { nombre: '', enlace: '', changelog: '' }
    setTimeout(() => (versionExito.value = ''), 4000)
  } catch (error) {
    console.error('Error al publicar la versión:', error)
    alert('Ocurrió un error al publicar la versión.')
  }
}
// --- FIN: Nueva Lógica de Versiones ---

// --- Lógica para el formulario de encuestas (existente) ---
const nuevaEncuestaPregunta = ref('')
const nuevaEncuestaOpciones = ref([{ texto: '' }, { texto: '' }])
const encuestaExito = ref('')

const agregarOpcion = () => {
  nuevaEncuestaOpciones.value.push({ texto: '' })
}

const crearEncuesta = async () => {
  if (nuevaEncuestaPregunta.value.trim() === '') {
    alert('La pregunta no puede estar vacía.')
    return
  }
  const opcionesValidas = nuevaEncuestaOpciones.value
    .map((op) => ({ texto: op.texto.trim(), votos: 0 }))
    .filter((op) => op.texto !== '')

  if (opcionesValidas.length < 2) {
    alert('Debe haber al menos dos opciones válidas.')
    return
  }
  try {
    await addDoc(collection(db, 'encuestas'), {
      pregunta: nuevaEncuestaPregunta.value,
      opciones: opcionesValidas,
      estaActiva: true,
      fechaCreacion: serverTimestamp(),
    })
    encuestaExito.value = '¡Encuesta creada con éxito!'
    nuevaEncuestaPregunta.value = ''
    nuevaEncuestaOpciones.value = [{ texto: '' }, { texto: '' }]
    setTimeout(() => (encuestaExito.value = ''), 3000)
  } catch (error) {
    console.error('Error al crear la encuesta:', error)
    alert('Hubo un error al crear la encuesta.')
  }
}
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard Principal</h1>
    <p>Desde aquí puedes ver un resumen general y realizar acciones rápidas.</p>

    <!-- INICIO: Widget para publicar una nueva versión del parche -->
    <section class="widget">
      <h2>Publicar Nueva Versión del Parche</h2>
      <form @submit.prevent="guardarVersion">
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

        <button type="submit" class="btn-principal">Publicar Versión</button>
      </form>
      <p v-if="versionExito" class="mensaje-exito">{{ versionExito }}</p>
    </section>
    <!-- FIN: Widget de Versiones -->

    <section class="widget">
      <h2>Crear Nueva Encuesta</h2>
      <form @submit.prevent="crearEncuesta">
        <div class="form-group">
          <label for="pregunta">Pregunta de la Encuesta</label>
          <input
            type="text"
            v-model="nuevaEncuestaPregunta"
            id="pregunta"
            placeholder="Ej: ¿Quién fue la figura de la fecha?"
          />
        </div>

        <div class="form-group">
          <label>Opciones</label>
          <div v-for="(opcion, index) in nuevaEncuestaOpciones" :key="index" class="opcion-input">
            <input type="text" v-model="opcion.texto" :placeholder="`Opción ${index + 1}`" />
          </div>
          <button type="button" @click="agregarOpcion" class="btn-secundario">Añadir Opción</button>
        </div>

        <button type="submit" class="btn-principal">Crear Encuesta</button>
      </form>
      <p v-if="encuestaExito" class="mensaje-exito">{{ encuestaExito }}</p>
    </section>
  </div>
</template>

<style scoped>
/* Estilos generales del dashboard */
.dashboard h1 {
  margin-bottom: 0.5rem;
}
.dashboard p {
  margin-bottom: 2rem;
  color: var(--color-texto-secundario);
}

/* Estilos de los widgets o secciones */
.widget {
  background-color: var(--color-superficie);
  padding: 2rem;
  border-radius: var(--radio-borde);
  margin-bottom: 2rem; /* Espacio entre widgets */
}
.form-group {
  margin-bottom: 1.5rem;
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
  padding: 0.8rem;
  background-color: var(--color-fondo);
  border: 1px solid var(--color-texto-secundario);
  color: var(--color-texto-principal);
  border-radius: 4px;
}
.opcion-input {
  margin-bottom: 0.5rem;
}

/* Estilos de botones */
.btn-principal {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--color-primario);
  color: var(--color-fondo);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}
.btn-secundario {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--color-primario);
  color: var(--color-primario);
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}
.mensaje-exito {
  color: var(--color-primario);
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}

/* Media Query para mejorar la vista en móviles */
@media (max-width: 768px) {
  .widget {
    padding: 1.5rem;
  }
  .dashboard h1 {
    font-size: 1.8rem;
  }
}
</style>
