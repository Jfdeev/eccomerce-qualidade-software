/**
 * Página Home - Lista de produtos com filtros.
 */

registerPage('home', async function (container, params) {
  const initialCategory = params.category || '';

  container.innerHTML = `
    <div class="home">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>Vista-se com estilo</h1>
          <p>Descubra as melhores roupas com qualidade premium e preços incríveis</p>
          <form class="search-bar" id="search-form">
            <input type="text" placeholder="Buscar produtos..." id="search-input" />
            <button type="submit" class="btn btn-primary">Buscar</button>
          </form>
        </div>
      </section>

      <!-- Filters -->
      <section class="filters-section">
        <div class="filters-header">
          <h2>🔍 Filtros</h2>
          <button class="btn btn-sm btn-outline" id="clear-filters-btn" style="display:none;">Limpar filtros</button>
        </div>
        <div class="filters-row">
          <select class="filter-select" id="filter-category">
            <option value="">Todas categorias</option>
          </select>
          <select class="filter-select" id="filter-gender">
            <option value="">Todos gêneros</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="unissex">Unissex</option>
          </select>
          <div class="price-filter">
            <input type="number" placeholder="Preço min" class="filter-input" id="filter-min-price" />
            <span>–</span>
            <input type="number" placeholder="Preço max" class="filter-input" id="filter-max-price" />
          </div>
        </div>
      </section>

      <!-- Products -->
      <section class="products-section" id="products-section">
        <div class="loading">Carregando produtos...</div>
      </section>
    </div>
  `;

  // State
  const filters = {
    category: initialCategory,
    gender: '',
    minPrice: '',
    maxPrice: '',
  };
  let searchTerm = '';

  // Load categories
  try {
    const catData = await fetchCategories();
    const catSelect = document.getElementById('filter-category');
    catData.categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });
    if (initialCategory) catSelect.value = initialCategory;
  } catch (e) {
    console.error('Erro ao carregar categorias:', e);
  }

  // Event listeners
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    searchTerm = document.getElementById('search-input').value;
    loadProducts();
  });

  document.getElementById('filter-category').addEventListener('change', (e) => {
    filters.category = e.target.value;
    loadProducts();
  });

  document.getElementById('filter-gender').addEventListener('change', (e) => {
    filters.gender = e.target.value;
    loadProducts();
  });

  document.getElementById('filter-min-price').addEventListener('change', (e) => {
    filters.minPrice = e.target.value;
    loadProducts();
  });

  document.getElementById('filter-max-price').addEventListener('change', (e) => {
    filters.maxPrice = e.target.value;
    loadProducts();
  });

  document.getElementById('clear-filters-btn').addEventListener('click', () => {
    filters.category = '';
    filters.gender = '';
    filters.minPrice = '';
    filters.maxPrice = '';
    searchTerm = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-gender').value = '';
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    document.getElementById('search-input').value = '';
    loadProducts();
  });

  async function loadProducts() {
    const section = document.getElementById('products-section');
    section.innerHTML = '<div class="loading">Carregando produtos...</div>';

    // Show/hide clear button
    const hasFilters = filters.category || filters.gender || filters.minPrice || filters.maxPrice || searchTerm;
    document.getElementById('clear-filters-btn').style.display = hasFilters ? 'inline-flex' : 'none';

    try {
      const data = await fetchProducts({
        category: filters.category,
        gender: filters.gender,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        search: searchTerm,
      });

      if (data.products.length === 0) {
        section.innerHTML = `
          <div class="empty-state">
            <h2>Nenhum produto encontrado</h2>
            <p>Tente alterar os filtros ou fazer uma nova busca.</p>
            <button class="btn btn-primary" onclick="document.getElementById('clear-filters-btn').click()">Ver todos os produtos</button>
          </div>
        `;
        return;
      }

      let html = `<p class="products-count">${data.products.length} produto(s) encontrado(s)</p>`;
      html += '<div class="products-grid">';

      data.products.forEach((product) => {
        let badge = '';
        if (product.stock === 0) {
          badge = '<span class="product-badge out-of-stock">Esgotado</span>';
        } else if (product.stock <= 5) {
          badge = '<span class="product-badge stock-low">Últimas unidades!</span>';
        }

        const sizeTags = product.sizes
          .slice(0, 5)
          .map((s) => `<span class="size-tag">${s}</span>`)
          .join('');
        const extraSizes = product.sizes.length > 5 ? `<span class="size-tag">+${product.sizes.length - 5}</span>` : '';

        html += `
          <div class="product-card" onclick="navigateTo('productDetail', {id: '${product.id}'})">
            <div class="product-card-image">
              <img src="${product.image_url}" alt="${product.name}" loading="lazy" onerror="handleImgError(this)" />
              ${badge}
            </div>
            <div class="product-card-info">
              <span class="product-brand">${product.brand}</span>
              <h3 class="product-name">${product.name}</h3>
              <div class="product-rating">
                <span class="star-icon">⭐</span>
                <span>${product.rating}</span>
                <span class="reviews-count">(${product.reviews_count})</span>
              </div>
              <div class="product-price">
                <span class="price-current">${formatPrice(product.price)}</span>
                <span class="price-installment">ou 3x de ${formatPrice(product.price / 3)}</span>
              </div>
              <div class="product-sizes">${sizeTags}${extraSizes}</div>
            </div>
          </div>
        `;
      });

      html += '</div>';
      section.innerHTML = html;
    } catch (error) {
      section.innerHTML = '<div class="empty-state"><h2>Erro ao carregar produtos</h2><p>' + error.message + '</p></div>';
    }
  }

  loadProducts();
});
