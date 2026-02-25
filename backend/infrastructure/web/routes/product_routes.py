"""
Rotas de Produtos - Adapter Web (entrada HTTP).

Princípio SRP: Responsável apenas por receber requisições HTTP
e delegar ao serviço de aplicação.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from infrastructure.web.dependencies import get_product_service
from domain.exceptions import ProductNotFoundException

router = APIRouter(prefix="/api/products", tags=["Produtos"])
service = get_product_service()


@router.get("/")
def list_products(
    category: Optional[str] = Query(None, description="Filtrar por categoria"),
    gender: Optional[str] = Query(None, description="Filtrar por gênero"),
    min_price: Optional[float] = Query(None, description="Preço mínimo"),
    max_price: Optional[float] = Query(None, description="Preço máximo"),
    size: Optional[str] = Query(None, description="Filtrar por tamanho"),
    search: Optional[str] = Query(None, description="Buscar por termo"),
):
    """Lista produtos com filtros opcionais."""
    products = service.filter_products(
        category=category,
        gender=gender,
        min_price=min_price,
        max_price=max_price,
        size=size,
        search=search,
    )
    return {"products": [p.to_dict() for p in products], "total": len(products)}


@router.get("/categories")
def list_categories():
    """Lista todas as categorias disponíveis."""
    categories = service.get_categories()
    return {"categories": categories}


@router.get("/{product_id}")
def get_product(product_id: str):
    """Busca um produto pelo ID."""
    try:
        product = service.get_product_by_id(product_id)
        return product.to_dict()
    except ProductNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
