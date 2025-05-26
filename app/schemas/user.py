# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    # Estos son los campos base para crear/leer/actualizar
    document_id: str
    username: str
    email: EmailStr
    name: str # Este es el campo que usaremos para el 'full_name' en el frontend
    tel: str
    age: int
    role: str = "psicologo" # Valor por defecto si no se especifica

    class Config:
        from_attributes = True # Para compatibilidad con SQLAlchemy (Pydantic v2+)

class UserCreate(UserBase):
    password: str # La contraseña solo es necesaria al crear un usuario

class UserLogin(BaseModel):
    username: str # Puedes usar el email como username para el login
    password: str

# Este es el esquema que se usa para LEER/DEVOLVER información del usuario
# NO debe incluir la contraseña ni el hash de la contraseña.
class UserRead(UserBase):
    # Aquí puedes añadir campos calculados si los necesitas,
    # o simplemente heredar de UserBase si todos los campos de UserBase
    # son seguros para exponer.

    # Si tu modelo User de SQLAlchemy tiene 'first_name' y 'last_name',
    # y quieres un 'full_name' en UserRead, puedes definirlo así:
    # @property
    # def full_name(self) -> str:
    #     return f"{self.first_name} {self.last_name}"
    # O, si 'name' ya es el nombre completo, simplemente se mapeará.
    pass

# Si tu UserRead incluye un campo 'password' o 'hashed_password'
# ¡BÓRRALO de UserRead!
# Por ejemplo, si tenías esto:
# class UserRead(UserBase):
#     password: str # ESTO CAUSA EL ERROR
# O:
# class UserRead(UserBase):
#     hashed_password: str # ESTO TAMBIÉN LO CAUSA Y ES UN RIESGO DE SEGURIDAD