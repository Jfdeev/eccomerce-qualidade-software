/**
 * Router simples baseado em hash ou estado interno.
 *
 * Cada "página" é uma função que retorna HTML e opcionalmente
 * executa lógica após o render.
 */

let currentPage = 'home';
let currentParams = {};

const routes = {};

function registerPage(name, renderFn) {
  routes[name] = renderFn;
}

function navigateTo(page, params = {}) {
  currentPage = page;
  currentParams = params;
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentPage() {
  const app = document.getElementById('app');
  const renderFn = routes[currentPage];
  if (renderFn) {
    renderFn(app, currentParams);
  } else {
    app.innerHTML = '<div class="empty-state"><h2>Página não encontrada</h2></div>';
  }
}

// ===== Header Actions =====

function updateHeaderActions() {
  const container = document.getElementById('header-actions');
  const user = AppState.getUser();
  const cartCount = AppState.getCartCount();

  let html = '';

  if (user) {
    html += `
      <a href="#" class="header-action" onclick="navigateTo('orders')" title="Meus Pedidos">📦</a>
      <span class="user-greeting">Olá, ${user.name.split(' ')[0]}</span>
      <button class="header-action" onclick="AppState.logout()" title="Sair">🚪</button>
    `;
  } else {
    html += `
      <a href="#" class="header-action" onclick="navigateTo('login')" title="Entrar">
        👤 <span class="action-text">Entrar</span>
      </a>
    `;
  }

  html += `
    <a href="#" class="header-action cart-action" onclick="navigateTo('cart')" title="Carrinho">
      🛒
      ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
    </a>
  `;

  container.innerHTML = html;
}

// ===== Helpers =====

function formatPrice(price) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function handleImgError(img) {
  img.onerror = null;
  img.src = 'https://via.placeholder.com/400x400?text=Produto';
}
