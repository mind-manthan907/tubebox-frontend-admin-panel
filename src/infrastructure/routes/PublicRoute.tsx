import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { FullPageLoader } from '@/components/ui/loader';

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <FullPageLoader />;
    }

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
