import type { Router } from 'vue-router';
import { MATTER_USER, NAIROBI_USER } from '@/constants/user';

export class AuthService {
  constructor(private router: Router) { }

  authenticateUser(username: string, password: string): boolean {
    if (username === MATTER_USER || username === NAIROBI_USER) {
      localStorage.setItem('user', JSON.stringify({ username }));
      this.router.push({ name: 'dashboard' });
      return true;
    }
    return false;
  }

  logoutUser(): void {
    this.router.push({ name: 'login' });
    localStorage.clear();
  }
}