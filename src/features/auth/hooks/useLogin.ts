import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/domain/auth/auth.schema';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';

export const useLogin = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data);
            toast.success('Admin access granted');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Authentication failed');
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
    };
};
