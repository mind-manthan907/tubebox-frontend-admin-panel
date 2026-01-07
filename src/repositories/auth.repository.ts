import api from '@/lib/axios';
import type { LoginInput, RegisterInput, AuthResponse, ApiResponse } from '@/domain/auth/auth.schema';

export interface IAuthRepository {
    login(data: LoginInput): Promise<ApiResponse<AuthResponse>>;
    register(data: RegisterInput): Promise<ApiResponse<AuthResponse>>;
    logout(): Promise<ApiResponse<void>>;
    getMe(): Promise<ApiResponse<{ user: any }>>;
    refreshToken(token: string): Promise<ApiResponse<AuthResponse>>;
}

export class AuthRepository implements IAuthRepository {
    async login(data: LoginInput): Promise<ApiResponse<AuthResponse>> {
        return api.post('/auth/login', data);
    }

    async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
        return api.post('/auth/register', data);
    }

    async logout(): Promise<ApiResponse<void>> {
        return api.post('/auth/logout');
    }

    async getMe(): Promise<ApiResponse<{ user: any }>> {
        return api.get('/auth/me');
    }

    async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
        return api.post('/auth/refresh-token', { refreshToken: token });
    }
}

export const authRepository = new AuthRepository();
