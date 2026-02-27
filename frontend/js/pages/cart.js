/**
 * Página do Carrinho de Compras.
 */

registerPage('cart', function (container) {
  const items = AppState.getCartItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-page">
        <div class="empty-state">
          <span class="empty-icon">🛍️</span>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos para continuar comprando</p>
          <button class="btn btn-primary" onclick="navigateTo('home')">Ver Produtos</button>
        </div>
      </div>
    `;
    return;
  }

  function render() {
    const items = AppState.getCartItems();
    if (items.length === 0) {
      navigateTo('cart');
      return;
    }

    const cartTotal = AppState.getCartTotal();
    const cartCount = AppState.getCartCount();

    let itemsHtml = '';
    items.forEach((item) => {
      const subtotal = item.unit_price * item.quantity;
      itemsHtml += `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image_url}" alt="${item.product_name}" onerror="handleImgError(this)" />
          </div>
          <div class="cart-item-info">
            <h3 class="cart-item-name">${item.product_name}</h3>
            <div class="cart-item-details">
              <span>Tamanho: <strong>${item.size}</strong></span>
              <span>Cor: <strong>${item.color}</strong></span>
            </div>
            <span class="cart-item-unit-price">${formatPrice(item.unit_price)} cada</span>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="qty-btn" onclick="window._cartUpdateQty('${item.product_id}','${item.size}','${item.color}',${item.quantity - 1})">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="window._cartUpdateQty('${item.product_id}','${item.size}','${item.color}',${item.quantity + 1})">+</button>
            </div>
            <span class="cart-item-subtotal">${formatPrice(subtotal)}</span>
            <button class="remove-btn" onclick="window._cartRemove('${item.product_id}','${item.size}','${item.color}')" title="Remover item">🗑️</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="cart-page">
        <button class="back-btn" onclick="navigateTo('home')">← Continuar comprando</button>
        <h1 class="page-title">Carrinho de Compras</h1>

        <div class="cart-layout">
          <div class="cart-items">${itemsHtml}</div>

          <aside class="cart-summary">
            <h2>Resumo do Pedido</h2>
            <div class="summary-rows">
              <div class="summary-row">
                <span>Itens (${cartCount})</span>
                <span>${formatPrice(cartTotal)}</span>
              </div>
              <div class="summary-row">
                <span>Frete</span>
                <span class="free-shipping">Grátis</span>
              </div>
            </div>
            <div class="summary-total">
              <span>Total</span>
              <span>${formatPrice(cartTotal)}</span>
            </div>
            <button class="btn btn-primary btn-lg checkout-btn" onclick="window._cartCheckout()">Finalizar Compra</button>
            <button class="btn btn-outline clear-btn" onclick="window._cartClear()">Limpar Carrinho</button>
          </aside>
        </div>
      </div>
    `;
  }

  window._cartUpdateQty = function (pid, size, color, qty) {
    AppState.updateCartQuantity(pid, size, color, qty);
    render();
  };

  window._cartRemove = function (pid, size, color) {
    AppState.removeCartItem(pid, size, color);
    render();
  };

  window._cartClear = function () {
    AppState.clearCart();
    navigateTo('cart');
  };

  window._cartCheckout = function () {
    if (!AppState.isAuthenticated()) {
      navigateTo('login', { redirect: 'checkout' });
      return;
    }
    navigateTo('checkout');
  };

  render();
});
