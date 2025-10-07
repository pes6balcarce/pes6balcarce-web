<!-- src/components/SubHeader.vue -->
<template>
  <nav class="sub-header">
    <div class="nav-links">
      <RouterLink to="/" class="nav-link">
        <span class="icon">🏠</span>
        <span class="text">Inicio</span>
      </RouterLink>
      <RouterLink to="/noticias" class="nav-link">
        <span class="icon">📰</span>
        <span class="text">Noticias</span>
      </RouterLink>
      <RouterLink to="/once-ideal" class="nav-link">
        <span class="icon">🏆</span>
        <span class="text">Once Ideal</span>
      </RouterLink>
      <RouterLink to="/descargas" class="nav-link">
        <span class="icon">💾</span>
        <span class="text">Descargas</span>
      </RouterLink>
      <!-- Puedes añadir más enlaces aquí si lo necesitas -->
    </div>
  </nav>
</template>

<style scoped>
.sub-header {
  /* --- Posicionamiento Pegajoso --- */
  position: sticky;
  top: var(--header-height); /* Se pega justo debajo del header principal */
  z-index: 999; /* Un poco menos que el header principal para que quede debajo si hay solapamiento */

  /* --- Estilos Visuales --- */
  background-color: #0a0a0a; /* Un negro un poco más puro para diferenciarlo */
  border-bottom: 1px solid #333;
  width: 100%;
  height: var(--subheader-height);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  overflow-x: auto; /* Permite scroll horizontal en móviles */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* Ocultar la barra de scroll en Chrome, Safari y Opera */
.nav-links::-webkit-scrollbar {
  display: none;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--color-texto-secundario);
  text-decoration: none;
  font-weight: bold;
  border-radius: var(--radio-borde);
  white-space: nowrap; /* Evita que el texto del botón se parta en dos líneas */
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--color-superficie);
  color: var(--color-texto-principal);
}

/* Estilo para el enlace de la página activa */
.router-link-exact-active {
  background-color: var(--color-primario);
  color: #121212;
}

/* En pantallas de PC, ocultamos los iconos para un look más limpio */
@media (min-width: 768px) {
  .nav-link .icon {
    display: none;
  }
}

/* En móviles, ocultamos el texto para que quepan más iconos */
@media (max-width: 480px) {
  .nav-link .text {
    display: none;
  }
  .nav-link {
    padding: 0.5rem 0.75rem; /* Hacemos los botones un poco más pequeños */
  }
}
</style>
