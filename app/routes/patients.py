from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate
from app.models.patient import Patient
from app.models.user import User
from app.routes.auth import get_current_user
from  app.database import get_db


router = APIRouter(prefix="/patients", tags=["patients"])



@router.post("/", response_model=PatientRead)
async def create_patient(
    patient: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_patient = Patient(**patient.dict(), psychologist_id=current_user.document_id)
    db.add(new_patient)
    await db.commit()
    await db.refresh(new_patient)

    return new_patient

@router.get("/{document_id}", response_model=PatientRead)
async def get_patient(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Patient).where(
        Patient.document_id == document_id,
        Patient.psychologist_id == current_user.document_id
    )
    result = await db.execute(stmt)
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    return patient

@router.put("/{document_id}", response_model=PatientRead)
async def update_patient(
    document_id: str,
    patient_update: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Patient).where(
        Patient.document_id == document_id,
        Patient.psychologist_id == current_user.document_id
    )
    result = await db.execute(stmt)
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    for key, value in patient_update.dict(exclude_unset=True).items():
        setattr(patient, key, value)

    await db.commit()
    await db.refresh(patient)
    return patient

@router.get("/", response_model=List[PatientRead])
async def list_patients(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Patient).where(Patient.psychologist_id == current_user.document_id)
    result = await db.execute(stmt)
    return result.scalars().all()



@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Patient).where(
        Patient.document_id == document_id,
        Patient.psychologist_id == current_user.document_id
    )
    result = await db.execute(stmt)
    patient = result.scalars().first()

    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    await db.delete(patient)
    await db.commit()
    return
