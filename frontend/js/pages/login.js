/**
 * Página de Login.
 */

registerPage('login', function (container, params) {
  const redirect = params.redirect || '';

  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">👗</span>
          <h1>Entrar</h1>
          <p>Acesse sua conta na Fashion Store</p>
        </div>

        <form class="auth-form" id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" id="login-email" placeholder="seu@email.com" required />
          </div>

          <div class="form-group">
            <label>Senha</label>
            <input type="password" class="form-input" id="login-password" placeholder="Sua senha" required />
          </div>

          <button type="submit" class="btn btn-primary btn-lg auth-submit" id="login-btn">
            Entrar
          </button>
        </form>

        <p class="auth-footer">
          Não tem uma conta?
          <a href="#" class="auth-link" onclick="navigateTo('register')">Criar conta</a>
        </p>

        <div class="demo-credentials">
          <p><strong>Usuários de teste:</strong></p>
          <p>joao@email.com / admin</p>
          <p>maria@email.com / admin</p>
          <p>carlos@email.com / admin</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const data = await loginUser(email, password);
      AppState.login(data.user);
      showToast(`Bem-vindo(a), ${data.user.name}!`, 'success');
      navigateTo(redirect === 'checkout' ? 'checkout' : 'home');
    } catch (error) {
      showToast(error.message || 'Erro ao fazer login', 'error');
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });
});
