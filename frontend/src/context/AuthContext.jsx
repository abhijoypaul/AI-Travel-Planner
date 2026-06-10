import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI
        .me()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      if (user.settings?.currency) {
        localStorage.setItem('currency', user.settings.currency);
      }
      // Force remove dark class
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme');
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('token', data.token)
    setUser({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar })
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password })
    localStorage.setItem('token', data.token)
    setUser({ _id: data._id, name: data.name, email: data.email })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const setToken = (token) => {
    localStorage.setItem('token', token)
    return authAPI.me().then((res) => setUser(res.data))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
