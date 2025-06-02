<!-- src/components/NotificacionesCampana.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const mostrarDropdown = ref(false)
const todasLasMultas = ref([])
const multasMostradas = ref([])

let intervaloFetch = null

const toggleDropdown = () => {
  mostrarDropdown.value = !mostrarDropdown.value
}

const obtenerMultas = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/multas')
    todasLasMultas.value = response.data.filter(multa => multa.tipo === 'multa' || multa.descripcion)
    multasMostradas.value = [...todasLasMultas.value]
  } catch (error) {
    console.error('❌ Error al obtener multas:', error)
  }
}

onMounted(() => {
  obtenerMultas()
  intervaloFetch = setInterval(obtenerMultas, 10000)
})

onUnmounted(() => {
  clearInterval(intervaloFetch)
})
</script>

<template>
  <div class="notificaciones-campana">
    <button class="btn-campana" @click="toggleDropdown" aria-label="Mostrar notificaciones">
      🔔
      <span v-if="multasMostradas.length > 0" class="badge">{{ multasMostradas.length }}</span>
    </button>

    <div v-if="mostrarDropdown" class="dropdown">
      <h3>🔔 Notificaciones de Multas</h3>
      <div v-if="multasMostradas.length > 0" class="notificaciones-lista">
        <div
          class="notificacion"
          v-for="(multa, i) in multasMostradas"
          :key="i"
        >
          🚨 <strong>Dept ID: {{ multa.departamento_id }}</strong> - {{ multa.descripcion }}
        </div>
      </div>
      <div v-else>
        <p>✅ No hay multas registradas.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notificaciones-campana {
  position: relative;
  display: inline-block;
}

.btn-campana {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: relative;
}

.badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background: red;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
}

.dropdown {
  position: absolute;
  right: 0;
  margin-top: 10px;
  background: #222;
  color: white;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  z-index: 1000;
}

.notificacion {
  border-left: 4px solid #eee;
  padding: 8px 10px;
  margin-bottom: 8px;
  font-size: 14px;
}

.notificacion:last-child {
  margin-bottom: 0;
}
</style>
