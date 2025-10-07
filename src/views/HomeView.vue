<!-- src/views/HomeView.vue -->
<template>
  <div>
    <!-- SECCIÓN HERO -->
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
        <!-- Aquí iría un loop de tus noticias más recientes -->
        <div class="card">Contenido de la noticia...</div>

        <BannerPatrocinador />

        <div class="card">Contenido de la noticia...</div>
      </main>

      <aside class="sidebar-column">
        <h3>Accesos Rápidos</h3>
        <div class="quick-links">
          <RouterLink to="/descargas/historial" class="quick-link-card">
            <h4>📚 Historial</h4>
            <p>Revisa todas las versiones.</p>
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import BannerPatrocinador from '@/components/BannerPatrocinador.vue'
// Aquí podrías añadir lógica para cargar las últimas noticias si quieres
</script>

<style scoped>
/* --- ESTILOS DE LA SECCIÓN HERO --- */
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 60vh; /* Ocupa el 60% de la altura de la pantalla */
  padding: 2rem;
  /* CAMBIA ESTA URL por una imagen de fondo espectacular de tu parche */
  background-image: url('https://via.placeholder.com/1920x1080/1c1c1c/E8B943?text=IMAGEN+DEL+JUEGO');
  background-size: cover;
  background-position: center;
  color: white;
}
/* Capa oscura sobre la imagen para que el texto sea legible */
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
  position: relative; /* Para que esté por encima de la capa oscura */
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
  border-radius: 50px; /* Botón píldora */
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

/* --- ESTILOS DEL CONTENIDO PRINCIPAL --- */
.home-content {
  display: grid;
  grid-template-columns: 1fr; /* Una columna por defecto para móviles */
  gap: 2rem;
}
@media (min-width: 992px) {
  /* En PC, dos columnas: 2/3 para el contenido, 1/3 para la barra lateral */
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

/* Estilo unificado para las tarjetas */
.card {
  background-color: var(--color-superficie);
  padding: 1.5rem;
  border-radius: var(--radio-borde);
  border: 1px solid var(--color-borde);
}

/* Nuevo diseño para los accesos rápidos */
.quick-links {
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
</style>
