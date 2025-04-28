<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Message from 'primevue/message';
import Button from 'primevue/button';

const authStore = useAuthStore();
const { login } = authStore;

const username = ref('');
const password = ref('');
</script>

<template>
  <main class="grid place-content-center h-dvh">
    <div class="grid gap-4 p-10 w-96">
      <p data-test-id="page-title" class="text-2xl text-center">Welcome Back</p>
      <p data-test-id="page-description" class="text-center text-gray-500">Please login to access account</p>

      <div data-test-id="username" class="grid gap-2">
        <label for="username">Username</label>
        <InputText id="username" v-model="username" aria-describedby="username-help" />
        <Message size="small" severity="secondary" variant="simple">Enter your username.</Message>
      </div>

      <div data-test-id="password" class="grid gap-2">
        <label for="username">Password</label>
        <Password
        id="password"
          v-model="password"
          :feedback="false"
          aria-describedby="password-help"
          class="w-full"
          input-class="w-full"
        />
        <Message size="small" severity="secondary" variant="simple">Enter your password.</Message>
      </div>

      <Button data-test-id="login-button" class="w-full" @click="login(username, password)"> Login </Button>
    </div>
  </main>
</template>

