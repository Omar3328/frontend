<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div>
    <NavBar />
    <main style="padding: 20px;">
      <router-view />
    </main>
  </div>
</template>
