<!-- src/components/FormularioMulta.vue -->
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const cargando = ref(false)
const departamentoId = ref('')
const descripcion = ref('')
const valor = ref('')

const resultados = ref([])
const mostrarModal = ref(false)

const guardarMulta = async () => {
  if (!departamentoId.value || !descripcion.value || !valor.value) {
    agregarResultado('⚠️ Todos los campos son obligatorios.')
    return
  }

  let valorLimpio = valor.value
    .replace(/\./g, '')  // quitar puntos (miles)
    .replace(',', '.')   // cambiar coma decimal por punto

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

function agregarResultado(mensaje) {
  resultados.value.push(mensaje)
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  resultados.value = []
}
</script>

<template>
  <div class="vista">
    <h1>Registrar Multa</h1>

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
.vista {
  max-width: 500px;
  margin: auto;
  padding: 20px;
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
}
.modal {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
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
