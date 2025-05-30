<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const todasLasMultas = ref([])
const multasMostradas = ref([])

let intervaloFetch = null

const obtenerMultas = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/multas')

    // Filtrar solo multas si hay distintos tipos
    todasLasMultas.value = response.data.filter(multa => multa.tipo === 'multa' || multa.descripcion)

    // Mostrar todas las multas al mismo tiempo
    multasMostradas.value = [...todasLasMultas.value]
  } catch (error) {
    console.error('❌ Error al obtener multas:', error)
  }
}

onMounted(() => {
  obtenerMultas()
  intervaloFetch = setInterval(obtenerMultas, 10000) // Actualiza las multas cada 10 segundos
})

onUnmounted(() => {
  clearInterval(intervaloFetch)
})
</script>

<template>
  <main>
    <h2>🔔 Notificaciones de Multas</h2>

    <div v-if="multasMostradas.length > 0">
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
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
  max-height: 80vh;
  overflow-y: auto;
}

.notificacion {
  background-color: #000000;
  border-left: 5px solid rgb(229, 226, 226);
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  font-size: 18px;
  color: white;
  animation: fadein 0.5s ease-in-out;
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
