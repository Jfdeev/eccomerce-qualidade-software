"""
Entidade Cart - representa o carrinho de compras.

Princípio SRP: Responsável apenas pela lógica do carrinho.
"""

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class CartItem:
    product_id: str
    product_name: str
    quantity: int
    size: str
    color: str
    unit_price: float
    image_url: str = ""

    @property
    def subtotal(self) -> float:
        return self.quantity * self.unit_price

    def to_dict(self) -> dict:
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "quantity": self.quantity,
            "size": self.size,
            "color": self.color,
            "unit_price": self.unit_price,
            "image_url": self.image_url,
            "subtotal": self.subtotal,
        }

    @staticmethod
    def from_dict(data: dict) -> "CartItem":
        return CartItem(
            product_id=data["product_id"],
            product_name=data["product_name"],
            quantity=data["quantity"],
            size=data["size"],
            color=data["color"],
            unit_price=data["unit_price"],
            image_url=data.get("image_url", ""),
        )


@dataclass
class Cart:
    user_id: str
    items: List[CartItem] = field(default_factory=list)

    @property
    def total(self) -> float:
        """Calcula o total do carrinho."""
        return sum(item.subtotal for item in self.items)

    @property
    def items_count(self) -> int:
        """Retorna a quantidade total de itens no carrinho."""
        return sum(item.quantity for item in self.items)

    def add_item(self, item: CartItem) -> None:
        """
        Adiciona item ao carrinho. Se já existir (mesmo produto, tamanho e cor),
        incrementa a quantidade.

        Princípio OCP: A lógica pode ser estendida para promoções sem modificação.
        """
        for existing in self.items:
            if (
                existing.product_id == item.product_id
                and existing.size == item.size
                and existing.color == item.color
            ):
                existing.quantity += item.quantity
                return
        self.items.append(item)

    def remove_item(self, product_id: str, size: str, color: str) -> None:
        """Remove um item do carrinho."""
        self.items = [
            item
            for item in self.items
            if not (
                item.product_id == product_id
                and item.size == size
                and item.color == color
            )
        ]

    def update_quantity(
        self, product_id: str, size: str, color: str, quantity: int
    ) -> None:
        """Atualiza a quantidade de um item no carrinho."""
        if quantity <= 0:
            self.remove_item(product_id, size, color)
            return
        for item in self.items:
            if (
                item.product_id == product_id
                and item.size == size
                and item.color == color
            ):
                item.quantity = quantity
                return
        raise ValueError("Item não encontrado no carrinho.")

    def clear(self) -> None:
        """Limpa o carrinho."""
        self.items.clear()

    def to_dict(self) -> dict:
        return {
            "user_id": self.user_id,
            "items": [item.to_dict() for item in self.items],
            "total": self.total,
            "items_count": self.items_count,
        }
