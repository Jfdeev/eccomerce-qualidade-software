"""
Port (interface) para o repositório de pedidos.

Princípio DIP: O domínio define a interface.
Princípio ISP: Interface específica para operações de pedido.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.order import Order


class OrderRepositoryPort(ABC):
    """Interface que define as operações de persistência de pedidos."""

    @abstractmethod
    def create(self, order: Order) -> Order:
        """Cria um novo pedido."""
        pass

    @abstractmethod
    def get_by_id(self, order_id: str) -> Optional[Order]:
        """Retorna um pedido pelo ID."""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: str) -> List[Order]:
        """Retorna todos os pedidos de um usuário."""
        pass

    @abstractmethod
    def update(self, order: Order) -> None:
        """Atualiza um pedido."""
        pass
