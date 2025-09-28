<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'

const email = ref('')
const password = ref('')
const errorMsg = ref(null)
const router = useRouter()

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/') // Redirige a la página de inicio tras un login exitoso
  } catch (error) {
    errorMsg.value = 'Email o contraseña incorrectos.'
    console.error("Error de login:", error);
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit" class="btn-principal">Ingresar</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<style scoped>
.form-container { max-width: 450px; margin: 3rem auto; padding: 2rem; background-color: var(--color-superficie); border-radius: var(--radio-borde); }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
input { width: 100%; padding: 0.8rem; background-color: var(--color-fondo); border: 1px solid var(--color-texto-secundario); color: var(--color-texto-principal); border-radius: 4px; }
.btn-principal { width: 100%; padding: 0.8rem; background-color: var(--color-primario); color: var(--color-fondo); border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1rem; }
.error { color: red; margin-top: 1rem; text-align: center;}
</style>