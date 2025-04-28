import { ref } from 'vue';
import { defineStore } from 'pinia';
import { AuthService } from '@/services/Authservice';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const authService = new AuthService(router);
  const isAuthenticated = ref<boolean>(false);

  function login(username: string, password: string): void {
    const success = authService.authenticateUser(username, password);

    if (success) { 
      isAuthenticated.value = true;
    }
  }

  function logout(): void {
    isAuthenticated.value = false;
    authService.logoutUser();
  }

  return { isAuthenticated, login, logout }
})
