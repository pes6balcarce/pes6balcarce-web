// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'

// Vistas Públicas
import HomeView from '../views/HomeView.vue'
import NoticiasView from '../views/NoticiasView.vue'
import NoticiaDetalleView from '../views/NoticiaDetalleView.vue'
import DescargasView from '@/views/DescargasView.vue'
import HistorialVersionesView from '@/views/HistorialVersionesView.vue' // <-- IMPORTAR NUEVA VISTA

// Vistas de Autenticación y Perfil de Usuario
import RegistroView from '@/views/RegistroView.vue'
import LoginView from '@/views/LoginView.vue'
import PerfilView from '@/views/PerfilView.vue'

// Vistas y Layout del Admin
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminEncuestasView from '@/views/admin/AdminEncuestasView.vue'
import AdminJugadoresView from '@/views/admin/AdminJugadoresView.vue'
import AdminNoticiasView from '@/views/admin/AdminNoticiasView.vue'
import AdminPatrocinadoresView from '@/views/admin/AdminPatrocinadoresView.vue' // <-- ESTA ES LA LÍNEA QUE FALTABA
import AdminVersionesView from '@/views/admin/AdminVersionesView.vue' // <-- Importación para la nueva vista de admin

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Rutas Públicas y de Usuario ---
    { path: '/', name: 'home', component: HomeView },
    { path: '/descargas', name: 'descargas', component: DescargasView },
    {
      path: '/descargas/historial',
      name: 'historial-versiones',
      component: HistorialVersionesView,
    },
    { path: '/noticias', name: 'noticias', component: NoticiasView },
    { path: '/noticias/:id', name: 'noticia-detalle', component: NoticiaDetalleView, props: true },
    { path: '/registro', name: 'registro', component: RegistroView },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
      meta: { requiresAuth: true },
    },

    // --- Rutas de Administración ---
    { path: '/admin/login', name: 'admin-login', component: AdminLoginView },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView },
        { path: 'encuestas', name: 'admin-encuestas', component: AdminEncuestasView },
        { path: 'jugadores', name: 'admin-jugadores', component: AdminJugadoresView },
        { path: 'noticias', name: 'admin-noticias', component: AdminNoticiasView },
        {
          path: 'patrocinadores',
          name: 'admin-patrocinadores',
          component: AdminPatrocinadoresView,
        },
        { path: 'versiones', name: 'admin-versiones', component: AdminVersionesView },
      ],
    },
  ],
})

// El guardián de rutas se queda exactamente igual
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener()
        resolve(user)
      },
      reject,
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAdminRoute = to.path.startsWith('/admin/')
  const currentUser = await getCurrentUser()

  if (requiresAuth && !currentUser) {
    if (isAdminRoute) {
      next({ name: 'admin-login' })
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
