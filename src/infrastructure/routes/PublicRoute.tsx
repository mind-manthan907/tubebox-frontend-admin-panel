import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';

const PublicRoute = () => {
    const { isAuthenticated } = useAuthStore();

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
