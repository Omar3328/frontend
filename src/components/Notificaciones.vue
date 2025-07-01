<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const mostrarDropdown = ref(false)
const todasLasMultas = ref([])
const multasMostradas = ref([])
const errorMultas = ref(null)  // Para mostrar errores

let intervaloFetch = null

const toggleDropdown = () => {
  mostrarDropdown.value = !mostrarDropdown.value
}

const obtenerMultas = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const response = await axios.get('/multas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Filtra multas que tengan tipo 'multa' o descripción
    todasLasMultas.value = response.data.filter(multa => multa.tipo === 'multa' || multa.descripcion)
    multasMostradas.value = [...todasLasMultas.value]

    if (multasMostradas.value.length > 0) {
      mostrarDropdown.value = true
    }
    errorMultas.value = null
  } catch (error) {
    errorMultas.value = error.response?.status === 403
      ? '❌ No autorizado para obtener multas (403)'
      : '❌ Error al obtener multas'
    console.error(error)
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
      
      <div v-if="errorMultas" class="error">{{ errorMultas }}</div>

      <div v-if="multasMostradas.length > 0 && !errorMultas" class="notificaciones-lista">
        <div
          class="notificacion"
          v-for="(multa, i) in multasMostradas"
          :key="i"
        >
          🚨 <strong>Dept ID: {{ multa.departamento_id }}</strong> - {{ multa.descripcion }}<br />
          💵 <strong>Valor:</strong> ${{ multa.valor }}
        </div>
      </div>

      <div v-else-if="!errorMultas">
        <p>✅ No hay multas registradas.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  background-color: #ff4d4f;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 10px;
  color: white;
  font-weight: bold;
}
.notificaciones-campana {
  position: relative;
  display: inline-block;
  margin-top: 20px;
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
  top: 100%;
  margin-top: 5px;
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
