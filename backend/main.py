"""
Ponto de entrada da aplicação - Composição Root.

Este é o único lugar onde todas as camadas são conectadas.
A aplicação segue a Arquitetura Hexagonal (Ports & Adapters):

┌─────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                  │
│  ┌──────────┐  ┌─────────────────────────────┐  │
│  │   Web     │  │     Adapters (JSON DB)      │  │
│  │  (FastAPI)│  │  ┌─────────────────────┐    │  │
│  │           │  │  │ JsonProductRepo     │    │  │
│  │  Routes ──┼──┤  │ JsonUserRepo        │    │  │
│  │           │  │  │ JsonOrderRepo       │    │  │
│  └──────────┘  │  └─────────────────────┘    │  │
│       │         └─────────────────────────────┘  │
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

Princípios SOLID aplicados:
- SRP: Cada classe tem uma única responsabilidade
- OCP: Extensível via novas implementações de Ports
- LSP: Adapters substituíveis sem alterar comportamento
- ISP: Interfaces segregadas por domínio (Product, User, Order)
- DIP: Dependências apontam para abstrações (Ports)
"""

import sys
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Adiciona o diretório backend ao path
sys.path.insert(0, os.path.dirname(__file__))

from infrastructure.web.routes.product_routes import router as product_router
from infrastructure.web.routes.user_routes import router as user_router
from infrastructure.web.routes.order_routes import router as order_router

# --- Criação da aplicação ---
app = FastAPI(
    title="Fashion Store API",
    description="API do E-commerce de Roupas - Material didático para Qualidade de Software",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# --- CORS (permitir acesso do frontend) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Registro de Rotas ---
app.include_router(product_router)
app.include_router(user_router)
app.include_router(order_router)


@app.get("/", tags=["Health"])
def health_check():
    """Verificação de saúde da API."""
    return {
        "status": "online",
        "message": "Fashion Store API está funcionando!",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
