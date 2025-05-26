from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.routes.auth import get_current_user # Assuming get_current_user is defined here
from app.models.session import Session
from app.models.patient import Patient # Make sure you import Patient
from app.models.user import User
from app.schemas.session import SessionCreate, SessionRead, SessionUpdate
from typing import List

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/", response_model=SessionRead)
async def create_session(
    session_data: SessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verifica que el paciente pertenezca al psicólogo logueado
    stmt = select(Patient).where(
        Patient.document_id == session_data.patient_id, # <--- CHANGE THIS LINE
        Patient.psychologist_id == current_user.document_id
    )
    result = await db.execute(stmt)
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=403, detail="Paciente no autorizado o no encontrado.") # More descriptive error

    new_session = Session(**session_data.dict())
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session

@router.get("/{session_id}", response_model=SessionRead)
async def get_session(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = (
        select(Session)
        .join(Patient)
        .where(
            Session.id == session_id,
            Patient.psychologist_id == current_user.document_id # Verify patient belongs to psychologist
        )
    )
    result = await db.execute(stmt)
    session = result.scalars().first()

    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada o no autorizada.") # More descriptive error

    return session


@router.put("/{session_id}", response_model=SessionRead)
async def update_session(
    session_id: int,
    update_data: SessionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = (
        select(Session)
        .join(Patient)
        .where(
            Session.id == session_id,
            Patient.psychologist_id == current_user.document_id # Verify patient belongs to psychologist
        )
    )
    result = await db.execute(stmt)
    session = result.scalars().first()

    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada o no autorizada.") # More descriptive error

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(session, field, value)

    await db.commit()
    await db.refresh(session)
    return session


@router.get("/patient/{patient_document_id}", response_model=List[SessionRead]) # <--- Changed parameter name for clarity
async def list_sessions_by_patient(
    patient_document_id: str, # <--- Changed parameter name for clarity
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = (
        select(Session)
        .join(Patient)
        .where(
            Session.patient_id == patient_document_id, # <--- Use patient_document_id here
            Patient.psychologist_id == current_user.document_id
        )
        .order_by(Session.date.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()