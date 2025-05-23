from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db  # usa async
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.auth import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Verificar si ya existe
    stmt = select(User).where(User.document_id == user.document_id)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con esa cédula"
        )

    hashed_password = get_password_hash(user.password)

    db_user = User(**user.dict(exclude={"password"}), hashed_password=hashed_password)

    db.add(db_user)

    try:
        await db.commit()
        await db.refresh(db_user)
        return {
            "message": "Usuario registrado exitosamente",
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar el usuario: {str(e)}"
        )
