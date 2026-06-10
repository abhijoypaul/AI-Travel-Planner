import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Plane } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f4f6fb] dark:bg-gray-950 z-[99999] animate-fade-in">
        <div className="relative flex items-center justify-center">
          {/* Animated Spinner Ring */}
          <div className="h-20 w-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          {/* Inner Pulsing Brand Icon */}
          <div className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-650 flex items-center justify-center shadow-md animate-pulse">
            <Plane className="h-5 w-5 text-white fill-white" />
          </div>
        </div>
        <p className="mt-5 text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide animate-pulse">
          Starting your Odyssey...
        </p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
