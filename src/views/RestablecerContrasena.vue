<template>
  <div class="reset-container">
    <h2>Restablecer Contraseña</h2>
    <form @submit.prevent="restablecer" autocomplete="off">
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        required
        autocomplete="off"
      />
      <input
        v-model="code"
        type="text"
        placeholder="Código de recuperación"
        required
        autocomplete="off"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Nueva contraseña"
        required
        autocomplete="new-password"
      />
      <input
        v-model="password_confirmation"
        type="password"
        placeholder="Confirmar contraseña"
        required
        autocomplete="new-password"
      />
      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Restableciendo...' : 'Restablecer' }}
      </button>
    </form>
    <p v-if="mensaje" :class="mensajeClass">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref(route.query.email || '')
const code = ref('')
const password = ref('')
const password_confirmation = ref('')
const mensaje = ref('')
const error = ref(false)
const cargando = ref(false)

const mensajeClass = computed(() => (error.value ? 'error' : 'mensaje'))

const restablecer = async () => {
  mensaje.value = ''
  error.value = false
  cargando.value = true

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/password/reset-code', {
      email: email.value,
      code: code.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    mensaje.value = res.data.message

    // Limpiar campos
    code.value = ''
    password.value = ''
    password_confirmation.value = ''

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 2000)

  } catch (err) {
    error.value = true
    mensaje.value = err.response?.data?.message || 'Error al restablecer la contraseña.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.reset-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}
input {
  width: 100%;
  padding: 12px;
  margin: 15px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}
button {
  padding: 12px;
  width: 100%;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.mensaje {
  margin-top: 15px;
  color: green;
}
.error {
  margin-top: 15px;
  color: red;
}
</style>
