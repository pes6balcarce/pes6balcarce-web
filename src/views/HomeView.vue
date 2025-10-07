<!-- src/views/HomeView.vue -->
<script setup>
// 1. Importamos el nuevo componente de banner
import BannerPatrocinador from '@/components/BannerPatrocinador.vue'
</script>

<template>
  <div class="home-view">
    <!-- Tarjeta principal -->
    <div class="card">
      <div class="card-header">
        <h2>Próximo Partido</h2>
      </div>
      <div class="card-body">
        <p>Toda la información sobre el siguiente encuentro.</p>
      </div>
    </div>

    <!-- AQUÍ INSERTAMOS EL PRIMER BANNER -->
    <BannerPatrocinador />

    <!-- Grid de accesos rápidos -->
    <div class="quick-access-grid">
      <RouterLink to="/noticias" class="access-card">
        <span>📰</span>
        <span>Noticias</span>
      </RouterLink>
      <RouterLink to="/once-ideal" class="access-card">
        <span>🏆</span>
        <span>Once Ideal</span>
      </RouterLink>
      <RouterLink to="/perfil" class="access-card">
        <span>👤</span>
        <span>Mi Perfil</span>
      </RouterLink>
    </div>

    <!-- AQUÍ PODEMOS INSERTAR OTRO BANNER (mostrará uno diferente al azar) -->
    <BannerPatrocinador />

    <!-- Lista de información -->
    <div class="card list-card">
      <div class="info-item">
        <h3>Puntos de Información</h3>
        <span class="arrow">></span>
      </div>
      <div class="info-item">
        <h3>Teléfonos de Interés</h3>
        <span class="arrow">></span>
      </div>
    </div>

    <!-- 2. HEMOS ELIMINADO LA ANTIGUA SECCIÓN DE PATROCINADORES DE AQUÍ ABAJO -->
  </div>
</template>

<style scoped>
/* Estos son los estilos que ya teníamos, no cambian */
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Este gap ahora solo aplica a los bloques de contenido */
}

.card {
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
  border: 1px solid #2a2a2a;
}
.card-header {
  padding: 1rem;
  border-bottom: 1px solid #2a2a2a;
}
.card-header h2 {
  margin: 0;
  color: var(--color-primario);
}
.card-body {
  padding: 1rem;
  color: var(--color-texto-secundario);
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.access-card {
  background-color: var(--color-superficie);
  border: 1px solid #2a2a2a;
  border-radius: var(--radio-borde);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-texto-principal);
  transition: background-color 0.2s ease;
}
.access-card:hover {
  background-color: #2c2c2c;
}
.access-card span:first-child {
  font-size: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #2a2a2a;
  color: var(--color-texto-principal);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.info-item:last-child {
  border-bottom: none;
}
.info-item:hover {
  background-color: #2c2c2c;
}
.info-item h3 {
  margin: 0;
  font-size: 1rem;
}
.arrow {
  color: var(--color-texto-secundario);
}
</style>
