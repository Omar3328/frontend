<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import NotificacionesCampana from './Notificaciones.vue'

const router = useRouter()
const route = useRoute()

const mostrarModal = ref(false)
const mensaje = ref('')
const user = ref(null)
const menuAbierto = ref(false)

const irAVista = (ruta) => {
  router.push(ruta)
  menuAbierto.value = false
}

const cerrarSesion = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await axios.post('/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    mensaje.value = '✅ Sesión cerrada con éxito.'
    mostrarModal.value = true

    setTimeout(() => {
      mostrarModal.value = false
      router.push('/')
    }, 2000)
  } catch (error) {
    mensaje.value = '❌ Error al cerrar sesión.'
    mostrarModal.value = true
    console.error(error)
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    mensaje.value = user.value.role === 'admin'
      ? `👋 Bienvenido administrador, ${user.value.name}`
      : `👋 Bienvenido, ${user.value.name}`

    mostrarModal.value = true

    setTimeout(() => {
      mostrarModal.value = false
    }, 2500)
  }
})

const mostrarCampana = computed(() => {
  return user.value && user.value.role !== 'admin'
})
</script>

<template>
  <nav class="nav-bar">
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

      <button class="nav-btn logout" @click="cerrarSesion">Cerrar sesión</button>

      <div class="nav-campana" v-if="mostrarCampana">
        <NotificacionesCampana />
      </div>
    </div>
  </nav>

  <Transition name="slide-fade">
    <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
      <div class="modal" @click.stop>
        <p>{{ mensaje }}</p>
        <button class="modal-btn" @click="cerrarModal">Cerrar</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Navegación */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e2f;
  padding: 15px 30px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-left .logo {
  font-weight: bold;
  font-size: 22px;
}

/* Menú */
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
  background-color: #5e5e8f;
}

.logout {
  background-color: #d9534f;
}

.logout:hover {
  background-color: #c9302c;
}

.nav-campana {
  margin-left: 10px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background-color: #fff;
  color: #333;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  min-width: 300px;
  text-align: center;
}

.modal-btn {
  margin-top: 15px;
  background-color: #3b3b5e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.modal-btn:hover {
  background-color: #5e5e8f;
}

/* Transición modal */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Responsive */
.menu-toggle {
  display: none;
  font-size: 26px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 60px;
    background: #2a2a3d;
    padding: 15px;
    border-radius: 8px;
  }

  .nav-links.abierto {
    display: flex;
  }

  .nav-btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
