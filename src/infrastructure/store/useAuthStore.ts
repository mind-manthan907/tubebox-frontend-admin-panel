import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginInput, RegisterInput } from '@/domain/auth/auth.schema';
import { authService } from '@/services/auth.service';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isCheckingAuth: boolean;
    error: string | null;

    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    updateUser: (user: User) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isCheckingAuth: true,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            updateUser: (user) => set({ user }),
            setError: (error) => set({ error }),

            login: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(data);
                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false
                        });
                    } else {
                        throw new Error(response.message || 'Login failed');
                    }
                } catch (error) {
                    // error could be the API response object if rejected by axios interceptor
                    const errorMessage = (error instanceof Error) ? error.message : 'Authentication failed';
                    set({ error: errorMessage, isLoading: false });
                    throw new Error(errorMessage);
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(data);
                    if (response.success) {
                        set({ isLoading: false });
                    } else {
                        // If there are field errors, throw the whole response so the hook can use them
                        if (response.errors && response.errors.length > 0) {
                            throw response;
                        }
                        throw new Error(response.message || 'Registration failed');
                    }
                } catch (error) {
                    // Handle both Error objects and ApiResponse objects
                    let errorMessage = 'Registration failed';
                    if (error instanceof Error) {
                        errorMessage = error.message;
                    } else if (typeof error === 'object' && error !== null && 'message' in error) {
                        errorMessage = (error as { message: string }).message;
                    }
                    
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await authService.logout();
                } finally {
                    // Clear all local storage to be safe and reset state
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    set({ isAuthenticated: false, isLoading: false, isCheckingAuth: false });
                    return;
                }

                set({ isCheckingAuth: true });
                try {
                    const response = await authService.getMe();
                    if (response.success && response.data) {
                        set({
                            user: response.data,
                            isAuthenticated: true,
                        });
                    } else {
                        set({ isAuthenticated: false });
                    }
                } catch {
                    set({ isAuthenticated: false });
                } finally {
                    set({ isCheckingAuth: false, isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
