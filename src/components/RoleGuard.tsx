
import React, { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';

interface RoleGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

const RoleGuard = ({ children, permission, fallback = null }: RoleGuardProps) => {
  const { hasPermission, token } = useUser();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
