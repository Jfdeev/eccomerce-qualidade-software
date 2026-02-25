import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../services/api'
import './Checkout.css'

function Checkout() {
  const { items, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()

    if (!address.trim()) {
      toast.warning('Informe o endereço de entrega')
      return
    }

    if (items.length === 0) {
      toast.warning('Seu carrinho está vazio')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        user_id: user.id,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unit_price: item.unit_price,
          image_url: item.image_url,
        })),
        shipping_address: address,
      }

      const result = await createOrder(orderData)
      setOrderId(result.order.id)
      setOrderPlaced(true)
      clearCart()
      toast.success('Pedido realizado com sucesso!')
    } catch (error) {
      toast.error(error.message || 'Erro ao criar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">
            <FiCheck size={48} />
          </div>
          <h1>Pedido Realizado!</h1>
          <p>Seu pedido foi criado com sucesso.</p>
          <p className="order-id">Nº do pedido: <strong>{orderId.slice(0, 8)}</strong></p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              Ver Meus Pedidos
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Finalizar Compra</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-section">
            <h2>Dados de Entrega</h2>

            <div className="form-group">
              <label>Nome</label>
              <input type="text" value={user?.name || ''} disabled className="form-input" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled className="form-input" />
            </div>

            <div className="form-group">
              <label>Endereço de Entrega *</label>
              <textarea
                className="form-input form-textarea"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro, cidade - UF, CEP"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Itens do Pedido</h2>
            <div className="checkout-items">
              {items.map((item) => (
                <div key={`${item.product_id}-${item.size}-${item.color}`} className="checkout-item">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60x60?text=P'
                    }}
                  />
                  <div className="checkout-item-info">
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-variant">{item.size} / {item.color} × {item.quantity}</span>
                  </div>
                  <span className="item-price">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg place-order-btn"
            disabled={loading}
          >
            {loading ? 'Processando...' : `Confirmar Pedido — ${formatPrice(cartTotal)}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Checkout
