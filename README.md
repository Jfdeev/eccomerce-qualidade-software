# 👗 Fashion Store — E-commerce de Roupas

> Material didático para a disciplina de **Qualidade de Software**

## 📋 Sobre o Projeto

E-commerce de roupas completo desenvolvido com foco em **boas práticas de engenharia de software**, servindo como material de estudo para análise de qualidade de código.

### Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | Python 3.10+ / FastAPI |
| **Frontend** | React 18 / Vite |
| **Banco de Dados** | Arquivo JSON |
| **Arquitetura** | Hexagonal (Ports & Adapters) |
| **Princípios** | SOLID |

---

## 🚀 Como Iniciar (Rápido)

### Pré-requisitos
- **Python 3.10+** instalado
- **Node.js 18+** instalado

### Manual (passo a passo)
**Terminal 1 — Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Acessos
| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **Swagger (API Docs)** | http://localhost:8000/docs |

### Usuários de Teste
| Email | Senha |
|-------|-------|
| joao@email.com | admin |
| maria@email.com | admin |
| carlos@email.com | admin |

---

## 🏗️ Arquitetura

### Visão Geral — Arquitetura Hexagonal

```
┌─────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                  │
│  ┌──────────┐  ┌─────────────────────────────┐  │
│  │   Web     │  │     Adapters (JSON DB)      │  │
│  │ (FastAPI) │  │  JsonProductRepository      │  │
│  │  Routes ──┼──│  JsonUserRepository         │  │
│  │           │  │  JsonOrderRepository        │  │
│  └──────────┘  └─────────────────────────────┘  │
│       │                    │                      │
│  ┌────▼────────────────────▼──────────────────┐  │
│  │           APPLICATION (Services)            │  │
│  │  ProductService  UserService  OrderService  │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                           │
│  ┌────────────────────▼───────────────────────┐  │
│  │              DOMAIN (Core)                  │  │
│  │  Entities: Product, User, Order, Cart       │  │
│  │  Ports: ProductRepo, UserRepo, OrderRepo    │  │
│  │  Exceptions: Domain-specific errors         │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Estrutura de Pastas

```
📦 eccomerce-qualidade-software/
├── 📂 backend/
│   ├── 📂 domain/                    # 🟢 Camada de Domínio (núcleo)
│   │   ├── 📂 entities/              # Entidades de negócio
│   │   │   ├── product.py
│   │   │   ├── user.py
│   │   │   ├── order.py
│   │   │   └── cart.py
│   │   ├── 📂 ports/                 # Interfaces (contratos)
│   │   │   ├── product_repository_port.py
│   │   │   ├── user_repository_port.py
│   │   │   └── order_repository_port.py
│   │   └── exceptions.py             # Exceções de domínio
│   │
│   ├── 📂 application/               # 🔵 Camada de Aplicação (use cases)
│   │   └── 📂 services/
│   │       ├── product_service.py
│   │       ├── user_service.py
│   │       └── order_service.py
│   │
│   ├── 📂 infrastructure/            # 🟡 Camada de Infraestrutura
│   │   ├── 📂 adapters/              # Implementações dos Ports
│   │   │   ├── json_product_repository.py
│   │   │   ├── json_user_repository.py
│   │   │   └── json_order_repository.py
│   │   ├── 📂 web/                   # Adapter HTTP (FastAPI)
│   │   │   ├── 📂 routes/
│   │   │   │   ├── product_routes.py
│   │   │   │   ├── user_routes.py
│   │   │   │   └── order_routes.py
│   │   │   └── dependencies.py       # Injeção de dependências
│   │   └── 📂 database/
│   │       └── data.json              # "Banco de dados" JSON
│   │
│   ├── main.py                        # Entry point
│   └── requirements.txt
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/            # Componentes reutilizáveis
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── ProductCard/
│   │   │   └── CartItem/
│   │   ├── 📂 pages/                 # Páginas da aplicação
│   │   │   ├── Home/
│   │   │   ├── ProductDetail/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── Orders/
│   │   ├── 📂 context/               # Estado global (React Context)
│   │   │   ├── CartContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── 📂 services/              # Comunicação com API
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── start.bat                          # Script Windows
├── start.sh                           # Script Linux/Mac
└── README.md
```

---

## 🎯 Princípios SOLID Aplicados

### S — Single Responsibility Principle
Cada classe tem **uma única responsabilidade**:
- `Product` → representa um produto
- `ProductService` → orquestra operações de produto
- `JsonProductRepository` → persiste dados em JSON
- `product_routes.py` → recebe requisições HTTP

### O — Open/Closed Principle
- O sistema de filtros em `ProductService.filter_products()` é extensível
- Novos tipos de repositório podem ser criados sem modificar os serviços

### L — Liskov Substitution Principle
- `JsonProductRepository` pode ser substituído por `SqlProductRepository` sem alterar o comportamento dos serviços

### I — Interface Segregation Principle
- Interfaces segregadas: `ProductRepositoryPort`, `UserRepositoryPort`, `OrderRepositoryPort`
- Exceções específicas: `ProductNotFoundException`, `InsufficientStockException`, etc.

### D — Dependency Inversion Principle
- Serviços dependem de **abstrações** (Ports), não de implementações
- A injeção é feita em `dependencies.py` (Composition Root)

---

## 📡 Endpoints da API

### Produtos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products/` | Lista produtos (com filtros) |
| GET | `/api/products/categories` | Lista categorias |
| GET | `/api/products/{id}` | Detalhes do produto |

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/users/register` | Registrar usuário |
| POST | `/api/users/login` | Login |
| GET | `/api/users/{id}` | Buscar usuário |
| PUT | `/api/users/{id}` | Atualizar perfil |

### Pedidos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/orders/` | Criar pedido |
| GET | `/api/orders/user/{user_id}` | Pedidos do usuário |
| GET | `/api/orders/{id}` | Detalhes do pedido |
| PUT | `/api/orders/{id}/cancel` | Cancelar pedido |

---

## 📝 Notas para a Aula

Este projeto foi criado especificamente para análise em aula de Qualidade de Software. Pontos interessantes para discussão:

1. **Arquitetura Hexagonal**: Como as camadas se comunicam e por que isso facilita testes
2. **SOLID na prática**: Identificar onde cada princípio foi aplicado
3. **Inversão de Dependência**: O domínio não conhece a infraestrutura
4. **Testabilidade**: Como mockar os repositórios para testes unitários
5. **Separação de Responsabilidades**: Frontend vs Backend, e dentro de cada um
6. **Tratamento de Erros**: Exceções tipadas no domínio
7. **Clean Code**: Nomes significativos, funções pequenas, comentários úteis
