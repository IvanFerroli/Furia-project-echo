import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <div className="text-center p-10">Carregando...</div>

  if (!user) return <Navigate to="/entrar" replace />

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
