<!-- src/views/admin/AdminDashboardView.vue -->
<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

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

// --- INICIO: Nueva Lógica para el formulario de descargas ---
const nuevaDescarga = ref({
  titulo: '',
  descripcion: '',
  enlace: '',
})
const descargaExito = ref('')

const crearDescarga = async () => {
  // Validación simple
  if (
    !nuevaDescarga.value.titulo.trim() ||
    !nuevaDescarga.value.descripcion.trim() ||
    !nuevaDescarga.value.enlace.trim()
  ) {
    alert('Por favor, completa todos los campos para la descarga.')
    return
  }

  try {
    // Añadimos el nuevo documento a la colección 'descargasLinks'
    await addDoc(collection(db, 'descargasLinks'), {
      titulo: nuevaDescarga.value.titulo,
      descripcion: nuevaDescarga.value.descripcion,
      enlace: nuevaDescarga.value.enlace,
      fechaPublicacion: serverTimestamp(), // Firebase se encarga de la fecha
    })

    descargaExito.value = '¡Link de descarga publicado con éxito!'
    // Limpiamos el formulario
    nuevaDescarga.value = { titulo: '', descripcion: '', enlace: '' }
    setTimeout(() => (descargaExito.value = ''), 3000)
  } catch (error) {
    console.error('Error al crear la descarga:', error)
    alert('Hubo un error al publicar la descarga.')
  }
}
// --- FIN: Nueva Lógica ---
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard Principal</h1>
    <p>Desde aquí puedes ver un resumen general y realizar acciones rápidas.</p>

    <!-- INICIO: Nuevo widget para publicar descargas -->
    <section class="widget">
      <h2>Publicar Link de Descarga Adicional</h2>
      <form @submit.prevent="crearDescarga">
        <div class="form-group">
          <label for="tituloDescarga">Título</label>
          <input
            type="text"
            v-model="nuevaDescarga.titulo"
            id="tituloDescarga"
            placeholder="Ej: Pack de Estadios Sudamericanos"
            required
          />
        </div>

        <div class="form-group">
          <label for="descripcionDescarga">Descripción</label>
          <textarea
            v-model="nuevaDescarga.descripcion"
            id="descripcionDescarga"
            rows="3"
            placeholder="Breve descripción del contenido del archivo."
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="enlaceDescarga">Enlace de Descarga (URL)</label>
          <input
            type="url"
            v-model="nuevaDescarga.enlace"
            id="enlaceDescarga"
            placeholder="https://www.mediafire.com/..."
            required
          />
        </div>

        <button type="submit" class="btn-principal">Publicar Descarga</button>
      </form>
      <p v-if="descargaExito" class="mensaje-exito">{{ descargaExito }}</p>
    </section>
    <!-- FIN: Nuevo widget -->

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
</style>
