import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import './CartItem.css'

function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart()

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const subtotal = item.unit_price * item.quantity

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.image_url}
          alt={item.product_name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/120x120?text=Produto'
          }}
        />
      </div>

      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.product_name}</h3>
        <div className="cart-item-details">
          <span>Tamanho: <strong>{item.size}</strong></span>
          <span>Cor: <strong>{item.color}</strong></span>
        </div>
        <span className="cart-item-unit-price">{formatPrice(item.unit_price)} cada</span>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-control">
          <button
            className="qty-btn"
            onClick={() =>
              updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)
            }
          >
            <FiMinus size={14} />
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() =>
              updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)
            }
          >
            <FiPlus size={14} />
          </button>
        </div>

        <span className="cart-item-subtotal">{formatPrice(subtotal)}</span>

        <button
          className="remove-btn"
          onClick={() => removeItem(item.product_id, item.size, item.color)}
          title="Remover item"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
