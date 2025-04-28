<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';

const authStore = useAuthStore();
const { logout } = authStore;
</script>

<template>
  <header>
    <nav class="flex justify-between bg-white p-4 shadow-sm items-center">
      <h1 class="font-semibold"><router-link to="/dashboard">Hospital Name</router-link></h1>
      <Button @click="logout()">Logout</Button>
    </nav>
  </header>
</template>
