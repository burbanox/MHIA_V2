from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, index=True)  # Changed to int for clarity
    patient_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("patients.document_id", ondelete="CASCADE"),
        nullable=False
    )
    # Changed to datetime type for clarity
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    audio_url: Mapped[str] = mapped_column(String(255), nullable=False)
    transcription: Mapped[str] = mapped_column(Text, nullable=True)
    analysis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(
        # <--- IMPORTANT CHANGE
        timezone=True), default=lambda: datetime.now(timezone.utc))
    patients: Mapped["Patient"] = relationship(back_populates="sessions")
