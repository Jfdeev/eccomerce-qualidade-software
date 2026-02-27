/**
 * Página de Pedidos do Usuário.
 */

const STATUS_CONFIG = {
  pendente:   { icon: '⏳', label: 'Pendente',   className: 'status-pending' },
  confirmado: { icon: '✓',  label: 'Confirmado', className: 'status-confirmed' },
  enviado:    { icon: '🚚', label: 'Enviado',    className: 'status-shipped' },
  entregue:   { icon: '✅', label: 'Entregue',   className: 'status-delivered' },
  cancelado:  { icon: '✗',  label: 'Cancelado',  className: 'status-cancelled' },
};

registerPage('orders', async function (container) {
  const user = AppState.getUser();

  if (!user) {
    navigateTo('login');
    return;
  }

  container.innerHTML = '<div class="loading">Carregando pedidos...</div>';

  async function loadOrders() {
    try {
      const data = await fetchUserOrders(user.id);
      const orders = data.orders;

      if (orders.length === 0) {
        container.innerHTML = `
          <div class="orders-page">
            <h1 class="page-title">Meus Pedidos</h1>
            <div class="empty-state">
              <span class="empty-icon">📦</span>
              <h2>Nenhum pedido encontrado</h2>
              <p>Você ainda não fez nenhum pedido.</p>
              <button class="btn btn-primary" onclick="navigateTo('home')">Ver Produtos</button>
            </div>
          </div>
        `;
        return;
      }

      let ordersHtml = '';
      orders.forEach((order) => {
        const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendente;
        const formatDate = (dateStr) => {
          return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });
        };

        let itemsHtml = '';
        order.items.forEach((item) => {
          itemsHtml += `
            <div class="order-item">
              <span class="order-item-name">${item.product_name}</span>
              <span class="order-item-details">${item.size} / ${item.color} × ${item.quantity}</span>
              <span class="order-item-price">${formatPrice(item.subtotal)}</span>
            </div>
          `;
        });

        const cancelBtn = (order.status === 'pendente' || order.status === 'confirmado')
          ? `<button class="btn btn-sm btn-danger-outline" onclick="window._cancelOrder('${order.id}')">Cancelar Pedido</button>`
          : '';

        ordersHtml += `
          <div class="order-card">
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">Pedido #${order.id.slice(0, 8)}</span>
                <span class="order-date">${formatDate(order.created_at)}</span>
              </div>
              <span class="order-status ${config.className}">
                ${config.icon} ${config.label}
              </span>
            </div>
            <div class="order-items">${itemsHtml}</div>
            <div class="order-footer">
              <div class="order-total">
                <span>Total:</span>
                <strong>${formatPrice(order.total)}</strong>
              </div>
              ${cancelBtn}
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="orders-page">
          <h1 class="page-title">Meus Pedidos</h1>
          <div class="orders-list">${ordersHtml}</div>
        </div>
      `;
    } catch (error) {
      showToast('Erro ao carregar pedidos', 'error');
      container.innerHTML = '<div class="empty-state"><h2>Erro ao carregar pedidos</h2></div>';
    }
  }

  window._cancelOrder = async function (orderId) {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return;
    try {
      await cancelOrder(orderId);
      showToast('Pedido cancelado com sucesso', 'success');
      loadOrders();
    } catch (error) {
      showToast(error.message || 'Erro ao cancelar pedido', 'error');
    }
  };

  loadOrders();
});
