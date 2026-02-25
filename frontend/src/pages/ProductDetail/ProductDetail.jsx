import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiArrowLeft, FiStar, FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useCart } from '../../context/CartContext'
import { fetchProduct } from '../../services/api'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    loadProduct()
  }, [id])

  async function loadProduct() {
    setLoading(true)
    try {
      const data = await fetchProduct(id)
      setProduct(data)
      if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
      if (data.colors?.length > 0) setSelectedColor(data.colors[0])
    } catch (error) {
      toast.error('Produto não encontrado')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart() {
    if (!selectedSize) {
      toast.warning('Selecione um tamanho')
      return
    }
    if (!selectedColor) {
      toast.warning('Selecione uma cor')
      return
    }

    addItem({
      product_id: product.id,
      product_name: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor,
      unit_price: product.price,
      image_url: product.image_url,
    })

    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (loading) {
    return <div className="loading">Carregando produto...</div>
  }

  if (!product) {
    return <div className="empty-state"><h2>Produto não encontrado</h2></div>
  }

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Voltar
      </button>

      <div className="product-detail-content">
        <div className="product-detail-image">
          <img
            src={product.image_url}
            alt={product.name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Produto'
            }}
          />
        </div>

        <div className="product-detail-info">
          <span className="detail-brand">{product.brand}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <FiStar size={18} className="star-icon" />
            <span className="rating-value">{product.rating}</span>
            <span className="rating-count">({product.reviews_count} avaliações)</span>
          </div>

          <div className="detail-price">
            <span className="price-main">{formatPrice(product.price)}</span>
            <span className="price-installments">
              ou 3x de {formatPrice(product.price / 3)} sem juros
            </span>
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-options">
            <div className="option-group">
              <label>Tamanho:</label>
              <div className="option-buttons">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`option-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label>Cor:</label>
              <div className="option-buttons">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`option-btn color-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && <FiCheck size={14} />}
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label>Quantidade:</label>
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <span className="qty-display">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                {product.stock > 0
                  ? `${product.stock} em estoque`
                  : 'Produto esgotado'}
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FiShoppingCart size={20} />
            {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
          </button>

          <div className="detail-meta">
            <span><strong>Categoria:</strong> {product.category}</span>
            <span><strong>Gênero:</strong> {product.gender}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
