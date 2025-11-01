<!-- src/components/SubHeader.vue -->
<template>
  <nav class="sub-header">
    <div class="nav-links">
      <RouterLink to="/" class="nav-link">Inicio</RouterLink>
      <RouterLink to="/noticias" class="nav-link">Noticias</RouterLink>
      <RouterLink to="/descargas" class="nav-link">Parche Oficial</RouterLink>
      <!-- Enlace a la nueva vista -->
      <RouterLink to="/links-descarga" class="nav-link">Otras Descargas</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.sub-header {
  position: sticky;
  top: var(--header-height);
  z-index: 999;
  background-color: var(--color-fondo); /* Mismo color que el fondo general */
  border-bottom: 1px solid var(--color-borde);
  width: 100%;
  height: var(--subheader-height);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto; /* Permite scroll horizontal en móviles */
}

.nav-links {
  display: flex;
  height: 100%;
  white-space: nowrap; /* Evita que los enlaces se rompan en varias líneas */
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0 1rem; /* Padding reducido para que quepan más enlaces */
  color: var(--color-texto-secundario);
  text-decoration: none;
  font-weight: 500; /* Un peso de fuente medio */
  font-size: 0.9rem; /* Tamaño de fuente ligeramente reducido */
  border-bottom: 2px solid transparent; /* Espacio para el indicador activo */
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--color-texto-principal);
  background-color: var(--color-superficie);
}

/* Indicador de página activa: una línea dorada debajo */
.router-link-exact-active {
  color: var(--color-primario);
  font-weight: 700;
  border-bottom-color: var(--color-primario);
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 480px) {
  .sub-header {
    justify-content: flex-start; /* Alinea los enlaces a la izquierda en móviles */
  }
  .nav-link {
    padding: 0 0.75rem;
  }
}
</style>
