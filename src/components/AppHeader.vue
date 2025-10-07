<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-content">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
      <h1 class="app-title">PES 6 Balcarce</h1>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed; /* Fija el header en la parte superior */
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--color-primario);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center; /* Centra el contenido horizontalmente */
  padding: 0 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000; /* Asegura que esté por encima de todo */
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  height: 35px; /* Ajusta el tamaño de tu logo */
  width: auto;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0; /* Resetea el margen del h1 */
}
</style>
