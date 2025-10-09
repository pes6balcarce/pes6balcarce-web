<template>
  <div id="app-wrapper">
    <!-- Cabecera y sub-cabecera fijas en la parte superior -->
    <AppHeader />
    <SubHeader />

    <!-- 
      Este es el nuevo contenedor principal que utiliza CSS Grid.
      Se divide en un área de contenido principal y una barra lateral derecha.
    -->
    <div class="main-layout-grid">
      <!-- El contenido de la página actual (Home, Noticias, etc.) se renderiza aquí -->
      <main class="main-content">
        <RouterView />
      </main>

      <!-- 
        La barra lateral (sidebar) para el banner vertical.
        Es semánticamente correcto usar la etiqueta <aside>.
        Se mostrará u ocultará con CSS según el tamaño de la pantalla.
      -->
      <aside class="sidebar-right">
        <BannerVertical />
      </aside>
    </div>

    <!-- 
      El banner horizontal (leaderboard) se puede colocar después del contenido principal,
      antes del pie de página.
    -->
    <BannerPatrocinador />

    <!-- Pie de página al final de todo -->
    <AppFooter />
  </div>
</template>

<script setup>
// --- Importaciones Necesarias ---
// RouterView es esencial para que el sistema de rutas de Vue funcione.
import { RouterView } from 'vue-router'

// Componentes del layout principal de la aplicación.
import AppHeader from '@/components/AppHeader.vue'
import SubHeader from '@/components/SubHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

// Componentes de publicidad.
import BannerPatrocinador from '@/components/BannerPatrocinador.vue' // Banner horizontal
import BannerVertical from '@/components/BannerVertical.vue' // Nuevo banner vertical
</script>

<style scoped>
/* 
  Estilos específicos para el layout de App.vue.
  'scoped' asegura que estos estilos no afectarán a otros componentes.
*/

/* Contenedor global de la aplicación */
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el wrapper ocupe al menos toda la altura de la pantalla */
}

/* El grid que define la estructura del contenido y la barra lateral */
.main-layout-grid {
  display: grid;
  width: 100%;
  max-width: 1440px; /* Ancho máximo para mantener la legibilidad en pantallas muy grandes */
  margin: 0 auto; /* Centra el layout en la página */
  padding: 2rem 1.5rem; /* Espaciado interno */
  gap: 2rem; /* Espacio entre el contenido y la barra lateral */
  flex-grow: 1; /* Permite que este contenedor crezca para empujar el footer hacia abajo */
}

/* --- ESTILOS PARA ESCRITORIO (Desktop First) --- */

/* Por defecto, definimos 2 columnas: contenido flexible (1fr) y barra lateral de ancho fijo (214px) */
.main-layout-grid {
  grid-template-columns: 1fr 214px;
}

.main-content {
  min-width: 0; /* Un truco de CSS para prevenir que elementos internos desborden el grid */
}

.sidebar-right {
  position: sticky; /* Fija la barra lateral para que no se pierda al hacer scroll */
  /* Se alinea debajo de los headers. El '2rem' es por el padding del .main-layout-grid */
  top: calc(var(--header-height) + var(--subheader-height) + 2rem);
  height: fit-content; /* Necesario para que 'position: sticky' funcione correctamente */
}

/* --- MEDIA QUERY PARA RESPONSIVE --- */

/* Cuando la pantalla sea de 1024px o menos (tablets y móviles)... */
@media (max-width: 1024px) {
  .main-layout-grid {
    /* ...cambiamos el grid a una sola columna para que el contenido ocupe todo el ancho. */
    grid-template-columns: 1fr;
    padding: 1.5rem 1rem; /* Reducimos un poco el padding en pantallas pequeñas */
  }

  .sidebar-right {
    /* ...y ocultamos completamente la barra lateral. */
    display: none;
  }
}
</style>
