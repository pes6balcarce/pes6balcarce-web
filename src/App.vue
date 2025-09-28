<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

const usuarioLogueado = ref(null)
const router = useRouter()

// onAuthStateChanged es un "oyente" que se activa cada vez que un usuario inicia o cierra sesión
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // El usuario está logueado
      usuarioLogueado.value = user;
    } else {
      // El usuario no está logueado
      usuarioLogueado.value = null;
    }
  });
})

const cerrarSesion = async () => {
  await signOut(auth)
  router.push('/') // Redirige a la página de inicio tras cerrar sesión
}
</script>

<template>
  <header>
    <div class="wrapper">
      <RouterLink to="/">
        <img src="@/assets/images/logo.png" alt="Logo PES 6 Balcarce" class="logo-img" />
      </RouterLink>
      <nav>
        <!-- Navegación Pública -->
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/noticias">Noticias</RouterLink>
        <RouterLink to="/once-ideal">11 Ideal</RouterLink>

        <!-- Navegación Condicional -->
        <template v-if="usuarioLogueado">
          <RouterLink to="/perfil">Mi Perfil</RouterLink>
          <a href="#" @click.prevent="cerrarSesion">Cerrar Sesión</a>
        </template>
        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/registro">Registro</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>© 2025 PES 6 Balcarce Web. Todos los derechos reservados.</p>
  </footer>
</template>

<style scoped>
#app { display: flex; flex-direction: column; min-height: 100vh; }
header { background-color: var(--color-superficie); padding: 1rem 2rem; border-bottom: 2px solid var(--color-primario); }
.wrapper { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.logo-img { height: 60px; width: auto; display: block; }
nav { display: flex; align-items: center; } /* Añadido para mejor alineación */
nav a { color: var(--color-texto-principal); margin: 0 15px; text-decoration: none; font-weight: bold; font-size: 1.1rem; transition: color 0.3s ease; white-space: nowrap; } /* Añadido nowrap */
nav a:hover { color: var(--color-primario); }
nav a.router-link-exact-active { color: var(--color-primario); }
main { flex: 1; width: 100%; max-width: 1200px; margin: 0 auto; padding: 2rem; }
footer { background-color: var(--color-superficie); color: var(--color-texto-secundario); text-align: center; padding: 1.5rem; margin-top: auto; }

/* --- INICIO DE ESTILOS RESPONSIVE --- */
/* Para pantallas de 768px o menos (tablets y celulares) */
@media (max-width: 768px) {
  header { padding: 1rem; }
  .wrapper {
    flex-direction: column; /* Apila el logo y la navegación verticalmente */
    gap: 1rem;
  }
  nav {
    flex-wrap: wrap; /* Permite que los enlaces pasen a la siguiente línea si no caben */
    justify-content: center; /* Centra los enlaces */
  }
  nav a {
    margin: 0 10px; /* Reduce el espacio entre enlaces */
    font-size: 1rem;
  }
  main { padding: 1rem; }
}
/* --- FIN DE ESTILOS RESPONSIVE --- */
</style>