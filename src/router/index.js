import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Vista1 from '../views/Vista1.vue'
import Vista2 from '../views/Vista2.vue'
import PanelAdmin from '../views/PanelAdmin.vue'
import CambiarContrasena from '../views/CambiarContrasena.vue'
import RecuperarContrasena from '../views/RecuperarContrasena.vue'
import RestablecerContrasena from '../views/RestablecerContrasena.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/recuperar-contrasena',
    name: 'RecuperarContrasena',
    component: RecuperarContrasena,
    meta: { public: true }
  },
  {
    path: '/restablecer-contrasena',
    name: 'RestablecerContrasena',
    component: RestablecerContrasena,
    meta: { public: true }
  },
  {
    path: '/vista1',
    name: 'Vista1',
    component: Vista1
  },
  {
    path: '/vista2',
    name: 'Vista2',
    component: Vista2
  },
  {
    path: '/panel-admin',
    name: 'PanelAdmin',
    component: PanelAdmin
  },
  {
    path: '/cambiar-contrasena',
    name: 'CambiarContrasena',
    component: CambiarContrasena
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si la ruta NO es pública y no hay token, redirige al login
  if (!to.meta.public && !token) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
