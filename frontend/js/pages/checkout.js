/**
 * Página de Checkout (Finalizar Compra).
 */

registerPage('checkout', function (container) {
  const items = AppState.getCartItems();
  const user = AppState.getUser();

  if (!user) {
    navigateTo('login', { redirect: 'checkout' });
    return;
  }

  if (items.length === 0) {
    navigateTo('cart');
    return;
  }

  const cartTotal = AppState.getCartTotal();

  let checkoutItemsHtml = '';
  items.forEach((item) => {
    checkoutItemsHtml += `
      <div class="checkout-item">
        <img src="${item.image_url}" alt="${item.product_name}" onerror="handleImgError(this)" />
        <div class="checkout-item-info">
          <span class="item-name">${item.product_name}</span>
          <span class="item-variant">${item.size} / ${item.color} × ${item.quantity}</span>
        </div>
        <span class="item-price">${formatPrice(item.unit_price * item.quantity)}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="checkout-page">
      <h1 class="page-title">Finalizar Compra</h1>

      <div class="checkout-layout">
        <form class="checkout-form" id="checkout-form">
          <div class="form-section">
            <h2>Dados de Entrega</h2>
            <div class="form-group">
              <label>Nome</label>
              <input type="text" value="${user.name}" disabled class="form-input" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" value="${user.email}" disabled class="form-input" />
            </div>
            <div class="form-group">
              <label>Endereço de Entrega *</label>
              <textarea class="form-input form-textarea" id="checkout-address" placeholder="Rua, número, bairro, cidade - UF, CEP" rows="3" required>${user.address || ''}</textarea>
            </div>
          </div>

          <div class="form-section">
            <h2>Itens do Pedido</h2>
            <div class="checkout-items">${checkoutItemsHtml}</div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg place-order-btn" id="place-order-btn">
            Confirmar Pedido — ${formatPrice(cartTotal)}
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const address = document.getElementById('checkout-address').value.trim();
    if (!address) {
      showToast('Informe o endereço de entrega', 'warning');
      return;
    }

    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.textContent = 'Processando...';

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
      };

      const result = await createOrder(orderData);
      AppState.clearCart();
      showToast('Pedido realizado com sucesso!', 'success');

      // Show success screen
      container.innerHTML = `
        <div class="checkout-page">
          <div class="order-success">
            <div class="success-icon">✓</div>
            <h1>Pedido Realizado!</h1>
            <p>Seu pedido foi criado com sucesso.</p>
            <p class="order-id">Nº do pedido: <strong>${result.order.id.slice(0, 8)}</strong></p>
            <div class="success-actions">
              <button class="btn btn-primary" onclick="navigateTo('orders')">Ver Meus Pedidos</button>
              <button class="btn btn-outline" onclick="navigateTo('home')">Continuar Comprando</button>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      showToast(error.message || 'Erro ao criar pedido', 'error');
      btn.disabled = false;
      btn.textContent = `Confirmar Pedido — ${formatPrice(cartTotal)}`;
    }
  });
});
