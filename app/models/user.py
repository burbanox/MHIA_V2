from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from typing import List

class User(Base):
    __tablename__ = "users"

    document_id : Mapped[str] = mapped_column(String, primary_key=True, index=True)
    username : Mapped[str] = mapped_column(String, unique=True, index=True)
    email : Mapped[str] = mapped_column(String,unique=True,index=True)
    hashed_password : Mapped[str] = mapped_column(String)
    name : Mapped[str] = mapped_column(String)
    tel : Mapped[str] = mapped_column(String)
    age : Mapped[int] = mapped_column(Integer)
    role : Mapped[str] = mapped_column(String, default="psicologo")

    #patients : Mapped[List["Patient"]] = relationship(back_populates="users")
