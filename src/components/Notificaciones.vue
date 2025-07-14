<script setup>
import { ref, onUnmounted } from 'vue'
import axios from 'axios'

const mostrarDropdown = ref(false)
const todasLasMultas = ref([])
const multasMostradas = ref([])
const errorMultas = ref(null)

const toggleDropdown = async () => {
  mostrarDropdown.value = !mostrarDropdown.value

  // Solo obtener multas cuando se abre el dropdown
  if (mostrarDropdown.value) {
    await obtenerMultas()
  }
}

const obtenerMultas = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No hay token de autenticación')

    const response = await axios.get('/multas', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    todasLasMultas.value = response.data.filter(m => m.tipo === 'multa' || m.descripcion)
    multasMostradas.value = [...todasLasMultas.value]
    errorMultas.value = null
  } catch (error) {
    errorMultas.value = error.response?.status === 403
      ? '❌ No autorizado para obtener multas (403)'
      : '❌ Error al obtener multas'
    console.error(error)
  }
}
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
          🚨 <strong>Dept ID: {{ multa.departamento_id }}</strong><br />
          {{ multa.descripcion }}<br />
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
.notificaciones-campana {
  position: relative;
  display: inline-block;
  margin-top: 10px;
}

.btn-campana {
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  position: relative;
  color: #fff;
  transition: transform 0.2s ease;
}

.btn-campana:hover {
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: -4px;
  right: -10px;
  background: red;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 120%;
  background: #2c2c2c;
  color: white;
  border-radius: 10px;
  padding: 12px;
  width: 300px;
  max-height: 320px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 999;
}

h3 {
  margin-top: 0;
  font-size: 16px;
  border-bottom: 1px solid #444;
  padding-bottom: 6px;
}

.notificacion {
  padding: 10px;
  border-left: 3px solid #ff6b6b;
  background: #3a3a3a;
  margin-bottom: 10px;
  border-radius: 6px;
  font-size: 14px;
}

.notificacion:last-child {
  margin-bottom: 0;
}

.error {
  background-color: #ff4d4f;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 10px;
  color: white;
  font-weight: bold;
}
</style>
