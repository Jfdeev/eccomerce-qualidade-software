import { Link } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

function Header() {
  const { cartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">👗</span>
          <span className="logo-text">Fashion Store</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Início</Link>
          <Link to="/?category=Camisetas" className="nav-link">Camisetas</Link>
          <Link to="/?category=Calças" className="nav-link">Calças</Link>
          <Link to="/?category=Vestidos" className="nav-link">Vestidos</Link>
          <Link to="/?category=Jaquetas" className="nav-link">Jaquetas</Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="header-action" title="Meus Pedidos">
                <FiPackage size={20} />
              </Link>
              <span className="user-greeting">Olá, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="header-action" title="Sair">
                <FiLogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="header-action" title="Entrar">
              <FiUser size={20} />
              <span className="action-text">Entrar</span>
            </Link>
          )}

          <Link to="/cart" className="header-action cart-action" title="Carrinho">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
