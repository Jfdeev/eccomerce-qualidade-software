/**
 * Página de Registro.
 */

registerPage('register', function (container) {
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">👗</span>
          <h1>Criar Conta</h1>
          <p>Cadastre-se na Fashion Store</p>
        </div>

        <form class="auth-form" id="register-form">
          <div class="form-group">
            <label>Nome completo *</label>
            <input type="text" class="form-input" id="reg-name" placeholder="Seu nome" required />
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input type="email" class="form-input" id="reg-email" placeholder="seu@email.com" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Senha *</label>
              <input type="password" class="form-input" id="reg-password" placeholder="Sua senha" required />
            </div>
            <div class="form-group">
              <label>Confirmar senha *</label>
              <input type="password" class="form-input" id="reg-confirm" placeholder="Repita a senha" required />
            </div>
          </div>

          <div class="form-group">
            <label>Endereço</label>
            <input type="text" class="form-input" id="reg-address" placeholder="Rua, número, cidade - UF" />
          </div>

          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" class="form-input" id="reg-phone" placeholder="(00) 00000-0000" />
          </div>

          <button type="submit" class="btn btn-primary btn-lg auth-submit" id="register-btn">
            Criar Conta
          </button>
        </form>

        <p class="auth-footer">
          Já tem uma conta?
          <a href="#" class="auth-link" onclick="navigateTo('login')">Entrar</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const address = document.getElementById('reg-address').value;
    const phone = document.getElementById('reg-phone').value;

    if (!name || !email || !password) {
      showToast('Preencha todos os campos obrigatórios', 'warning');
      return;
    }
    if (password !== confirm) {
      showToast('As senhas não coincidem', 'warning');
      return;
    }
    if (password.length < 3) {
      showToast('A senha deve ter pelo menos 3 caracteres', 'warning');
      return;
    }

    const btn = document.getElementById('register-btn');
    btn.disabled = true;
    btn.textContent = 'Criando conta...';

    try {
      const data = await registerUser({
        name,
        email,
        password,
        address: address || null,
        phone: phone || null,
      });
      AppState.login(data.user);
      showToast('Conta criada com sucesso!', 'success');
      navigateTo('home');
    } catch (error) {
      showToast(error.message || 'Erro ao criar conta', 'error');
      btn.disabled = false;
      btn.textContent = 'Criar Conta';
    }
  });
});
