import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Context de Autenticação.
 * 
 * Gerencia o estado do usuário logado.
 * Em produção, usaria JWT tokens - aqui simplificamos para fins didáticos.
 */

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('fashion-store-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Erro ao carregar usuário:', e)
      }
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('fashion-store-user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fashion-store-user')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
