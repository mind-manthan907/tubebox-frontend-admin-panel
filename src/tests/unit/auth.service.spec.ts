import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '@/services/auth.service';
import { type IAuthRepository } from '@/repositories/auth.repository';

describe('AuthService', () => {
    let authService: AuthService;
    let mockRepository: IAuthRepository;

    beforeEach(() => {
        mockRepository = {
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            getMe: vi.fn(),
            refreshToken: vi.fn(),
        };
        authService = new AuthService(mockRepository);
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('login', () => {
        it('should call repository.login and set tokens on success', async () => {
            const loginData = { email: 'admin@test.com', password: 'password123' };
            const mockResponse = {
                success: true as const,
                data: { accessToken: 'access', refreshToken: 'refresh', user: {} as any },
                message: 'Success'
            };
            vi.mocked(mockRepository.login).mockResolvedValueOnce(mockResponse);

            const result = await authService.login(loginData);

            expect(mockRepository.login).toHaveBeenCalledWith(loginData);
            expect(localStorage.getItem('accessToken')).toBe('access');
            expect(localStorage.getItem('refreshToken')).toBe('refresh');
            expect(result).toEqual(mockResponse);
        });

        it('should NOT set tokens on failure', async () => {
            const mockResponse = { success: false as const, message: 'Fail', data: null };
            vi.mocked(mockRepository.login).mockResolvedValueOnce(mockResponse);

            await authService.login({ email: 'x', password: 'y' } as any);

            expect(localStorage.getItem('accessToken')).toBeNull();
        });
    });

    describe('register', () => {
        it('should call repository.register and set tokens on success', async () => {
            const registerData = { firstName: 'A', lastName: 'B', email: 'a@b.com', password: 'p', confirmPassword: 'p' };
            const mockResponse = {
                success: true as const,
                data: { accessToken: 'access', refreshToken: 'refresh', user: {} as any },
                message: 'Success'
            };
            vi.mocked(mockRepository.register).mockResolvedValueOnce(mockResponse);

            await authService.register(registerData);

            expect(localStorage.getItem('accessToken')).toBe('access');
        });

        it('should NOT set tokens on failure', async () => {
            vi.mocked(mockRepository.register).mockResolvedValueOnce({ success: false as const, message: 'Fail', data: null });
            await authService.register({} as any);
            expect(localStorage.getItem('accessToken')).toBeNull();
        });
    });

    describe('logout', () => {
        it('should clear tokens after repository logout', async () => {
            localStorage.setItem('accessToken', 'test');
            vi.mocked(mockRepository.logout).mockResolvedValueOnce({ success: true as const, message: 'Success', data: null });

            await authService.logout();

            expect(mockRepository.logout).toHaveBeenCalled();
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
        });
    });

    describe('getMe', () => {
        it('should call repository.getMe', async () => {
            await authService.getMe();
            expect(mockRepository.getMe).toHaveBeenCalled();
        });
    });

    describe('refreshToken', () => {
        it('should call repository.refreshToken and update tokens', async () => {
            const mockResponse = {
                success: true as const,
                data: { accessToken: 'new-access', refreshToken: 'new-refresh', user: {} as any },
                message: 'Success'
            };
            vi.mocked(mockRepository.refreshToken).mockResolvedValueOnce(mockResponse);

            await authService.refreshToken('old-refresh');

            expect(localStorage.getItem('accessToken')).toBe('new-access');
        });

        it('should NOT update tokens on failure', async () => {
            vi.mocked(mockRepository.refreshToken).mockResolvedValueOnce({ success: false as const, message: 'Fail', data: null });
            localStorage.setItem('accessToken', 'stay');
            await authService.refreshToken('bad');
            expect(localStorage.getItem('accessToken')).toBe('stay');
        });
    });
});
