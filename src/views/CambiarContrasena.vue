<template>
  <div class="form-container">
    <h2>Cambiar Contraseña</h2>
    <form @submit.prevent="cambiarContrasena">
      <input
        v-model="current_password"
        type="password"
        placeholder="Contraseña actual"
        required
        autocomplete="current-password"
      />
      <input
        v-model="new_password"
        type="password"
        placeholder="Nueva contraseña"
        required
        autocomplete="new-password"
      />
      <input
        v-model="new_password_confirmation"
        type="password"
        placeholder="Confirmar nueva contraseña"
        required
        autocomplete="new-password"
      />
      <button type="submit" :disabled="loading">Cambiar Contraseña</button>
    </form>
    <p v-if="mensaje" :class="{'exito': exito, 'error': !exito}">
      {{ mensaje }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const current_password = ref('')
const new_password = ref('')
const new_password_confirmation = ref('')
const mensaje = ref('')
const exito = ref(false)
const loading = ref(false)

async function cambiarContrasena() {
  mensaje.value = ''
  exito.value = false
  loading.value = true

  try {
    const res = await axios.post('/cambiar-contrasena', {
      current_password: current_password.value,
      new_password: new_password.value,
      new_password_confirmation: new_password_confirmation.value,
    })

    exito.value = true
    mensaje.value = res.data.message
  } catch (err) {
    exito.value = false
    mensaje.value = err.response?.data?.message || 'Error al cambiar la contraseña'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
}

input {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  width: 100%;
  background-color: #2c3e50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.exito {
  color: green;
  margin-top: 12px;
  text-align: center;
}

.error {
  color: red;
  margin-top: 12px;
  text-align: center;
}
</style>
