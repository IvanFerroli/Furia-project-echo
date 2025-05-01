import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Carregando...</div>;

  if (!user) return <Navigate to="/entrar" replace />;

  return <>{children}</>;
}
