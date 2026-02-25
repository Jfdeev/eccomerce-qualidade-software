import { Link } from 'react-router-dom'
import { FiStar, FiShoppingBag } from 'react-icons/fi'
import './ProductCard.css'

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Produto'
          }}
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="product-badge stock-low">Últimas unidades!</span>
        )}
        {product.stock === 0 && (
          <span className="product-badge out-of-stock">Esgotado</span>
        )}
      </div>

      <div className="product-card-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating">
          <FiStar size={14} className="star-icon" />
          <span>{product.rating}</span>
          <span className="reviews-count">({product.reviews_count})</span>
        </div>

        <div className="product-price">
          <span className="price-current">{formatPrice(product.price)}</span>
          <span className="price-installment">
            ou 3x de {formatPrice(product.price / 3)}
          </span>
        </div>

        <div className="product-sizes">
          {product.sizes.slice(0, 5).map((size) => (
            <span key={size} className="size-tag">{size}</span>
          ))}
          {product.sizes.length > 5 && (
            <span className="size-tag">+{product.sizes.length - 5}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
