<template>
  <div>
    <!-- NavBar solo si NO estás en login ni en rutas públicas -->
    <NavBar v-if="mostrarNavBar" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

// Oculta NavBar en rutas públicas
const route = useRoute()
const rutasPublicas = ['/', '/recuperar-contrasena', '/restablecer-contrasena']

const mostrarNavBar = computed(() => !rutasPublicas.includes(route.path))
</script>
