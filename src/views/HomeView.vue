<!-- src/views/HomeView.vue -->
<template>
  <div>
    <!-- SECCIÓN HERO (Sin cambios) -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Liga Balcarceña de Fútbol</h1>
        <p class="hero-subtitle">
          El parche definitivo para PES 6, trayendo la pasión local a la gloria digital.
        </p>
        <RouterLink to="/descargas" class="hero-button">Descargar Última Versión</RouterLink>
      </div>
    </section>

    <!-- CONTENIDO PRINCIPAL DE LA PÁGINA -->
    <div class="page-container home-content">
      <main class="main-column">
        <h3>Últimas Noticias</h3>

        <!-- Lógica para mostrar noticias -->
        <div v-if="cargandoNoticias" class="loading-state">Cargando noticias...</div>
        <div v-else-if="ultimasNoticias.length === 0" class="empty-state">
          No hay noticias para mostrar.
        </div>

        <template v-else>
          <!-- Iteramos sobre las noticias y colocamos un banner entre cada una -->
          <template v-for="(noticia, index) in ultimasNoticias" :key="noticia.id">
            <!-- Tarjeta de Noticia -->
            <RouterLink :to="`/noticias/${noticia.id}`" class="noticia-card-home">
              <div class="card-content">
                <h4>{{ noticia.titulo }}</h4>
                <p>{{ noticia.contenido.substring(0, 120) }}...</p>
                <small>{{ new Date(noticia.creadoEn.seconds * 1000).toLocaleDateString() }}</small>
              </div>
            </RouterLink>

            <!-- Banner de Patrocinador -->
            <BannerPatrocinador v-if="index < ultimasNoticias.length - 1" />
          </template>
        </template>
      </main>

      <aside class="sidebar-column">
        <h3>Accesos Rápidos</h3>
        <div class="quick-links">
          <!-- Hemos eliminado el de "Once Ideal" como pediste -->
          <RouterLink to="/descargas/historial" class="quick-link-card">
            <h4>📚 Historial de Versiones</h4>
            <p>Revisa todas las actualizaciones.</p>
          </RouterLink>
          <RouterLink to="/registro" class="quick-link-card">
            <h4>👤 Crear Cuenta</h4>
            <p>Únete a la comunidad del parche.</p>
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import BannerPatrocinador from '@/components/BannerPatrocinador.vue'

// Variables reactivas para las noticias y el estado de carga
const ultimasNoticias = ref([])
const cargandoNoticias = ref(true)

// onMounted se ejecuta cuando el componente se carga por primera vez
onMounted(async () => {
  try {
    // 1. Creamos una consulta a la colección 'noticias'
    const q = query(
      collection(db, 'noticias'),
      orderBy('creadoEn', 'desc'), // 2. Ordenamos por fecha de creación, descendente (más nuevas primero)
      limit(3), // 3. Limitamos el resultado a solo 3 noticias
    )

    // 4. Ejecutamos la consulta
    const querySnapshot = await getDocs(q)

    // 5. Mapeamos los resultados y los guardamos en nuestra variable
    ultimasNoticias.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error al obtener las últimas noticias:', error)
  } finally {
    // 6. Indicamos que la carga ha terminado (incluso si hubo un error)
    cargandoNoticias.value = false
  }
})
</script>

<style scoped>
/* --- Estilos de la Sección Hero y Generales (Sin cambios) --- */
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 60vh;
  padding: 2rem;
  background-image: url('https://via.placeholder.com/1920x1080/1c1c1c/E8B943?text=IMAGEN+DEL+JUEGO');
  background-size: cover;
  background-position: center;
  color: white;
}
.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(16, 16, 16, 1), rgba(16, 16, 16, 0.3));
}
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}
.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
.hero-subtitle {
  font-size: 1.25rem;
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.8);
}
.hero-button {
  display: inline-block;
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  background-color: var(--color-primario);
  color: #101010;
  font-weight: 700;
  border-radius: 50px;
  text-transform: uppercase;
  font-size: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.hero-button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(232, 185, 67, 0.4);
}
.home-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
@media (min-width: 992px) {
  .home-content {
    grid-template-columns: 2fr 1fr;
  }
}
.main-column h3,
.sidebar-column h3 {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-borde);
}
.main-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.sidebar-column .quick-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.quick-link-card {
  display: block;
  background-color: var(--color-superficie);
  padding: 1.5rem;
  border-radius: var(--radio-borde);
  border: 1px solid var(--color-borde);
  color: var(--color-texto-principal);
  transition: border-color 0.2s ease;
}
.quick-link-card:hover {
  border-color: var(--color-primario);
}
.quick-link-card h4 {
  color: var(--color-primario);
  margin: 0 0 0.5rem 0;
}
.quick-link-card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-texto-secundario);
}

/* --- NUEVOS ESTILOS PARA LAS TARJETAS DE NOTICIAS --- */
.noticia-card-home {
  display: block;
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
  border: 1px solid var(--color-borde);
  color: var(--color-texto-principal);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}
.noticia-card-home:hover {
  transform: translateY(-5px);
  border-color: var(--color-primario);
}
.noticia-card-home .card-content {
  padding: 1.5rem;
}
.noticia-card-home h4 {
  margin: 0 0 0.75rem 0;
  color: var(
    --color-texto-principal
  ); /* Título en blanco para diferenciar de los de la barra lateral */
}
.noticia-card-home p {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: var(--color-texto-secundario);
}
.noticia-card-home small {
  font-size: 0.85rem;
  color: #666;
}

.loading-state,
.empty-state {
  color: var(--color-texto-secundario);
  text-align: center;
  padding: 2rem;
}
</style>
