<!-- src/components/NavBar.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NotificacionesCampana from './Notificaciones.vue'

const router = useRouter()

const irAVista = (ruta) => {
  router.push(ruta)
}
</script>

<template>
  <nav class="nav-bar">
    <div class="nav-links">
      <button @click="irAVista('/vista1')">Vista 1</button>
      <button @click="irAVista('/vista2')">Vista 2</button>
    </div>

    <div class="nav-campana">
      <NotificacionesCampana />
    </div>
  </nav>
</template>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  font-family: Arial, sans-serif;
}

.nav-links button {
  background: none;
  border: none;
  color: white;
  margin-right: 15px;
  font-size: 16px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-links button:hover {
  background-color: #555;
}

.nav-campana {
  position: relative;
}
</style>
