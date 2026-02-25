"""
Entidade User - representa um usuário do sistema.

Princípio SRP: Responsável apenas por representar dados e regras do usuário.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class User:
    id: str
    name: str
    email: str
    password_hash: str
    address: Optional[str] = None
    phone: Optional[str] = None

    def to_dict(self) -> dict:
        """Converte a entidade para dicionário (sem expor a senha)."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "address": self.address,
            "phone": self.phone,
        }

    def to_dict_with_password(self) -> dict:
        """Converte a entidade para dicionário (com hash da senha para persistência)."""
        data = self.to_dict()
        data["password_hash"] = self.password_hash
        return data

    @staticmethod
    def from_dict(data: dict) -> "User":
        """Cria uma instância de User a partir de um dicionário."""
        return User(
            id=data["id"],
            name=data["name"],
            email=data["email"],
            password_hash=data.get("password_hash", ""),
            address=data.get("address"),
            phone=data.get("phone"),
        )
