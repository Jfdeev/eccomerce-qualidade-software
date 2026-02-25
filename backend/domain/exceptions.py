"""
Exceções de domínio.

Princípio ISP (Interface Segregation): Exceções específicas para cada caso,
permitindo tratamento granular de erros.
"""


class DomainException(Exception):
    """Exceção base do domínio."""
    pass


class ProductNotFoundException(DomainException):
    """Produto não encontrado."""
    def __init__(self, product_id: str):
        super().__init__(f"Produto com ID '{product_id}' não encontrado.")
        self.product_id = product_id


class UserNotFoundException(DomainException):
    """Usuário não encontrado."""
    def __init__(self, identifier: str):
        super().__init__(f"Usuário '{identifier}' não encontrado.")
        self.identifier = identifier


class UserAlreadyExistsException(DomainException):
    """Usuário já existe."""
    def __init__(self, email: str):
        super().__init__(f"Já existe um usuário com o email '{email}'.")
        self.email = email


class OrderNotFoundException(DomainException):
    """Pedido não encontrado."""
    def __init__(self, order_id: str):
        super().__init__(f"Pedido com ID '{order_id}' não encontrado.")
        self.order_id = order_id


class InsufficientStockException(DomainException):
    """Estoque insuficiente."""
    def __init__(self, product_id: str, available: int, requested: int):
        super().__init__(
            f"Estoque insuficiente para produto '{product_id}'. "
            f"Disponível: {available}, Solicitado: {requested}"
        )
        self.product_id = product_id
        self.available = available
        self.requested = requested


class InvalidCredentialsException(DomainException):
    """Credenciais inválidas."""
    def __init__(self):
        super().__init__("Email ou senha inválidos.")


class EmptyCartException(DomainException):
    """Carrinho vazio."""
    def __init__(self):
        super().__init__("O carrinho está vazio.")
