
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL
from app.models import Base

# Crear el motor asíncrono
engine = create_async_engine(DATABASE_URL, echo=True)

# Crear la sesión asíncrona
async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

# Dependencia de sesión para FastAPI
async def get_db():
    async with async_session() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
