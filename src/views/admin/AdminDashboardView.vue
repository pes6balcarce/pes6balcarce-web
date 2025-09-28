<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

// Lógica para el formulario de encuestas
const nuevaEncuestaPregunta = ref('')
const nuevaEncuestaOpciones = ref([
  { texto: '' },
  { texto: '' }
])
const mensajeExito = ref('')

const agregarOpcion = () => {
  nuevaEncuestaOpciones.value.push({ texto: '' })
}

const crearEncuesta = async () => {
  if (nuevaEncuestaPregunta.value.trim() === '') {
    alert('La pregunta no puede estar vacía.')
    return
  }

  const opcionesValidas = nuevaEncuestaOpciones.value
    .map(op => ({ texto: op.texto.trim(), votos: 0 }))
    .filter(op => op.texto !== '')

  if (opcionesValidas.length < 2) {
    alert('Debe haber al menos dos opciones válidas.')
    return
  }

  try {
    // Añadimos el nuevo documento a la colección 'encuestas'
    await addDoc(collection(db, 'encuestas'), {
      pregunta: nuevaEncuestaPregunta.value,
      opciones: opcionesValidas,
      estaActiva: true, // La marcamos como activa por defecto
      fechaCreacion: serverTimestamp()
    })

    mensajeExito.value = '¡Encuesta creada con éxito!'
    // Limpiamos el formulario
    nuevaEncuestaPregunta.value = ''
    nuevaEncuestaOpciones.value = [{ texto: '' }, { texto: '' }]
    
    setTimeout(() => mensajeExito.value = '', 3000) // Ocultar mensaje después de 3s

  } catch (error) {
    console.error("Error al crear la encuesta:", error);
    alert('Hubo un error al crear la encuesta.')
  }
}
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard Principal</h1>
    <p>Desde aquí puedes ver un resumen general y realizar acciones rápidas.</p>
    
    <section class="widget">
      <h2>Crear Nueva Encuesta</h2>
      <form @submit.prevent="crearEncuesta">
        <div class="form-group">
          <label for="pregunta">Pregunta de la Encuesta</label>
          <input type="text" v-model="nuevaEncuestaPregunta" id="pregunta" placeholder="Ej: ¿Quién fue la figura de la fecha?">
        </div>

        <div class="form-group">
          <label>Opciones</label>
          <div v-for="(opcion, index) in nuevaEncuestaOpciones" :key="index" class="opcion-input">
            <input type="text" v-model="opcion.texto" :placeholder="`Opción ${index + 1}`">
          </div>
          <button type="button" @click="agregarOpcion" class="btn-secundario">Añadir Opción</button>
        </div>
        
        <button type="submit" class="btn-principal">Crear Encuesta</button>
      </form>
      <p v-if="mensajeExito" class="mensaje-exito">{{ mensajeExito }}</p>
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
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input {
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
}
</style>