import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { loginUser } from '../../services/api'
import './Login.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email || !password) {
      toast.warning('Preencha todos os campos')
      return
    }

    setLoading(true)
    try {
      const data = await loginUser(email, password)
      login(data.user)
      toast.success(`Bem-vindo(a), ${data.user.name}!`)
      navigate(redirect === 'checkout' ? '/checkout' : '/')
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">👗</span>
          <h1>Entrar</h1>
          <p>Acesse sua conta na Fashion Store</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Não tem uma conta?{' '}
          <Link to="/register" className="auth-link">Criar conta</Link>
        </p>

        <div className="demo-credentials">
          <p><strong>Usuários de teste:</strong></p>
          <p>joao@email.com / admin</p>
          <p>maria@email.com / admin</p>
          <p>carlos@email.com / admin</p>
        </div>
      </div>
    </div>
  )
}

export default Login
