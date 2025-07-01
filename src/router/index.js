import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Vista1 from '../views/Vista1.vue'
import Vista2 from '../views/Vista2.vue'
import PanelAdmin from '../views/PanelAdmin.vue' // <-- Nueva vista admin

const routes = [
  { path: '/', component: Login },
  { path: '/vista1', component: Vista1 },
  { path: '/vista2', component: Vista2 },
  { path: '/panel-admin', component: PanelAdmin } // <-- Ruta del admin
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
