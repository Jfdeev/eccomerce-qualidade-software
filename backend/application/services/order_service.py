"""
Serviço de Pedidos - Camada de Aplicação (Use Cases).

Princípio SRP: Responsável apenas pela orquestração de operações de pedido.
Princípio DIP: Depende das abstrações (Ports).
Princípio OCP: Pode ser estendido para novos status sem modificar a lógica.
"""

import uuid
from typing import List
from domain.ports import OrderRepositoryPort, ProductRepositoryPort
from domain.entities.order import Order, OrderItem, OrderStatus
from domain.entities.cart import Cart
from domain.exceptions import (
    OrderNotFoundException,
    EmptyCartException,
    InsufficientStockException,
    ProductNotFoundException,
)


class OrderService:
    """Serviço que implementa os casos de uso relacionados a pedidos."""

    def __init__(
        self,
        order_repository: OrderRepositoryPort,
        product_repository: ProductRepositoryPort,
    ):
        """
        Princípio DIP: Recebe abstrações via injeção de dependência.
        Precisa do repositório de produtos para validar estoque.
        """
        self._order_repository = order_repository
        self._product_repository = product_repository

    def create_order_from_cart(
        self, cart: Cart, shipping_address: str
    ) -> Order:
        """
        Cria um pedido a partir do carrinho.

        Regras de negócio:
        1. Carrinho não pode estar vazio
        2. Todos os produtos devem ter estoque suficiente
        3. O estoque é decrementado ao criar o pedido
        """
        if not cart.items:
            raise EmptyCartException()

        # Validar estoque de todos os itens
        order_items: List[OrderItem] = []
        for cart_item in cart.items:
            product = self._product_repository.get_by_id(cart_item.product_id)
            if product is None:
                raise ProductNotFoundException(cart_item.product_id)

            if product.stock < cart_item.quantity:
                raise InsufficientStockException(
                    product.id, product.stock, cart_item.quantity
                )

            order_items.append(
                OrderItem(
                    product_id=cart_item.product_id,
                    product_name=cart_item.product_name,
                    quantity=cart_item.quantity,
                    size=cart_item.size,
                    color=cart_item.color,
                    unit_price=cart_item.unit_price,
                )
            )

        # Decrementar estoque
        for cart_item in cart.items:
            product = self._product_repository.get_by_id(cart_item.product_id)
            product.decrease_stock(cart_item.quantity)
            self._product_repository.update(product)

        # Criar pedido
        order = Order(
            id=str(uuid.uuid4()),
            user_id=cart.user_id,
            items=order_items,
            shipping_address=shipping_address,
        )

        return self._order_repository.create(order)

    def get_order(self, order_id: str) -> Order:
        """Busca um pedido pelo ID."""
        order = self._order_repository.get_by_id(order_id)
        if order is None:
            raise OrderNotFoundException(order_id)
        return order

    def get_user_orders(self, user_id: str) -> List[Order]:
        """Lista todos os pedidos de um usuário."""
        return self._order_repository.get_by_user_id(user_id)

    def cancel_order(self, order_id: str) -> Order:
        """Cancela um pedido e devolve o estoque."""
        order = self.get_order(order_id)
        order.cancel()

        # Devolver estoque
        for item in order.items:
            product = self._product_repository.get_by_id(item.product_id)
            if product:
                product.stock += item.quantity
                self._product_repository.update(product)

        self._order_repository.update(order)
        return order
