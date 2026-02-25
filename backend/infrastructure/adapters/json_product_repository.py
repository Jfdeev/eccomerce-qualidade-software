"""
Adapter JSON para o repositório de produtos.

Princípio LSP (Liskov Substitution): Esta implementação pode substituir
qualquer outra que implemente ProductRepositoryPort sem alterar o
comportamento esperado.

Princípio DIP: Implementa a interface definida no domínio.
"""

import json
from typing import List, Optional
from domain.ports import ProductRepositoryPort
from domain.entities.product import Product


class JsonProductRepository(ProductRepositoryPort):
    """Implementação do repositório de produtos usando arquivo JSON."""

    def __init__(self, json_file_path: str):
        self._file_path = json_file_path
        self._products: List[Product] = []
        self._load_data()

    def _load_data(self) -> None:
        """Carrega os dados do arquivo JSON."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self._products = [Product.from_dict(p) for p in data.get("products", [])]

    def _save_data(self) -> None:
        """Persiste os dados no arquivo JSON."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["products"] = [p.to_dict() for p in self._products]

        with open(self._file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def get_all(self) -> List[Product]:
        """Retorna todos os produtos."""
        return list(self._products)

    def get_by_id(self, product_id: str) -> Optional[Product]:
        """Retorna um produto pelo ID."""
        for product in self._products:
            if product.id == product_id:
                return product
        return None

    def get_by_category(self, category: str) -> List[Product]:
        """Retorna produtos filtrados por categoria."""
        return [
            p for p in self._products
            if p.category.lower() == category.lower()
        ]

    def search(self, query: str) -> List[Product]:
        """Busca produtos por nome ou descrição."""
        query_lower = query.lower()
        return [
            p for p in self._products
            if query_lower in p.name.lower()
            or query_lower in p.description.lower()
            or query_lower in p.brand.lower()
        ]

    def update(self, product: Product) -> None:
        """Atualiza um produto."""
        for i, p in enumerate(self._products):
            if p.id == product.id:
                self._products[i] = product
                self._save_data()
                return

    def get_categories(self) -> List[str]:
        """Retorna todas as categorias disponíveis."""
        categories = set()
        for product in self._products:
            categories.add(product.category)
        return sorted(list(categories))
