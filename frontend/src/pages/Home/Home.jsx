import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter } from 'react-icons/fi'
import ProductCard from '../../components/ProductCard/ProductCard'
import { fetchProducts, fetchCategories } from '../../services/api'
import './Home.css'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category') || ''
    setFilters((prev) => ({ ...prev, category }))
  }, [searchParams])

  useEffect(() => {
    loadProducts()
  }, [filters])

  async function loadCategories() {
    try {
      const data = await fetchCategories()
      setCategories(data.categories)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await fetchProducts({
        category: filters.category,
        gender: filters.gender,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: searchTerm,
      })
      setProducts(data.products)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    loadProducts()
  }

  function handleFilterChange(key, value) {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (key === 'category') {
      if (value) {
        setSearchParams({ category: value })
      } else {
        setSearchParams({})
      }
    }
  }

  function clearFilters() {
    setFilters({ category: '', gender: '', minPrice: '', maxPrice: '' })
    setSearchTerm('')
    setSearchParams({})
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Vista-se com estilo</h1>
          <p>Descubra as melhores roupas com qualidade premium e preços incríveis</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-header">
          <h2>
            <FiFilter size={20} />
            Filtros
          </h2>
          {(filters.category || filters.gender || filters.minPrice || filters.maxPrice || searchTerm) && (
            <button className="btn btn-sm btn-outline" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>

        <div className="filters-row">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos gêneros</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="unissex">Unissex</option>
          </select>

          <div className="price-filter">
            <input
              type="number"
              placeholder="Preço min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="filter-input"
            />
            <span>–</span>
            <input
              type="number"
              placeholder="Preço max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        {loading ? (
          <div className="loading">Carregando produtos...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum produto encontrado</h2>
            <p>Tente alterar os filtros ou fazer uma nova busca.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <>
            <p className="products-count">{products.length} produto(s) encontrado(s)</p>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default Home
