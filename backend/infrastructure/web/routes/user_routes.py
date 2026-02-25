"""
Rotas de Usuários - Adapter Web (entrada HTTP).

Princípio SRP: Responsável apenas por receber requisições HTTP.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from infrastructure.web.dependencies import get_user_service
from domain.exceptions import (
    UserNotFoundException,
    UserAlreadyExistsException,
    InvalidCredentialsException,
)

router = APIRouter(prefix="/api/users", tags=["Usuários"])
service = get_user_service()


# --- DTOs (Data Transfer Objects) ---

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    address: Optional[str] = None
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


# --- Endpoints ---

@router.post("/register")
def register(request: RegisterRequest):
    """Registra um novo usuário."""
    try:
        user = service.register(
            name=request.name,
            email=request.email,
            password=request.password,
            address=request.address,
            phone=request.phone,
        )
        return {"message": "Usuário registrado com sucesso!", "user": user.to_dict()}
    except UserAlreadyExistsException as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.post("/login")
def login(request: LoginRequest):
    """Autentica um usuário."""
    try:
        user = service.login(email=request.email, password=request.password)
        return {"message": "Login realizado com sucesso!", "user": user.to_dict()}
    except InvalidCredentialsException as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/{user_id}")
def get_user(user_id: str):
    """Busca um usuário pelo ID."""
    try:
        user = service.get_user_by_id(user_id)
        return user.to_dict()
    except UserNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{user_id}")
def update_profile(user_id: str, request: UpdateProfileRequest):
    """Atualiza o perfil do usuário."""
    try:
        user = service.update_profile(
            user_id=user_id,
            name=request.name,
            address=request.address,
            phone=request.phone,
        )
        return {"message": "Perfil atualizado com sucesso!", "user": user.to_dict()}
    except UserNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
