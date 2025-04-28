import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';
import { AuthService } from '@/services/Authservice';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

// First, create the mock functions
const mockAuthenticateUser = vi.fn();
const mockLogoutUser = vi.fn();

// Then mock the entire AuthService class
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
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());

    // Get the mocked AuthService instance
    mockAuthService = vi.mocked(AuthService).mock.results[0]?.value || {
      authenticateUser: vi.fn(),
      logoutUser: vi.fn()
    };

    // Reset the mock implementations
    mockAuthService.authenticateUser.mockReset();
    mockAuthService.logoutUser.mockReset();

    // Initialize the store for each test
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
      // Set up the mock to return true for successful auth
      mockAuthenticateUser.mockReturnValue(true);

      // Initialize the store
      const store = useAuthStore();

      // Call the login action
      store.login('testuser', 'password123');

      // Assert authentication state was updated
      expect(store.isAuthenticated).toBe(true);
      expect(mockAuthenticateUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('should keep isAuthenticated as false when authentication fails', () => {
      // Set up the mock to return false for failed auth
      mockAuthenticateUser.mockReturnValue(false);

      // Initialize the store
      const store = useAuthStore();

      // Call the login action
      store.login('invaliduser', 'wrongpassword');

      // Assert authentication state remained false
      expect(store.isAuthenticated).toBe(false);
      expect(mockAuthenticateUser).toHaveBeenCalledWith('invaliduser', 'wrongpassword');
    });
  });

  describe('logout', () => {
    it('should set isAuthenticated to false', () => {
      // Initialize the store
      const store = useAuthStore();

      // Set the initial state to authenticated
      store.isAuthenticated = true;

      // Call the logout action
      store.logout();

      // Assert authentication state was updated
      expect(store.isAuthenticated).toBe(false);
      expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    });
  });
});