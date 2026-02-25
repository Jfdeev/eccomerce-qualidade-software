import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { fetchUserOrders, cancelOrder } from '../../services/api'
import './Orders.css'

const STATUS_CONFIG = {
  pendente: { icon: FiClock, label: 'Pendente', className: 'status-pending' },
  confirmado: { icon: FiCheck, label: 'Confirmado', className: 'status-confirmed' },
  enviado: { icon: FiTruck, label: 'Enviado', className: 'status-shipped' },
  entregue: { icon: FiCheck, label: 'Entregue', className: 'status-delivered' },
  cancelado: { icon: FiX, label: 'Cancelado', className: 'status-cancelled' },
}

function Orders() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [isAuthenticated])

  async function loadOrders() {
    try {
      const data = await fetchUserOrders(user.id)
      setOrders(data.orders)
    } catch (error) {
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelOrder(orderId) {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return

    try {
      await cancelOrder(orderId)
      toast.success('Pedido cancelado com sucesso')
      loadOrders()
    } catch (error) {
      toast.error(error.message || 'Erro ao cancelar pedido')
    }
  }

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="loading">Carregando pedidos...</div>
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={64} style={{ color: 'var(--text-light)', marginBottom: 16 }} />
          <h2>Nenhum pedido encontrado</h2>
          <p>Você ainda não fez nenhum pedido.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Ver Produtos
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendente
            const StatusIcon = statusConfig.icon

            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-number">
                      Pedido #{order.id.slice(0, 8)}
                    </span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                  </div>
                  <span className={`order-status ${statusConfig.className}`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="order-item-name">
                        {item.product_name}
                      </span>
                      <span className="order-item-details">
                        {item.size} / {item.color} × {item.quantity}
                      </span>
                      <span className="order-item-price">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>
                  {(order.status === 'pendente' || order.status === 'confirmado') && (
                    <button
                      className="btn btn-sm btn-outline"
                      style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancelar Pedido
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
