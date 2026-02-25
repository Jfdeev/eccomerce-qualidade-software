"""
Serviço de Produtos - Camada de Aplicação (Use Cases).

Princípio SRP: Responsável apenas pela orquestração de operações de produto.
Princípio DIP: Depende da abstração (ProductRepositoryPort), não da implementação.
Princípio OCP: Pode ser estendido para novos filtros sem modificar o código existente.
"""

from typing import List, Optional
from domain.ports import ProductRepositoryPort
from domain.entities.product import Product
from domain.exceptions import ProductNotFoundException


class ProductService:
    """Serviço que implementa os casos de uso relacionados a produtos."""

    def __init__(self, product_repository: ProductRepositoryPort):
        """
        Princípio DIP: Recebe a abstração via injeção de dependência.
        O serviço não sabe se os dados vêm de JSON, SQL, API, etc.
        """
        self._repository = product_repository

    def list_all_products(self) -> List[Product]:
        """Lista todos os produtos disponíveis."""
        return self._repository.get_all()

    def get_product_by_id(self, product_id: str) -> Product:
        """Busca um produto pelo ID."""
        product = self._repository.get_by_id(product_id)
        if product is None:
            raise ProductNotFoundException(product_id)
        return product

    def list_by_category(self, category: str) -> List[Product]:
        """Lista produtos por categoria."""
        return self._repository.get_by_category(category)

    def search_products(self, query: str) -> List[Product]:
        """Busca produtos por termo de pesquisa."""
        return self._repository.search(query)

    def get_categories(self) -> List[str]:
        """Retorna todas as categorias disponíveis."""
        return self._repository.get_categories()

    def filter_products(
        self,
        category: Optional[str] = None,
        gender: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        size: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[Product]:
        """
        Filtra produtos com múltiplos critérios.

        Princípio OCP: Novos filtros podem ser adicionados sem alterar
        a lógica existente.
        """
        if search:
            products = self._repository.search(search)
        elif category:
            products = self._repository.get_by_category(category)
        else:
            products = self._repository.get_all()

        if gender:
            products = [
                p for p in products
                if p.gender.lower() == gender.lower() or p.gender.lower() == "unissex"
            ]

        if min_price is not None:
            products = [p for p in products if p.price >= min_price]

        if max_price is not None:
            products = [p for p in products if p.price <= max_price]

        if size:
            products = [p for p in products if p.has_size(size)]

        return products
