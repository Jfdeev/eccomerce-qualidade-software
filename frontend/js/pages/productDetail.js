/**
 * Página de Detalhe do Produto.
 */

registerPage('productDetail', async function (container, params) {
  container.innerHTML = '<div class="loading">Carregando produto...</div>';

  try {
    const product = await fetchProduct(params.id);

    let selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
    let selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    let quantity = 1;

    function render() {
      const sizeButtons = (product.sizes || [])
        .map((s) => `<button class="option-btn ${selectedSize === s ? 'selected' : ''}" onclick="window._pdSelectSize('${s}')">${s}</button>`)
        .join('');

      const colorButtons = (product.colors || [])
        .map((c) => `<button class="option-btn ${selectedColor === c ? 'selected' : ''}" onclick="window._pdSelectColor('${c}')">${selectedColor === c ? '✓ ' : ''}${c}</button>`)
        .join('');

      container.innerHTML = `
        <div class="product-detail">
          <button class="back-btn" onclick="navigateTo('home')">← Voltar</button>

          <div class="product-detail-content">
            <div class="product-detail-image">
              <img src="${product.image_url}" alt="${product.name}" onerror="handleImgError(this)" />
            </div>

            <div class="product-detail-info">
              <span class="detail-brand">${product.brand}</span>
              <h1 class="detail-name">${product.name}</h1>

              <div class="detail-rating">
                <span class="star-icon">⭐</span>
                <span class="rating-value">${product.rating}</span>
                <span class="rating-count">(${product.reviews_count} avaliações)</span>
              </div>

              <div class="detail-price">
                <span class="price-main">${formatPrice(product.price)}</span>
                <span class="price-installments">ou 3x de ${formatPrice(product.price / 3)} sem juros</span>
              </div>

              <p class="detail-description">${product.description}</p>

              <div class="detail-options">
                <div class="option-group">
                  <label>Tamanho:</label>
                  <div class="option-buttons">${sizeButtons}</div>
                </div>

                <div class="option-group">
                  <label>Cor:</label>
                  <div class="option-buttons">${colorButtons}</div>
                </div>

                <div class="option-group">
                  <label>Quantidade:</label>
                  <div class="quantity-selector">
                    <button class="qty-btn" onclick="window._pdChangeQty(-1)">−</button>
                    <span class="qty-display">${quantity}</span>
                    <button class="qty-btn" onclick="window._pdChangeQty(1)">+</button>
                  </div>
                  <span class="stock-info">${product.stock > 0 ? product.stock + ' em estoque' : 'Produto esgotado'}</span>
                </div>
              </div>

              <button class="btn btn-primary btn-lg add-to-cart-btn" onclick="window._pdAddToCart()" ${product.stock === 0 ? 'disabled' : ''}>
                🛒 ${product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
              </button>

              <div class="detail-meta">
                <span><strong>Categoria:</strong> ${product.category}</span>
                <span><strong>Gênero:</strong> ${product.gender}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    window._pdSelectSize = function (s) { selectedSize = s; render(); };
    window._pdSelectColor = function (c) { selectedColor = c; render(); };
    window._pdChangeQty = function (delta) {
      quantity = Math.max(1, Math.min(product.stock, quantity + delta));
      render();
    };
    window._pdAddToCart = function () {
      if (!selectedSize) { showToast('Selecione um tamanho', 'warning'); return; }
      if (!selectedColor) { showToast('Selecione uma cor', 'warning'); return; }
      AppState.addCartItem({
        product_id: product.id,
        product_name: product.name,
        quantity,
        size: selectedSize,
        color: selectedColor,
        unit_price: product.price,
        image_url: product.image_url,
      });
      showToast(`${product.name} adicionado ao carrinho!`, 'success');
    };

    render();
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><h2>Produto não encontrado</h2></div>';
    showToast('Produto não encontrado', 'error');
  }
});
