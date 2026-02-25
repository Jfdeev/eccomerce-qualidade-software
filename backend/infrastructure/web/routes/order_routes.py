"""
Rotas de Pedidos - Adapter Web (entrada HTTP).

Princípio SRP: Responsável apenas por receber requisições HTTP.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from infrastructure.web.dependencies import get_order_service
from domain.entities.cart import Cart, CartItem
from domain.exceptions import (
    OrderNotFoundException,
    EmptyCartException,
    InsufficientStockException,
    ProductNotFoundException,
)

router = APIRouter(prefix="/api/orders", tags=["Pedidos"])
service = get_order_service()


# --- DTOs ---

class CartItemRequest(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    size: str
    color: str
    unit_price: float
    image_url: str = ""


class CreateOrderRequest(BaseModel):
    user_id: str
    items: List[CartItemRequest]
    shipping_address: str


# --- Endpoints ---

@router.post("/")
def create_order(request: CreateOrderRequest):
    """Cria um novo pedido a partir dos itens do carrinho."""
    try:
        cart = Cart(user_id=request.user_id)
        for item in request.items:
            cart.add_item(
                CartItem(
                    product_id=item.product_id,
                    product_name=item.product_name,
                    quantity=item.quantity,
                    size=item.size,
                    color=item.color,
                    unit_price=item.unit_price,
                    image_url=item.image_url,
                )
            )

        order = service.create_order_from_cart(
            cart=cart,
            shipping_address=request.shipping_address,
        )
        return {
            "message": "Pedido criado com sucesso!",
            "order": order.to_dict(),
        }
    except EmptyCartException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ProductNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except InsufficientStockException as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user/{user_id}")
def get_user_orders(user_id: str):
    """Lista todos os pedidos de um usuário."""
    orders = service.get_user_orders(user_id)
    return {
        "orders": [o.to_dict() for o in orders],
        "total": len(orders),
    }


@router.get("/{order_id}")
def get_order(order_id: str):
    """Busca um pedido pelo ID."""
    try:
        order = service.get_order(order_id)
        return order.to_dict()
    except OrderNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{order_id}/cancel")
def cancel_order(order_id: str):
    """Cancela um pedido."""
    try:
        order = service.cancel_order(order_id)
        return {
            "message": "Pedido cancelado com sucesso!",
            "order": order.to_dict(),
        }
    except OrderNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
