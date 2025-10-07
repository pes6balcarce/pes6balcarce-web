<!-- src/views/HomeView.vue -->
<template>
  <div class="home-view">
    <!-- Sección de Héroe (Imagen Principal) -->
    <div class="hero-card">
      <img
        src="https://via.placeholder.com/600x300"
        alt="Imagen principal del club"
        class="hero-image"
      />
      <div class="hero-text">
        <h2>Bienvenidos al Sitio Oficial</h2>
        <p>Toda la información del fútbol de Balcarce.</p>
      </div>
    </div>

    <!-- Sección de Accesos Rápidos (como los 3 botones de Barcelona) -->
    <div class="quick-access-grid">
      <RouterLink to="/noticias" class="access-card">
        <span class="icon">📰</span>
        <span>Noticias</span>
      </RouterLink>
      <RouterLink to="/once-ideal" class="access-card">
        <span class="icon">🏆</span>
        <span>Once Ideal</span>
      </RouterLink>
      <RouterLink to="/perfil" class="access-card">
        <span class="icon">👤</span>
        <span>Mi Perfil</span>
      </RouterLink>
    </div>

    <!-- Sección de Información (como la lista de la Sagrada Familia) -->
    <div class="info-list">
      <div class="info-item">
        <span class="icon">ℹ️</span>
        <div class="item-text">
          <h3>Puntos de Información</h3>
          <p>Encuentra todo lo que necesitas saber.</p>
        </div>
        <span class="arrow">></span>
      </div>
      <div class="info-item">
        <span class="icon">📞</span>
        <div class="item-text">
          <h3>Teléfonos de Interés</h3>
          <p>Contacta con nosotros fácilmente.</p>
        </div>
        <span class="arrow">></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacio entre secciones */
}

/* Estilo para las tarjetas */
.hero-card,
.access-card,
.info-list {
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
  box-shadow: var(--sombra-suave);
  overflow: hidden; /* Para que la imagen respete los bordes redondeados */
}

/* Tarjeta de Héroe */
.hero-image {
  width: 100%;
  height: auto;
  display: block;
}
.hero-text {
  padding: 1rem;
}

/* Grid de Accesos Rápidos */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columnas */
  gap: 1rem;
  padding: 1rem;
}

.access-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.5rem;
  text-align: center;
  font-weight: 600;
  color: var(--color-texto-principal);
  border: 1px solid #eee;
  border-radius: var(--radio-borde);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.access-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.access-card .icon {
  font-size: 2rem;
}

/* Lista de Información */
.info-list {
  padding: 0.5rem 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid #f0f0f0;
}
.info-item:last-child {
  border-bottom: none;
}
.info-item .icon {
  font-size: 1.5rem;
}
.item-text {
  flex-grow: 1;
}
.item-text h3 {
  font-size: 1rem;
  margin: 0;
}
.item-text p {
  font-size: 0.85rem;
  color: var(--color-texto-secundario);
  margin: 0;
}
.arrow {
  font-size: 1.2rem;
  color: #ccc;
}
</style>
