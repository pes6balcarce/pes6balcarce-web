<!-- src/components/SubHeader.vue -->
<template>
  <nav class="sub-header">
    <div class="nav-links">
      <RouterLink to="/" class="nav-link">Inicio</RouterLink>
      <RouterLink to="/noticias" class="nav-link">Noticias</RouterLink>
      <RouterLink to="/descargas" class="nav-link">Descargas</RouterLink>
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
}

.nav-links {
  display: flex;
  height: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  color: var(--color-texto-secundario);
  text-decoration: none;
  font-weight: 500; /* Un peso de fuente medio */
  font-size: 0.95rem;
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
</style>
