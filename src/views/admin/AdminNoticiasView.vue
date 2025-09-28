<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

// --- Lógica para AÑADIR noticias ---
const nuevaNoticia = ref({
  titulo: '',
  contenido: ''
})
const mensajeExito = ref('')

const crearNoticia = async () => {
  if (!nuevaNoticia.value.titulo || !nuevaNoticia.value.contenido) {
    alert('El título y el contenido son obligatorios.');
    return;
  }
  try {
    await addDoc(collection(db, 'noticias'), {
      titulo: nuevaNoticia.value.titulo,
      contenido: nuevaNoticia.value.contenido,
      fecha: serverTimestamp(),
      likes: 0 // Las noticias empiezan con 0 likes
    });
    mensajeExito.value = '¡Noticia creada con éxito!';
    cargarNoticias(); // Recargamos la lista para ver la nueva
    nuevaNoticia.value = { titulo: '', contenido: '' }; // Limpiamos el formulario
    setTimeout(() => mensajeExito.value = '', 3000);
  } catch (error) {
    console.error("Error al crear la noticia:", error);
    alert('Hubo un error al crear la noticia.');
  }
}

// --- Lógica para MOSTRAR y ELIMINAR noticias ---
const listaNoticias = ref([])
const cargando = ref(true)

const cargarNoticias = async () => {
  cargando.value = true;
  const q = query(collection(db, "noticias"), orderBy("fecha", "desc"));
  const querySnapshot = await getDocs(q);
  listaNoticias.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  cargando.value = false;
}

const eliminarNoticia = async (idNoticia) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta noticia? También se eliminarán todos sus comentarios y likes. Esta acción es irreversible.')) {
    try {
      await deleteDoc(doc(db, "noticias", idNoticia));
      // Eliminamos la noticia de la lista local para que desaparezca al instante
      listaNoticias.value = listaNoticias.value.filter(noticia => noticia.id !== idNoticia);
    } catch (error) {
      console.error("Error al eliminar la noticia:", error);
      alert('Hubo un error al eliminar la noticia.');
    }
  }
}

onMounted(cargarNoticias);
</script>

<template>
  <div>
    <h1>Gestionar Noticias</h1>
    
    <section class="widget">
      <h2>Crear Nueva Noticia</h2>
      <form @submit.prevent="crearNoticia">
        <div class="form-group">
          <label for="titulo">Título</label>
          <input type="text" v-model="nuevaNoticia.titulo" id="titulo">
        </div>
        <div class="form-group">
          <label for="contenido">Contenido</label>
          <textarea v-model="nuevaNoticia.contenido" id="contenido" rows="6"></textarea>
        </div>
        <button type="submit" class="btn-principal">Publicar Noticia</button>
      </form>
      <p v-if="mensajeExito" class="mensaje-exito">{{ mensajeExito }}</p>
    </section>

    <section class="widget">
      <h2>Lista de Noticias Publicadas</h2>
      <div v-if="cargando">Cargando noticias...</div>
      <div v-else class="table-container">
        <table v-else>
            <thead>
            <tr>
                <th>Título</th>
                <th>Fecha de Publicación</th>
                <th>Likes</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="noticia in listaNoticias" :key="noticia.id">
                <td>{{ noticia.titulo }}</td>
                <td>{{ new Date(noticia.fecha.seconds * 1000).toLocaleDateString() }}</td>
                <td>{{ noticia.likes || 0 }}</td>
                <td>
                <button @click="eliminarNoticia(noticia.id)" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
            </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.widget { background-color: var(--color-superficie); padding: 2rem; border-radius: var(--radio-borde); margin-top: 2rem; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
input, textarea {
  width: 100%; padding: 0.8rem; background-color: var(--color-fondo);
  border: 1px solid var(--color-texto-secundario); color: var(--color-texto-principal); border-radius: 4px;
}
textarea { resize: vertical; }
.btn-principal {
  padding: 0.8rem; background-color: var(--color-primario); color: var(--color-fondo);
  border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1rem;
}
.mensaje-exito { color: var(--color-primario); margin-top: 1rem; text-align: center; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { padding: 0.8rem; text-align: left; border-bottom: 1px solid var(--color-fondo); }
th { color: var(--color-primario); }
.btn-eliminar {
  padding: 0.4rem 0.8rem; background-color: #c53030; color: white;
  border: none; border-radius: var(--radio-borde); cursor: pointer;
}
.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  white-space: nowrap;
}
</style>