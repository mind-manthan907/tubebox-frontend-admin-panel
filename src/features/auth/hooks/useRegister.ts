import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registerSchema, type RegisterInput } from '@/domain/auth/auth.schema';
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
            toast.success('Admin account created');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
    };
};
