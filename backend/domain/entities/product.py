"""
Entidade Product - representa um produto no catálogo de roupas.

Princípio SRP (Single Responsibility): Esta classe é responsável apenas
por representar os dados e regras de negócio de um produto.
"""

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Product:
    id: str
    name: str
    description: str
    price: float
    category: str
    sizes: List[str]
    colors: List[str]
    image_url: str
    stock: int
    brand: str
    gender: str  # "masculino", "feminino", "unissex"
    rating: float = 0.0
    reviews_count: int = 0

    def is_available(self) -> bool:
        """Verifica se o produto está disponível em estoque."""
        return self.stock > 0

    def has_size(self, size: str) -> bool:
        """Verifica se o produto está disponível no tamanho especificado."""
        return size.upper() in [s.upper() for s in self.sizes]

    def has_color(self, color: str) -> bool:
        """Verifica se o produto está disponível na cor especificada."""
        return color.lower() in [c.lower() for c in self.colors]

    def decrease_stock(self, quantity: int) -> None:
        """
        Diminui o estoque do produto.
        
        Princípio: Encapsulamento - a lógica de validação de estoque
        está dentro da própria entidade.
        """
        if quantity > self.stock:
            raise ValueError(
                f"Estoque insuficiente. Disponível: {self.stock}, Solicitado: {quantity}"
            )
        if quantity <= 0:
            raise ValueError("Quantidade deve ser maior que zero.")
        self.stock -= quantity

    def to_dict(self) -> dict:
        """Converte a entidade para dicionário."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "sizes": self.sizes,
            "colors": self.colors,
            "image_url": self.image_url,
            "stock": self.stock,
            "brand": self.brand,
            "gender": self.gender,
            "rating": self.rating,
            "reviews_count": self.reviews_count,
        }

    @staticmethod
    def from_dict(data: dict) -> "Product":
        """Cria uma instância de Product a partir de um dicionário."""
        return Product(
            id=data["id"],
            name=data["name"],
            description=data["description"],
            price=data["price"],
            category=data["category"],
            sizes=data.get("sizes", []),
            colors=data.get("colors", []),
            image_url=data.get("image_url", ""),
            stock=data.get("stock", 0),
            brand=data.get("brand", ""),
            gender=data.get("gender", "unissex"),
            rating=data.get("rating", 0.0),
            reviews_count=data.get("reviews_count", 0),
        )
