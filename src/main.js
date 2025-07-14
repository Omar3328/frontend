import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

const token = localStorage.getItem('token')

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

axios.interceptors.response.use(
  response => response,
  async error => {
    const isLoginRoute = window.location.pathname === '/'

    if (
      error.response &&
      error.response.status === 401 &&
      !isLoginRoute &&
      !window.__sessionExpiredHandled
    ) {
      window.__sessionExpiredHandled = true

      await Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor inicia sesión de nuevo.',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false
      })

      localStorage.clear()
      window.location.href = '/'
    }

    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(router)
app.mount('#app')
