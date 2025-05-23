from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..services.audio_transcription import AudioTranscriptionService
from app.models.session import Session
from app.models.patient import Patient
from app.models.user import User
from app.database import get_db
from app.routes.auth import get_current_user
import os
import shutil
import uuid

router = APIRouter(prefix="/transcription", tags=["transcription"])
transcription_service = AudioTranscriptionService()

@router.post("/session/{session_id}")
async def transcribe_session_audio(
    session_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Transcribe un archivo de audio y lo guarda en la sesión correspondiente.
    """
    # Validar que la sesión pertenece a un paciente del psicólogo actual
    stmt = (
        select(Session)
        .join(Patient)
        .where(Session.id == session_id, Patient.psychologist_id == current_user.document_id)
    )
    result = await db.execute(stmt)
    session = result.scalars().first()

    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada o no autorizada")

    # Crear nombre único temporal para el archivo
    temp_filename = f"temp/{uuid.uuid4().hex}_{file.filename}"
    os.makedirs("temp", exist_ok=True)

    # Guardar archivo temporalmente
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Transcribir el audio
        transcription = transcription_service.transcribe_audio(temp_filename)

        # Guardar la transcripción en la base de datos
        session.transcription = transcription
        await db.commit()
        await db.refresh(session)

        return {
            "message": "Transcripción guardada exitosamente",
            "transcription": transcription,
            "session_id": session.id
        }

    finally:
        # Asegurarse de eliminar el archivo temporal
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
