import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function GuestGuard() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p>Зареждане...</p>
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}