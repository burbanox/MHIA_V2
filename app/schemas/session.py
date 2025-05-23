from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SessionBase(BaseModel):
    date: datetime
    audio_url: str


class SessionCreate(SessionBase):
    patient_id: str 


class SessionUpdate(BaseModel):
    transcription: Optional[str] = None
    analysis: Optional[str] = None


class SessionRead(SessionBase):
    id: int
    patient_id: str
    transcription: Optional[str] = None
    analysis: Optional[str] = None

    class Config:
        orm_mode = True

