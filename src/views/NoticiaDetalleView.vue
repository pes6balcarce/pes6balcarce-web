<script setup>
import { ref, onMounted } from 'vue'
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp, increment, arrayUnion } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

const props = defineProps({
  id: String
})

const noticia = ref(null)
const comentarios = ref([])
const nuevoComentario = ref('')
const cargando = ref(true)
const haDadoLike = ref(false)

onMounted(async () => {
  const noticiaRef = doc(db, 'noticias', props.id)
  const docSnap = await getDoc(noticiaRef)
  if (docSnap.exists()) {
    noticia.value = { id: docSnap.id, ...docSnap.data() }
  }

  const comentariosRef = collection(db, 'noticias', props.id, 'comentarios')
  const q = query(comentariosRef, orderBy('fechaCreacion', 'asc'))
  const querySnapshot = await getDocs(q)
  comentarios.value = querySnapshot.docs.map(doc => doc.data())
  
  haDadoLike.value = localStorage.getItem(`like_${props.id}`) === 'true'

  cargando.value = false
})

const darLike = async () => {
  // ... (función darLike se queda igual)
  if (haDadoLike.value) return;
  const noticiaRef = doc(db, 'noticias', props.id);
  await updateDoc(noticiaRef, { likes: increment(1) });
  if (!noticia.value.likes) noticia.value.likes = 0;
  noticia.value.likes++;
  haDadoLike.value = true;
  localStorage.setItem(`like_${props.id}`, 'true');
}

const agregarComentario = async () => {
  if (nuevoComentario.value.trim() === '') return;

  const user = auth.currentUser
  const autor = user ? user.displayName : 'Usuario Desconocido' // <-- Usamos el nombre del usuario si está logueado

  const comentarioData = {
    texto: nuevoComentario.value,
    autor: autor,
    fechaCreacion: serverTimestamp()
  }

  const comentariosRef = collection(db, 'noticias', props.id, 'comentarios')
  await addDoc(comentariosRef, comentarioData)
  
  // Si el usuario está logueado, intentamos darle la medalla "Primer Comentario"
  if (user) {
    const userDocRef = doc(db, 'users', user.uid);
    // arrayUnion solo añade el elemento si no existe, evitando duplicados
    await updateDoc(userDocRef, {
      medals: arrayUnion("Medalla: Primer Comentario")
    });
  }

  comentarios.value.push({ ...comentarioData, fechaCreacion: { toDate: () => new Date() } });
  nuevoComentario.value = ''
}
</script>

<template>
  <div v-if="cargando">Cargando noticia...</div>
  <div v-else-if="noticia" class="noticia-detalle">
    <h1>{{ noticia.titulo }}</h1>
    <p class="fecha">{{ new Date(noticia.fecha.seconds * 1000).toLocaleDateString() }}</p>
    <p class="contenido">{{ noticia.contenido }}</p>

    <div class="acciones-sociales">
      <button @click="darLike" :disabled="haDadoLike" class="like-btn">
        👍 Like ({{ noticia.likes || 0 }})
      </button>
    </div>

    <hr>

    <div class="seccion-comentarios">
      <h3>Comentarios</h3>
      <form @submit.prevent="agregarComentario" class="formulario-comentario">
        <textarea v-model="nuevoComentario" placeholder="Escribe tu comentario..."></textarea>
        <button type="submit">Enviar Comentario</button>
      </form>
      <div class="lista-comentarios">
        <div v-for="(comentario, index) in comentarios" :key="index" class="comentario">
          <p class="autor">{{ comentario.autor }}</p>
          <p class="texto">{{ comentario.texto }}</p>
          <p class="fecha-comentario">{{ comentario.fechaCreacion.toDate().toLocaleString() }}</p>
        </div>
        <p v-if="comentarios.length === 0">Aún no hay comentarios. ¡Sé el primero!</p>
      </div>
    </div>

  </div>
  <div v-else>
    <p>No se encontró la noticia.</p>
  </div>
</template>

<style scoped>
.noticia-detalle h1 {
  color: var(--color-primario);
  margin-bottom: 0.5rem;
}
.fecha {
  color: var(--color-texto-secundario);
  margin-bottom: 2rem;
}
.contenido {
  line-height: 1.8;
  white-space: pre-wrap; /* Respeta los saltos de línea del contenido */
}
.acciones-sociales {
  margin: 2rem 0;
}
.like-btn {
  background-color: var(--color-superficie);
  border: 1px solid var(--color-primario);
  color: var(--color-primario);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}
.like-btn:disabled {
  background-color: var(--color-primario);
  color: var(--color-fondo);
  cursor: not-allowed;
}
hr {
  border-color: var(--color-superficie);
}
.seccion-comentarios {
  margin-top: 2rem;
}
.formulario-comentario textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  background-color: var(--color-fondo);
  border: 1px solid var(--color-texto-secundario);
  color: var(--color-texto-principal);
  border-radius: var(--radio-borde);
  margin-bottom: 1rem;
}
.formulario-comentario button {
  padding: 0.7rem 1.5rem;
  background-color: var(--color-primario);
  color: var(--color-fondo);
  border: none;
  border-radius: var(--radio-borde);
  cursor: pointer;
  font-weight: bold;
}
.lista-comentarios {
  margin-top: 2rem;
}
.comentario {
  background-color: var(--color-superficie);
  padding: 1rem;
  border-radius: var(--radio-borde);
  margin-bottom: 1rem;
}
.comentario .autor {
  font-weight: bold;
  color: var(--color-primario);
}
.comentario .texto {
  margin: 0.5rem 0;
}
.comentario .fecha-comentario {
  font-size: 0.8rem;
  color: var(--color-texto-secundario);
  text-align: right;
}
</style>