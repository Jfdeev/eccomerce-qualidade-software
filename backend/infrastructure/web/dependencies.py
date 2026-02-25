"""
Módulo de injeção de dependências.

Princípio DIP: Aqui fazemos a composição (wiring) das dependências,
conectando as implementações concretas (adapters) às abstrações (ports).

Este é o único lugar onde as implementações concretas são instanciadas.
"""

import os
from infrastructure.adapters import (
    JsonProductRepository,
    JsonUserRepository,
    JsonOrderRepository,
)
from application.services import ProductService, UserService, OrderService

# Caminho para o arquivo JSON do banco de dados
DATABASE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "infrastructure",
    "database",
    "data.json",
)

# --- Repositórios (Adapters) ---
# Instanciamos as implementações concretas aqui
_product_repository = JsonProductRepository(DATABASE_PATH)
_user_repository = JsonUserRepository(DATABASE_PATH)
_order_repository = JsonOrderRepository(DATABASE_PATH)

# --- Services (Use Cases) ---
# Injetamos as abstrações nos serviços
_product_service = ProductService(_product_repository)
_user_service = UserService(_user_repository)
_order_service = OrderService(_order_repository, _product_repository)


def get_product_service() -> ProductService:
    """Retorna a instância do serviço de produtos."""
    return _product_service


def get_user_service() -> UserService:
    """Retorna a instância do serviço de usuários."""
    return _user_service


def get_order_service() -> OrderService:
    """Retorna a instância do serviço de pedidos."""
    return _order_service
