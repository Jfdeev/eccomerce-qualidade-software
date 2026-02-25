"""
Adapter JSON para o repositório de pedidos.

Princípio LSP: Substituível por qualquer implementação de OrderRepositoryPort.
Princípio DIP: Implementa a interface definida no domínio.
"""

import json
from typing import List, Optional
from domain.ports import OrderRepositoryPort
from domain.entities.order import Order


class JsonOrderRepository(OrderRepositoryPort):
    """Implementação do repositório de pedidos usando arquivo JSON."""

    def __init__(self, json_file_path: str):
        self._file_path = json_file_path
        self._orders: List[Order] = []
        self._load_data()

    def _load_data(self) -> None:
        """Carrega os dados do arquivo JSON."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self._orders = [Order.from_dict(o) for o in data.get("orders", [])]

    def _save_data(self) -> None:
        """Persiste os dados no arquivo JSON."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["orders"] = [o.to_dict() for o in self._orders]

        with open(self._file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def create(self, order: Order) -> Order:
        """Cria um novo pedido."""
        self._orders.append(order)
        self._save_data()
        return order

    def get_by_id(self, order_id: str) -> Optional[Order]:
        """Retorna um pedido pelo ID."""
        for order in self._orders:
            if order.id == order_id:
                return order
        return None

    def get_by_user_id(self, user_id: str) -> List[Order]:
        """Retorna todos os pedidos de um usuário."""
        return [o for o in self._orders if o.user_id == user_id]

    def update(self, order: Order) -> None:
        """Atualiza um pedido."""
        for i, o in enumerate(self._orders):
            if o.id == order.id:
                self._orders[i] = order
                self._save_data()
                return
