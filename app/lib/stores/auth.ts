import { atom } from 'nanostores';
import { authService, type AuthUser } from '../supabase/auth';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authStore = atom<AuthState>(initialState);

// Initialize auth state
let authInitialized = false;

export async function initializeAuth() {
  if (authInitialized) {
    return;
  }

  authInitialized = true;

  try {
    // Check for existing session
    const user = await authService.getCurrentUser();
    
    authStore.set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });

    // Listen for auth state changes
    authService.onAuthStateChange((user) => {
      authStore.set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    });
  } catch (error) {
    console.error('Failed to initialize auth:', error);
    authStore.set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }
}

export function setAuthLoading(loading: boolean) {
  const currentState = authStore.get();
  authStore.set({
    ...currentState,
    isLoading: loading,
  });
}

export function setAuthUser(user: AuthUser | null) {
  authStore.set({
    user,
    isAuthenticated: !!user,
    isLoading: false,
  });
}

export function clearAuth() {
  authStore.set({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
}

