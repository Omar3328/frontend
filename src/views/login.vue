<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="iniciarSesion">
      <input v-model="email" type="email" placeholder="Correo" required autocomplete="username" />
      <input v-model="password" type="password" placeholder="Contraseña" required autocomplete="current-password" />
      <button type="submit">Entrar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <button class="link-button" v-if="estaAutenticado" @click="irCambiarContrasena">
      Cambiar Contraseña
    </button>

   <button class="link-button" @click="router.push('/recuperar-contrasena')">
  ¿Olvidaste tu contraseña?
</button>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const estaAutenticado = ref(!!localStorage.getItem('token'))

const iniciarSesion = async () => {
  try {
    error.value = ''

    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('user_id', response.data.user.id)

    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    estaAutenticado.value = true

    router.push('/vista1')
  } catch (err) {
    error.value = '❌ Credenciales incorrectas'
  }
}

const irCambiarContrasena = () => {
  router.push('/cambiar-contrasena')
}

const irRecuperarContrasena = () => {
  router.push('/recuperar-contrasena')  // Aquí te lleva a la página para recuperar la contraseña
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.login-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
  text-align: center;
}

h2 {
  margin-bottom: 24px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.8rem;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 18px;
  border: 1.8px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #556ee6;
  box-shadow: 0 0 8px rgba(85, 110, 230, 0.3);
}

button {
  width: 100%;
  padding: 14px;
  background: #556ee6;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  box-shadow: 0 4px 10px rgba(85, 110, 230, 0.4);
  margin-bottom: 12px;
}

button:hover {
  background-color: #3b50c4;
  box-shadow: 0 6px 15px rgba(59, 80, 196, 0.6);
}

.link-button {
  background: none;
  border: none;
  color: #556ee6;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
  user-select: none;
  margin-top: 10px;
}

.link-button:hover {
  color: #3b50c4;
}

.error {
  color: #e74c3c;
  margin-top: 20px;
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
