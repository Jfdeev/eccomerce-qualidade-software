"""
Adapter JSON para o repositório de usuários.

Princípio LSP: Substituível por qualquer implementação de UserRepositoryPort.
Princípio DIP: Implementa a interface definida no domínio.
"""

import json
from typing import Optional
from domain.ports import UserRepositoryPort
from domain.entities.user import User


class JsonUserRepository(UserRepositoryPort):
    """Implementação do repositório de usuários usando arquivo JSON."""

    def __init__(self, json_file_path: str):
        self._file_path = json_file_path
        self._users: list[User] = []
        self._load_data()

    def _load_data(self) -> None:
        """Carrega os dados do arquivo JSON."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self._users = [User.from_dict(u) for u in data.get("users", [])]

    def _save_data(self) -> None:
        """Persiste os dados no arquivo JSON."""
        with open(self._file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        data["users"] = [u.to_dict_with_password() for u in self._users]

        with open(self._file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def get_by_id(self, user_id: str) -> Optional[User]:
        """Retorna um usuário pelo ID."""
        for user in self._users:
            if user.id == user_id:
                return user
        return None

    def get_by_email(self, email: str) -> Optional[User]:
        """Retorna um usuário pelo email."""
        for user in self._users:
            if user.email.lower() == email.lower():
                return user
        return None

    def create(self, user: User) -> User:
        """Cria um novo usuário."""
        self._users.append(user)
        self._save_data()
        return user

    def update(self, user: User) -> None:
        """Atualiza um usuário."""
        for i, u in enumerate(self._users):
            if u.id == user.id:
                self._users[i] = user
                self._save_data()
                return
