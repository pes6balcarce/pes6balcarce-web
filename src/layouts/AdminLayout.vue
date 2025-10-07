<script setup>
import { useRouter, RouterLink, RouterView } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

const router = useRouter()

const logout = () => {
  signOut(auth).then(() => {
    router.push('/admin/login')
  })
}
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h2>PES6 Admin</h2>
      <nav>
        <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
        <RouterLink to="/admin/noticias">Gestionar Noticias</RouterLink>
        <!-- <-- AÑADIR ESTE ENLACE -->
        <RouterLink to="/admin/encuestas">Gestionar Encuestas</RouterLink>
        <RouterLink to="/admin/jugadores">Gestionar Jugadores</RouterLink>
        <RouterLink to="/admin/versiones">Versiones del Parche</RouterLink>
      </nav>
      <button @click="logout" class="logout-btn">Cerrar Sesión</button>
    </aside>
    <main class="admin-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-sidebar {
  width: 250px;
  background-color: var(--color-superficie);
  padding: 2rem;
  display: flex;
  flex-direction: column;
}
.admin-sidebar h2 {
  color: var(--color-primario);
  text-align: center;
  margin-bottom: 2rem;
}
.admin-sidebar nav {
  display: flex;
  flex-direction: column;
}
.admin-sidebar nav a {
  color: var(--color-texto-principal);
  text-decoration: none;
  padding: 1rem;
  border-radius: var(--radio-borde);
  margin-bottom: 0.5rem;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.admin-sidebar nav a:hover {
  background-color: #333;
}
.admin-sidebar nav a.router-link-exact-active {
  background-color: var(--color-primario);
  color: var(--color-fondo);
}
.logout-btn {
  margin-top: auto;
  padding: 0.7rem;
  background-color: #c53030;
  color: white;
  border: none;
  border-radius: var(--radio-borde);
  cursor: pointer;
}
.admin-content {
  flex: 1;
  padding: 2rem;
  background-color: var(--color-fondo);
  overflow-x: hidden; /* Evita desbordamiento horizontal */
}

/* --- INICIO DE ESTILOS RESPONSIVE --- */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column; /* Apila el menú y el contenido */
  }
  .admin-sidebar {
    width: 100%;
    height: auto;
    flex-direction: row; /* Pone los elementos del menú en horizontal */
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
  }
  .admin-sidebar h2 {
    margin-bottom: 0;
    font-size: 1.2rem;
  }
  .admin-sidebar nav {
    flex-direction: row; /* Los enlaces de navegación en fila */
    order: 2; /* Cambia el orden para que el botón de logout aparezca al final */
    display: none; /* Ocultamos la navegación principal en móvil por simplicidad, se puede mejorar con un menú hamburguesa */
  }
  .logout-btn {
    margin-top: 0;
    order: 3;
  }
  .admin-content {
    padding: 1rem;
  }
}
/* --- FIN DE ESTILOS RESPONSIVE --- */
</style>
