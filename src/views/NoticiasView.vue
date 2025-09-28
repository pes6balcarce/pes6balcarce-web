<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config' // Importamos nuestra conexión a la BD

// Creamos una variable reactiva para guardar las noticias
const noticias = ref([])
const cargando = ref(true)

// onMounted es un hook de Vue que se ejecuta cuando el componente está listo
onMounted(async () => {
  // 1. Creamos una consulta a nuestra colección 'noticias', ordenadas por fecha descendente
  const q = query(collection(db, "noticias"), orderBy("fecha", "desc"));

  // 2. Ejecutamos la consulta
  const querySnapshot = await getDocs(q);

  // 3. Recorremos los resultados y los guardamos en nuestra variable
  querySnapshot.forEach((doc) => {
    noticias.value.push({
      id: doc.id,
      ...doc.data()
    });
  });

  cargando.value = false; // Dejamos de cargar
})
</script>

<template>
  <div class="noticias">
    <h2 class="titulo-seccion">Últimas Noticias</h2>
    
    <div v-if="cargando" class="mensaje-carga">Cargando noticias...</div>
    
    <div v-else class="noticias-grid">
      <!-- Envolvemos la tarjeta en un RouterLink -->
      <RouterLink v-for="noticia in noticias" :key="noticia.id" :to="`/noticias/${noticia.id}`" class="tarjeta-link">
        <article class="tarjeta-noticia">
          <h3>{{ noticia.titulo }}</h3>
          <p>{{ noticia.contenido }}</p>
          <small>{{ new Date(noticia.fecha.seconds * 1000).toLocaleDateString() }}</small>
        </article>
      </RouterLink>
    </div>
  </div>
</template>

<!-- SECCIÓN <style scoped> -->
<style scoped>
/* Añadimos un estilo para el enlace */
.tarjeta-link {
  text-decoration: none;
  color: inherit;
}

.noticias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.titulo-seccion {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  color: var(--color-primario);
}

article.tarjeta-noticia {
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%; /* Hacemos que todas las tarjetas tengan la misma altura */
  border: 1px solid transparent;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

article.tarjeta-noticia:hover {
  transform: translateY(-5px);
  border-color: var(--color-primario);
}

.tarjeta-noticia h3 {
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  color: var(--color-texto-principal);
}

.tarjeta-noticia p {
  flex-grow: 1;
  margin-bottom: 1rem;
  color: var(--color-texto-secundario);
  /* Limitamos el texto a 3 líneas para que no se desborde */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.tarjeta-noticia small {
  color: var(--color-primario);
  font-weight: bold;
  align-self: flex-end;
}

.mensaje-carga {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-texto-secundario);
}
</style>