<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMsg = ref(null)
const router = useRouter()

const login = () => {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Login exitoso, redirigir al panel
      router.push('/admin/dashboard')
    })
    .catch((error) => {
      // Manejar errores
      errorMsg.value = 'Email o contraseña incorrectos.'
      console.error("Error de autenticación:", error);
    });
}
</script>

<template>
  <div class="login-container">
    <h2>Panel de Administración - Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Ingresar</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: var(--color-superficie);
  border-radius: var(--radio-borde);
}
.form-group {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  background-color: var(--color-fondo);
  border: 1px solid var(--color-texto-secundario);
  color: var(--color-texto-principal);
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 0.7rem;
  background-color: var(--color-primario);
  color: var(--color-fondo);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>