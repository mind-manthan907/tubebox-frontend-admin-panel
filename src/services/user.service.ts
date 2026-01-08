import api from '@/lib/axios';
import type { ApiResponse, User, UserProfileInput } from '@/domain/auth/auth.schema';

export class UserService {
  async updateProfile(id: string, data: UserProfileInput, file?: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (file) {
      formData.append('profile', file);
    }

    return api.patch(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const userService = new UserService();
