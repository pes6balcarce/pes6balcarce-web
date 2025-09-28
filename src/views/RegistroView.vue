<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

const username = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref(null)
const router = useRouter()

const registrar = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // 1. Actualizamos el perfil de Firebase Auth para que tenga un nombre visible
    await updateProfile(user, {
      displayName: username.value
    })

    // 2. Creamos un documento en nuestra base de datos 'users' para guardar datos extra como las medallas
    await setDoc(doc(db, "users", user.uid), {
      username: username.value,
      medals: [] // Empezamos con un array de medallas vacío
    });

    // 3. Redirigimos al usuario a la página de inicio
    router.push('/')

  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMsg.value = 'Este correo electrónico ya está en uso.'
        break;
      case 'auth/weak-password':
        errorMsg.value = 'La contraseña debe tener al menos 6 caracteres.'
        break;
      default:
        errorMsg.value = 'Hubo un error al crear la cuenta.'
    }
    console.error("Error de registro:", error);
  }
}
</script>

<template>
  <div class="form-container">
    <h2>Crear una Cuenta</h2>
    <p>El registro es opcional, pero te permite tener un perfil y ganar medallas.</p>
    <form @submit.prevent="registrar">
      <div class="form-group">
        <label>Nombre de Usuario</label>
        <input type="text" v-model="username" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit" class="btn-principal">Registrarse</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<style scoped>
.form-container { max-width: 450px; margin: 3rem auto; padding: 2rem; background-color: var(--color-superficie); border-radius: var(--radio-borde); }
.form-container p { color: var(--color-texto-secundario); margin-bottom: 2rem; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
input { width: 100%; padding: 0.8rem; background-color: var(--color-fondo); border: 1px solid var(--color-texto-secundario); color: var(--color-texto-principal); border-radius: 4px; }
.btn-principal { width: 100%; padding: 0.8rem; background-color: var(--color-primario); color: var(--color-fondo); border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 1rem; }
.error { color: red; margin-top: 1rem; text-align: center;}
</style>