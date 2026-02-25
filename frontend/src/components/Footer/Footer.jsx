import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>👗 Fashion Store</h3>
          <p>E-commerce de roupas desenvolvido como material didático para a disciplina de Qualidade de Software.</p>
        </div>
        <div className="footer-section">
          <h4>Arquitetura</h4>
          <ul>
            <li>Backend: Python + FastAPI</li>
            <li>Frontend: React + Vite</li>
            <li>Padrão: Hexagonal + SOLID</li>
            <li>Banco: JSON File</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/docs" target="_blank" rel="noreferrer">API Docs (Swagger)</a></li>
            <li><a href="/redoc" target="_blank" rel="noreferrer">API Docs (ReDoc)</a></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Fashion Store — Qualidade de Software</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
