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
            const user = useAuthStore.getState().user;

            if (user?.role === 'ADMIN') {
                toast.success('Admin access granted');
                navigate('/');
            } else {
                toast.error('Access denied. Admin role required.');
                // Optionally logout if user is not admin but authenticated as regular user
                await useAuthStore.getState().logout();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Authentication failed';
            toast.error(message);
            // Reset only password field
            form.setValue('password', '');
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
    };
};
