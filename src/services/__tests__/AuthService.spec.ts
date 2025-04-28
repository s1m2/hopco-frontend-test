import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/services/Authservice';  
import { MATTER_USER, NAIROBI_USER } from '@/constants/user';
import { Router } from 'vue-router';

describe('AuthService', () => {
  let mockRouter: Router;
  let authService: AuthService;

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
    } as unknown as Router;

    authService = new AuthService(mockRouter);
    localStorage.clear();
  });

  describe('authenticateUser', () => {
    it('should authenticate valid users and navigate to dashboard', () => {
      const username = MATTER_USER;
      const password = 'somepassword';

      const result = authService.authenticateUser(username, password);

      expect(result).toBe(true);
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ username }));
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard' });
    });

    it('should authenticate valid users and navigate to dashboard (NAIROBI_USER)', () => {
      const username = NAIROBI_USER;
      const password = 'somepassword';

      const result = authService.authenticateUser(username, password);

      expect(result).toBe(true);
      expect(localStorage.getItem('user')).toBe(JSON.stringify({ username }));
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard' });
    });

    it('should return false for invalid users and not change the route', () => {
      const username = 'invalid_user';
      const password = 'wrongpassword';

      const result = authService.authenticateUser(username, password);
      expect(result).toBe(false);
      expect(localStorage.getItem('user')).toBeNull();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe('logoutUser', () => {
    it('should navigate to login page and clear localStorage on logout', () => {
      authService.logoutUser();
      expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' });
      expect(localStorage.length).toBe(0);
    });
  });
});
