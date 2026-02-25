"""
Port (interface) para o repositório de produtos.

Princípio DIP (Dependency Inversion): O domínio define a interface,
e a infraestrutura a implementa. O domínio não depende de detalhes
de implementação (JSON, SQL, etc).

Princípio ISP: Interface específica para operações de produto.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.product import Product


class ProductRepositoryPort(ABC):
    """Interface que define as operações de persistência de produtos."""

    @abstractmethod
    def get_all(self) -> List[Product]:
        """Retorna todos os produtos."""
        pass

    @abstractmethod
    def get_by_id(self, product_id: str) -> Optional[Product]:
        """Retorna um produto pelo ID."""
        pass

    @abstractmethod
    def get_by_category(self, category: str) -> List[Product]:
        """Retorna produtos filtrados por categoria."""
        pass

    @abstractmethod
    def search(self, query: str) -> List[Product]:
        """Busca produtos por nome ou descrição."""
        pass

    @abstractmethod
    def update(self, product: Product) -> None:
        """Atualiza um produto."""
        pass

    @abstractmethod
    def get_categories(self) -> List[str]:
        """Retorna todas as categorias disponíveis."""
        pass
