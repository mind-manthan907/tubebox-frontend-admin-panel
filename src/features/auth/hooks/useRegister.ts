import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { registerSchema, type RegisterInput, type ApiResponse } from '@/domain/auth/auth.schema';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';

export const useRegister = () => {
    const navigate = useNavigate();
    const { register: registerUser, isLoading } = useAuthStore();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            await registerUser(data);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            const apiError = error as ApiResponse<null>;
            if (apiError.errors) {
                apiError.errors.forEach((err) => {
                    form.setError(err.field as keyof RegisterInput, {
                        message: err.message,
                    });
                });
            } else {
                toast.error(apiError.message || 'Registration failed');
            }
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
    };
};
