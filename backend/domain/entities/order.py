"""
Entidade Order - representa um pedido no sistema.

Princípio SRP: Responsável apenas por representar dados e regras de um pedido.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List
from datetime import datetime


class OrderStatus(str, Enum):
    PENDING = "pendente"
    CONFIRMED = "confirmado"
    SHIPPED = "enviado"
    DELIVERED = "entregue"
    CANCELLED = "cancelado"


@dataclass
class OrderItem:
    product_id: str
    product_name: str
    quantity: int
    size: str
    color: str
    unit_price: float

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
            "subtotal": self.subtotal,
        }

    @staticmethod
    def from_dict(data: dict) -> "OrderItem":
        return OrderItem(
            product_id=data["product_id"],
            product_name=data["product_name"],
            quantity=data["quantity"],
            size=data["size"],
            color=data["color"],
            unit_price=data["unit_price"],
        )


@dataclass
class Order:
    id: str
    user_id: str
    items: List[OrderItem]
    status: OrderStatus = OrderStatus.PENDING
    created_at: str = ""
    shipping_address: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    @property
    def total(self) -> float:
        """Calcula o total do pedido."""
        return sum(item.subtotal for item in self.items)

    def cancel(self) -> None:
        """
        Cancela o pedido.
        Regra de negócio: só pode cancelar pedidos pendentes ou confirmados.
        """
        if self.status in (OrderStatus.SHIPPED, OrderStatus.DELIVERED):
            raise ValueError(
                f"Não é possível cancelar um pedido com status '{self.status.value}'."
            )
        self.status = OrderStatus.CANCELLED

    def confirm(self) -> None:
        """Confirma o pedido."""
        if self.status != OrderStatus.PENDING:
            raise ValueError("Apenas pedidos pendentes podem ser confirmados.")
        self.status = OrderStatus.CONFIRMED

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "items": [item.to_dict() for item in self.items],
            "status": self.status.value,
            "total": self.total,
            "created_at": self.created_at,
            "shipping_address": self.shipping_address,
        }

    @staticmethod
    def from_dict(data: dict) -> "Order":
        return Order(
            id=data["id"],
            user_id=data["user_id"],
            items=[OrderItem.from_dict(item) for item in data["items"]],
            status=OrderStatus(data.get("status", "pendente")),
            created_at=data.get("created_at", ""),
            shipping_address=data.get("shipping_address", ""),
        )
