import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { authService } from '@/services/auth.service';

vi.mock('@/services/auth.service', () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
        getMe: vi.fn(),
        register: vi.fn(),
    },
}));

describe('AuthStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isCheckingAuth: false,
            error: null
        });
        localStorage.clear();
    });

    describe('login', () => {
        it('login action should update state on success', async () => {
            const mockUser = { id: '1', email: 'test@test.com' } as any;
            vi.mocked(authService.login).mockResolvedValueOnce({
                success: true as const,
                status: 200,
                data: { user: mockUser, tokens: { accessToken: 'a', refreshToken: 'r' } },
                message: 'Success',
                metadata: { timestamp: '', version: '' }
            });

            await useAuthStore.getState().login({ email: 'test@test.com', password: 'password' });

            expect(useAuthStore.getState().user).toEqual(mockUser);
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
            expect(useAuthStore.getState().isLoading).toBe(false);
        });

        it('login action should set error on failure', async () => {
            vi.mocked(authService.login).mockResolvedValueOnce({
                success: false as const,
                status: 401,
                message: 'Invalid credentials',
                data: null,
                metadata: { timestamp: '', version: '' }
            });

            try {
                await useAuthStore.getState().login({ email: 'test@test.com', password: 'password' });
            } catch (e) {
                // Expected
            }

            expect(useAuthStore.getState().error).toBe('Invalid credentials');
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });
    });

    describe('register', () => {
        it('should NOT log in user on registration success', async () => {
            const mockUser = { id: '1', email: 'test@test.com' } as any;
            vi.mocked(authService.register).mockResolvedValueOnce({
                success: true as const,
                status: 201,
                data: { user: mockUser, tokens: { accessToken: 'a', refreshToken: 'r' } },
                message: 'Success',
                metadata: { timestamp: '', version: '' }
            });

            await useAuthStore.getState().register({} as any);

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
            expect(useAuthStore.getState().user).toBeNull();
        });

        it('should set error and throw on registration failure', async () => {
            const mockApiError = {
                success: false as const,
                status: 400,
                message: 'Validation Error',
                data: null,
                errors: [{ field: 'password', code: 'too_small', message: 'Too small' }],
                metadata: { timestamp: '', version: '' }
            };
            vi.mocked(authService.register).mockResolvedValueOnce(mockApiError);

            let caughtError: any;
            try {
                await useAuthStore.getState().register({} as any);
            } catch (e) {
                caughtError = e;
            }

            expect(useAuthStore.getState().error).toBe('Validation Error');
            expect(caughtError).toEqual(mockApiError);
        });
    });

    describe('checkAuth', () => {
        it('should set isAuthenticated to false if no token in storage', async () => {
            await useAuthStore.getState().checkAuth();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it('should update user if token is valid', async () => {
            localStorage.setItem('accessToken', 'valid');
            const mockUser = { id: '1', email: 'me@test.com' } as any;
            vi.mocked(authService.getMe).mockResolvedValueOnce({
                success: true as const,
                status: 200,
                data: { user: mockUser },
                message: 'Success',
                metadata: { timestamp: '', version: '' }
            });

            await useAuthStore.getState().checkAuth();

            expect(useAuthStore.getState().user).toEqual(mockUser);
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
        });

        it('should set isAuthenticated to false if token is invalid', async () => {
            localStorage.setItem('accessToken', 'invalid');
            vi.mocked(authService.getMe).mockResolvedValueOnce({
                success: false as const,
                status: 401,
                message: 'Invalid session',
                data: null,
                metadata: { timestamp: '', version: '' }
            });

            await useAuthStore.getState().checkAuth();

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });
    });

    it('logout action should reset state', async () => {
        useAuthStore.setState({ user: { id: '1' } as any, isAuthenticated: true });
        vi.mocked(authService.logout).mockResolvedValueOnce({
            success: true as const,
            status: 200,
            message: 'Success',
            data: null,
            metadata: { timestamp: '', version: '' }
        });

        await useAuthStore.getState().logout();

        expect(useAuthStore.getState().user).toBeNull();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
});
