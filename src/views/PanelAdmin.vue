<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Campos del formulario
const cargando = ref(false)
const departamentoId = ref('')
const descripcion = ref('')
const valor = ref('')

// Estado para mostrar resultados o errores
const resultados = ref([])
const mostrarModal = ref(false)

// Función para guardar multa
const guardarMulta = async () => {
  if (!departamentoId.value || !descripcion.value || !valor.value) {
    agregarResultado('⚠️ Todos los campos son obligatorios.')
    return
  }

  let valorLimpio = valor.value
    .replace(/\./g, '')   
    .replace(',', '.')   
  if (isNaN(parseFloat(valorLimpio))) {
    agregarResultado('⚠️ El valor debe ser un número válido.')
    return
  }

  cargando.value = true
  try {
    await axios.post('http://127.0.0.1:8000/api/multas', {
      departamento_id: departamentoId.value,
      descripcion: descripcion.value,
      valor: parseFloat(valorLimpio)
    })
    agregarResultado('✅ Multa guardada correctamente.')
    departamentoId.value = ''
    descripcion.value = ''
    valor.value = ''
  } catch {
    agregarResultado('❌ Error al guardar la multa.')
  } finally {
    cargando.value = false
  }
}

const agregarResultado = (mensaje) => {
  resultados.value.push(mensaje)
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  resultados.value = []
}
</script>

<template>
  <div class="panel-admin">
    <h1>📋 Panel de Administración</h1>

    <form @submit.prevent="guardarMulta" class="formulario">
      <div>
        <label for="departamento">ID Departamento:</label>
        <input id="departamento" v-model="departamentoId" type="number" required />
      </div>

      <div>
        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" v-model="descripcion" required></textarea>
      </div>

      <div>
        <label for="valor">Valor de la Multa ($):</label>
        <input id="valor" v-model="valor" type="text" placeholder="Ejemplo: 2.700,50" required />
      </div>

      <button type="submit" :disabled="cargando" class="guardar-btn">
        <span v-if="!cargando">Guardar Multa</span>
        <span v-else class="loader">Cargando...</span>
      </button>
    </form>

    <Transition name="slide-fade">
      <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
        <div class="modal" @click.stop>
          <ol>
            <li v-for="(msg, index) in resultados" :key="index">{{ msg }}</li>
          </ol>
          <button @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.panel-admin {
  max-width: 600px;
  margin: auto;
  padding: 30px;
  background-color: #f4f4f4;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2e7d32;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.formulario input,
.formulario textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.guardar-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.guardar-btn[disabled] {
  background-color: #aaa;
  cursor: not-allowed;
}

.loader {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
