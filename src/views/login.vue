<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const iniciarSesion = async () => {
  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value
    })

    const { token, user } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    if (user.role === 'admin') {
      router.push('/panel-admin')
    } else {
      router.push('/vista1')
    }
  } catch (err) {
    error.value = '❌ Credenciales incorrectas'
    console.error(err)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">🔐 Iniciar Sesión</h1>
      <form @submit.prevent="iniciarSesion" class="login-form">
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button type="submit">Entrar</button>
        <p class="error-msg" v-if="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-box {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.title {
  text-align: center;
  margin-bottom: 25px;
  color: #2e7d32;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-form input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: 0.2s;
}

.login-form input:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
}

.login-form button {
  padding: 12px;
  font-size: 16px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-form button:hover {
  background-color: #1b5e20;
}

.error-msg {
  color: #c62828;
  font-weight: 500;
  text-align: center;
}
</style>
