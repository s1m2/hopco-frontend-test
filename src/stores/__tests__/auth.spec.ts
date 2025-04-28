import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';
import { AuthService } from '@/services/Authservice';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

const mockAuthenticateUser = vi.fn();
const mockLogoutUser = vi.fn();

vi.mock('@/services/Authservice', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    authenticateUser: mockAuthenticateUser,
    logoutUser: mockLogoutUser
  }))
}));

describe('useAuthStore', () => {
  let store;
  let mockAuthService;

  beforeEach(() => {
    setActivePinia(createPinia());

    mockAuthService = vi.mocked(AuthService).mock.results[0]?.value || {
      authenticateUser: vi.fn(),
      logoutUser: vi.fn()
    };

    mockAuthService.authenticateUser.mockReset();
    mockAuthService.logoutUser.mockReset();

    store = useAuthStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with isAuthenticated set to false', () => {
      expect(store.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should set isAuthenticated to true when authentication is successful', () => {
      mockAuthenticateUser.mockReturnValue(true);

      const store = useAuthStore();
      store.login('testuser', 'password123');
      expect(store.isAuthenticated).toBe(true);
      expect(mockAuthenticateUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('should keep isAuthenticated as false when authentication fails', () => {
      mockAuthenticateUser.mockReturnValue(false);
      const store = useAuthStore();
      store.login('invaliduser', 'wrongpassword');
      expect(store.isAuthenticated).toBe(false);
      expect(mockAuthenticateUser).toHaveBeenCalledWith('invaliduser', 'wrongpassword');
    });
  });

  describe('logout', () => {
    it('should set isAuthenticated to false', () => {
      const store = useAuthStore();
      store.isAuthenticated = true;
      store.logout();
      expect(store.isAuthenticated).toBe(false);
      expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    });
  });
});