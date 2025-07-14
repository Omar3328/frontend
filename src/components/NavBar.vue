<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import NotificacionesCampana from './Notificaciones.vue'

const router = useRouter()
const route = useRoute()

const mostrarModal = ref(false)
const mensaje = ref('')
const user = ref(null)
const menuAbierto = ref(false)

const token = ref(localStorage.getItem('token'))
const sesionValida = ref(!!token.value)

const validarSesionActiva = async () => {
  if (!token.value) {
    sesionValida.value = false
    localStorage.clear()
    router.push('/')
    return
  }

  try {
    await axios.get('/verificar-token', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    sesionValida.value = true
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.setItem('sesion_expirada_pendiente', 'true')
      sesionValida.value = false

      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor inicia sesión de nuevo.',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        localStorage.clear()
        window.location.href = '/'
      })
    }
  }
}

const irAVista = (ruta) => {
  router.push(ruta)
  menuAbierto.value = false
}

const cerrarSesion = async () => {
  try {
    await axios.post('/logout', null, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    localStorage.clear()
    router.push('/')
  } catch (err) {
    alert('❌ Error al cerrar sesión')
  }
}

onMounted(() => {
  validarSesionActiva()

  token.value = localStorage.getItem('token')
  const userData = localStorage.getItem('user')

  if (token.value && userData) {
    user.value = JSON.parse(userData)
    sesionValida.value = true
    setTimeout(() => {
      mostrarModal.value = false
    }, 2500)
  }

  setInterval(validarSesionActiva, 15000)
})

const mostrarCampana = computed(() => {
  return user.value && user.value.role !== 'admin'
})
</script>

<template>
  <nav class="nav-bar" v-if="sesionValida">
    <div class="nav-left">
      <span class="logo">🐾</span>
    </div>

    <button class="menu-toggle" @click="menuAbierto = !menuAbierto">☰</button>

    <div class="nav-links" :class="{ abierto: menuAbierto }">
      <template v-if="user && user.role !== 'admin'">
        <button class="nav-btn" @click="irAVista('/vista1')">Vista 1</button>
        <button class="nav-btn" @click="irAVista('/vista2')">Vista 2</button>
      </template>

      <template v-if="user && user.role === 'admin'">
        <button class="nav-btn" @click="irAVista('/panel-admin')">Panel Admin</button>
      </template>

      <template v-if="user">
        <button class="nav-btn cambiar" @click="irAVista('/cambiar-contrasena')">Cambiar Contraseña</button>
      </template>

      <button class="nav-btn logout" @click="cerrarSesion">Cerrar sesión</button>

      <div class="nav-campana" v-if="mostrarCampana">
        <NotificacionesCampana />
      </div>
    </div>
  </nav>
</template>


<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e2f;
  padding: 15px 30px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.logo {
  font-weight: bold;
  font-size: 22px;
  cursor: pointer;
}
.menu-toggle {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  display: none;
}
.nav-links {
  display: flex;
  gap: 12px;
  align-items: center;
}
.nav-btn {
  background-color: #3b3b5e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.nav-btn:hover {
  background-color: #575780;
}
.logout {
  background-color: #d9534f;
}
.logout:hover {
  background-color: #c9302c;
}
.cambiar {
  background-color: #2d9cdb;
}
.cambiar:hover {
  background-color: #1c87c9;
}
.nav-campana {
  margin-left: 10px;
}
.sesiones-lista {
  margin: 20px auto;
  padding: 20px;
  max-width: 600px;
  background: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.sesiones-lista h3 {
  margin-bottom: 15px;
  color: #3b3b5e;
  text-align: center;
}
.sesiones-lista ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sesiones-lista li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color: #333;
}
.sesiones-lista li:last-child {
  border-bottom: none;
}
.sesiones-lista button {
  background: #c9302c;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.sesiones-lista button:hover {
  background: #a5271c;
}
</style>
