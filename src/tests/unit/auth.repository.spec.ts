import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authRepository } from '@/repositories/auth.repository';
import api from '@/lib/axios';

// Mock the axios instance
vi.mock('@/lib/axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

describe('AuthRepository', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should call api.post with /auth/login and correct data', async () => {
            const loginData = { email: 'admin@test.com', password: 'password123' };
            const mockResponse = { success: true, data: { accessToken: 'token', refreshToken: 'r', user: {} as any }, message: 'Success' };
            vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

            await authRepository.login(loginData);

            expect(api.post).toHaveBeenCalledWith('/auth/login', loginData);
        });
    });

    describe('register', () => {
        it('should call api.post with /auth/register and correct data', async () => {
            const registerData = {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@test.com',
                password: 'password123',
                confirmPassword: 'password123'
            };
            const mockResponse = { success: true, data: { accessToken: 'token', refreshToken: 'r', user: {} as any }, message: 'Success' };
            vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

            await authRepository.register(registerData);

            expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
        });
    });

    describe('logout', () => {
        it('should call api.post with /auth/logout', async () => {
            vi.mocked(api.post).mockResolvedValueOnce({ success: true, message: 'Success', data: null });

            await authRepository.logout();

            expect(api.post).toHaveBeenCalledWith('/auth/logout');
        });
    });

    describe('getMe', () => {
        it('should call api.get with /auth/me', async () => {
            vi.mocked(api.get).mockResolvedValueOnce({ success: true, message: 'Success', data: { user: {} as any } });

            await authRepository.getMe();

            expect(api.get).toHaveBeenCalledWith('/auth/me');
        });
    });

    describe('refreshToken', () => {
        it('should call api.post with /auth/refresh-token and token', async () => {
            const token = 'old-token';
            vi.mocked(api.post).mockResolvedValueOnce({ success: true, message: 'Success', data: { accessToken: 't', refreshToken: 'r', user: {} as any } });

            await authRepository.refreshToken(token);

            expect(api.post).toHaveBeenCalledWith('/auth/refresh-token', { refreshToken: token });
        });
    });
});
