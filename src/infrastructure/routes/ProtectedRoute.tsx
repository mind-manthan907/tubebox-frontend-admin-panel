import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import { FullPageLoader } from '@/components/ui/loader';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return <FullPageLoader />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
