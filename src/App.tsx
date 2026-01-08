import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from '@/infrastructure/store/useAuthStore';
import ProtectedRoute from '@/infrastructure/routes/ProtectedRoute';
import PublicRoute from '@/infrastructure/routes/PublicRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import HomePage from '@/features/dashboard/pages/HomePage';
import VideoUploadPage from '@/features/dashboard/pages/VideoUploadPage';
import { FullPageLoader } from '@/components/ui/loader';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfilePage from '@/features/dashboard/pages/ProfilePage';

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <FullPageLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos/upload" element={<VideoUploadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
};

export default App;
