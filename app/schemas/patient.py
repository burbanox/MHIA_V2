from pydantic import BaseModel, EmailStr
from typing import Optional

# Esquema base reutilizable
class PatientBase(BaseModel):
    document_id: str
    email: EmailStr
    name: str
    tel: str
    age: int
    gender: str
    address: Optional[str] = None  # <-- Ahora es opcional
    city: Optional[str] = None     # <-- Ahora es opcional

# Crear paciente (POST)
class PatientCreate(PatientBase):
    pass

# Actualizar paciente (PUT o PATCH)
class PatientUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    tel: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

# Leer paciente (GET)
class PatientRead(PatientBase):
    psychologist_id: str  # quién es el psicólogo de este paciente

    class Config:
        orm_mode = True

