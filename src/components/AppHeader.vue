<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="logo-link">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
        <h1 class="app-title">PES 6 Balcarce</h1>
      </RouterLink>
    </div>

    <nav class="main-nav">
      <!-- Enlace de Descarga Fijo -->
      <RouterLink to="/descargas" class="nav-link download-link">
        Descargar Parche
        <span v-if="ultimaVersion" class="version-badge">{{ ultimaVersion }}</span>
      </RouterLink>

      <!-- Lógica de Autenticación -->
      <div v-if="user" class="user-section">
        <RouterLink to="/perfil" class="nav-link profile-link">
          <span>Mi Perfil</span>
        </RouterLink>
      </div>
      <div v-else class="auth-buttons">
        <RouterLink to="/login" class="nav-link auth-link login">Iniciar Sesión</RouterLink>
        <RouterLink to="/registro" class="nav-link auth-link register">Registrarse</RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db, auth } from '@/firebase/config'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const ultimaVersion = ref('')
const user = ref(null)

let unsubscribeAuth

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })

  const fetchUltimaVersion = async () => {
    try {
      const q = query(collection(db, 'versiones'), orderBy('fechaPublicacion', 'desc'), limit(1))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        ultimaVersion.value = querySnapshot.docs[0].data().nombre
      }
    } catch (error) {
      console.error('Error al obtener la última versión para el header:', error)
    }
  }
  fetchUltimaVersion()
})

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }
})
</script>

<style scoped>
/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--color-superficie); /* Corregido */
  color: var(--color-texto-principal);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-borde);
  z-index: 1000;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}
.logo {
  height: 35px;
  width: auto;
}
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-primario);
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-link {
  color: var(--color-texto-principal);
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: var(--radio-borde);
  transition: background-color 0.2s;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.download-link {
  background-color: var(--color-primario);
  color: #121212;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.version-badge {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

/* Estilos para la sección de usuario */
.user-section,
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-link {
  border: 2px solid var(--color-primario);
}

.auth-link.register {
  background-color: var(--color-primario);
  color: #121212;
}

.auth-link.login {
  background-color: transparent;
  border: 2px solid var(--color-texto-secundario);
  color: var(--color-texto-secundario);
}
.auth-link.login:hover {
  background-color: var(--color-texto-secundario);
  color: #121212;
}

/* Ocultar texto en móviles para que quepan los botones */
@media (max-width: 768px) {
  .auth-buttons .nav-link span,
  .user-section .nav-link span {
    display: none;
  }
  .auth-buttons .nav-link,
  .user-section .nav-link {
    padding: 0.5rem; /* Hacemos los botones cuadrados */
  }
  .auth-link.login::before {
    content: '→';
    font-size: 1.2rem;
  }
  .auth-link.register::before {
    content: '👤';
    font-size: 1.2rem;
  }
  .profile-link::before {
    content: '⚙️';
    font-size: 1.2rem;
  }
}
</style>
