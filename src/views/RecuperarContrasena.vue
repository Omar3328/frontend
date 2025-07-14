<template> 
  <div class="recuperar-container">
    <h2>Recuperar Contraseña</h2>
    <p>Introduce tu correo electrónico para recibir un código de recuperación.</p>
    <form @submit.prevent="enviarCodigo">
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        required
      />
      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Enviando...' : 'Enviar código' }}
      </button>
    </form>

    <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const mensaje = ref('')
const error = ref('')
const cargando = ref(false)

const router = useRouter()

const enviarCodigo = async () => {
  mensaje.value = ''
  error.value = ''
  cargando.value = true

  try {
    const res = await axios.post('http://127.0.0.1:8000/api/password/send-code', { email: email.value })
    console.log('Respuesta exitosa:', res)
    mensaje.value = res.data.message
    error.value = ''

    // Guardar el correo si lo necesitas para el siguiente paso
    localStorage.setItem('emailRecuperacion', email.value)

    // Redirigir a la pantalla de restablecer contraseña
    router.push('/restablecer-contrasena')
  } catch (err) {
    console.error('Error en petición:', err)
    error.value = err.response?.data?.message || 'Error al enviar el código.'
  } finally {
    cargando.value = false
  }
}
</script>


<style scoped>
.recuperar-container {
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
  background-color: #2c3e50;
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
