"""
Serviço de Usuários - Camada de Aplicação (Use Cases).

Princípio SRP: Responsável apenas pela orquestração de operações de usuário.
Princípio DIP: Depende da abstração (UserRepositoryPort).
"""

import hashlib
import uuid
from typing import Optional
from domain.ports import UserRepositoryPort
from domain.entities.user import User
from domain.exceptions import (
    UserNotFoundException,
    UserAlreadyExistsException,
    InvalidCredentialsException,
)


class UserService:
    """Serviço que implementa os casos de uso relacionados a usuários."""

    def __init__(self, user_repository: UserRepositoryPort):
        self._repository = user_repository

    @staticmethod
    def _hash_password(password: str) -> str:
        """Hash simples da senha (para fins didáticos, não usar em produção)."""
        return hashlib.sha256(password.encode()).hexdigest()

    def register(
        self,
        name: str,
        email: str,
        password: str,
        address: Optional[str] = None,
        phone: Optional[str] = None,
    ) -> User:
        """
        Registra um novo usuário.
        
        Regras de negócio:
        - Email deve ser único
        - Senha é armazenada como hash
        """
        existing = self._repository.get_by_email(email)
        if existing is not None:
            raise UserAlreadyExistsException(email)

        user = User(
            id=str(uuid.uuid4()),
            name=name,
            email=email,
            password_hash=self._hash_password(password),
            address=address,
            phone=phone,
        )

        return self._repository.create(user)

    def login(self, email: str, password: str) -> User:
        """
        Autentica um usuário.
        
        Retorna o usuário se as credenciais forem válidas.
        """
        user = self._repository.get_by_email(email)
        if user is None:
            raise InvalidCredentialsException()

        if user.password_hash != self._hash_password(password):
            raise InvalidCredentialsException()

        return user

    def get_user_by_id(self, user_id: str) -> User:
        """Busca um usuário pelo ID."""
        user = self._repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundException(user_id)
        return user

    def update_profile(
        self,
        user_id: str,
        name: Optional[str] = None,
        address: Optional[str] = None,
        phone: Optional[str] = None,
    ) -> User:
        """Atualiza o perfil do usuário."""
        user = self.get_user_by_id(user_id)

        if name:
            user.name = name
        if address is not None:
            user.address = address
        if phone is not None:
            user.phone = phone

        self._repository.update(user)
        return user
