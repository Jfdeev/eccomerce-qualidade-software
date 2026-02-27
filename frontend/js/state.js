/**
 * Gerenciamento de Estado Global.
 *
 * Gerencia autenticação (user) e carrinho (cart) com persistência em localStorage.
 */

const AppState = {
  // ===== Autenticação =====
  _user: null,

  getUser() {
    if (!this._user) {
      const saved = localStorage.getItem('fashion-store-user');
      if (saved) {
        try { this._user = JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return this._user;
  },

  login(userData) {
    this._user = userData;
    localStorage.setItem('fashion-store-user', JSON.stringify(userData));
    updateHeaderActions();
  },

  logout() {
    this._user = null;
    localStorage.removeItem('fashion-store-user');
    updateHeaderActions();
    navigateTo('home');
  },

  isAuthenticated() {
    return !!this.getUser();
  },

  // ===== Carrinho =====
  _cartItems: null,

  _loadCart() {
    if (this._cartItems === null) {
      const saved = localStorage.getItem('fashion-store-cart');
      if (saved) {
        try { this._cartItems = JSON.parse(saved); } catch (e) { this._cartItems = []; }
      } else {
        this._cartItems = [];
      }
    }
  },

  _saveCart() {
    localStorage.setItem('fashion-store-cart', JSON.stringify(this._cartItems));
    updateHeaderActions();
  },

  getCartItems() {
    this._loadCart();
    return this._cartItems;
  },

  addCartItem(item) {
    this._loadCart();
    const idx = this._cartItems.findIndex(
      (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color
    );
    if (idx >= 0) {
      this._cartItems[idx].quantity += item.quantity;
    } else {
      this._cartItems.push({ ...item });
    }
    this._saveCart();
  },

  removeCartItem(productId, size, color) {
    this._loadCart();
    this._cartItems = this._cartItems.filter(
      (i) => !(i.product_id === productId && i.size === size && i.color === color)
    );
    this._saveCart();
  },

  updateCartQuantity(productId, size, color, quantity) {
    this._loadCart();
    if (quantity <= 0) {
      this.removeCartItem(productId, size, color);
      return;
    }
    const item = this._cartItems.find(
      (i) => i.product_id === productId && i.size === size && i.color === color
    );
    if (item) {
      item.quantity = quantity;
      this._saveCart();
    }
  },

  clearCart() {
    this._cartItems = [];
    this._saveCart();
  },

  getCartTotal() {
    this._loadCart();
    return this._cartItems.reduce((t, i) => t + i.unit_price * i.quantity, 0);
  },

  getCartCount() {
    this._loadCart();
    return this._cartItems.reduce((c, i) => c + i.quantity, 0);
  },
};
