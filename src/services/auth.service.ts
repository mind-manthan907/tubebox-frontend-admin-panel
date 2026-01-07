import { authRepository, type IAuthRepository } from '@/repositories/auth.repository';
import type { LoginInput, RegisterInput, AuthResponse, ApiResponse } from '@/domain/auth/auth.schema';

export class AuthService {
    private repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async login(data: LoginInput): Promise<ApiResponse<AuthResponse>> {
        const response = await this.repository.login(data);
        if (response.success && response.data) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response;
    }

    async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
        const response = await this.repository.register(data);
        if (response.success && response.data) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response;
    }

    async logout(): Promise<ApiResponse<void>> {
        const response = await this.repository.logout();
        this.clearTokens();
        return response;
    }

    async getMe(): Promise<ApiResponse<{ user: any }>> {
        return this.repository.getMe();
    }

    async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
        const response = await this.repository.refreshToken(token);
        if (response.success && response.data) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response;
    }

    private setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    private clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}

export const authService = new AuthService(authRepository);
