import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import CartItem from '../../components/CartItem/CartItem'
import './Cart.css'

function Cart() {
  const { items, cartTotal, cartCount, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <FiShoppingBag size={64} className="empty-icon" />
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos para continuar comprando</p>
          <Link to="/" className="btn btn-primary">
            Ver Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Continuar comprando
      </button>

      <h1 className="page-title">Carrinho de Compras</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item, index) => (
            <CartItem key={`${item.product_id}-${item.size}-${item.color}`} item={item} />
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Resumo do Pedido</h2>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Itens ({cartCount})</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>Frete</span>
              <span className="free-shipping">Grátis</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <button
            className="btn btn-primary btn-lg checkout-btn"
            onClick={handleCheckout}
          >
            Finalizar Compra
          </button>

          <button className="btn btn-outline clear-btn" onClick={clearCart}>
            Limpar Carrinho
          </button>
        </aside>
      </div>
    </div>
  )
}

export default Cart
