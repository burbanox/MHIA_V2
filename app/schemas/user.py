from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    document_id: str
    username : str
    password : str
    email: str
    name: str
    tel: str
    age: int
    role : str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    class Config:
        orm_mode = True
