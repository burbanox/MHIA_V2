from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from typing import List
from .session import Session


class Patient(Base):
    __tablename__ = "patients"
    
    document_id : Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name : Mapped[str]  = mapped_column(String, index=True)
    email : Mapped[str] = mapped_column(String, unique=True, index=True)
    tel : Mapped[str] = mapped_column()
    age : Mapped[int] = mapped_column()
    gender : Mapped[str] = mapped_column()
    address : Mapped[str] = mapped_column()
    city : Mapped[str] = mapped_column()

    psychologist_id: Mapped[str] = mapped_column(ForeignKey("users.document_id"))
    #psychologist: Mapped["User"] = relationship(back_populates="patients")

    sessions : Mapped[List["Session"]] = relationship(
        back_populates="patients",
        cascade="all, delete-orphan"
    )