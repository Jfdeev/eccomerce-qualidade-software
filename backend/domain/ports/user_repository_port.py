"""
Port (interface) para o repositório de usuários.

Princípio DIP: O domínio define a interface.
Princípio ISP: Interface específica para operações de usuário.
"""

from abc import ABC, abstractmethod
from typing import Optional
from ..entities.user import User


class UserRepositoryPort(ABC):
    """Interface que define as operações de persistência de usuários."""

    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[User]:
        """Retorna um usuário pelo ID."""
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """Retorna um usuário pelo email."""
        pass

    @abstractmethod
    def create(self, user: User) -> User:
        """Cria um novo usuário."""
        pass

    @abstractmethod
    def update(self, user: User) -> None:
        """Atualiza um usuário."""
        pass
