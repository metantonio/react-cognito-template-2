
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, permission, redirectTo = "/" }: ProtectedRouteProps) => {
  const { hasPermission, token } = useUser();

  if (!hasPermission(permission) || !token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
