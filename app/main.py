from fastapi import FastAPI
from app.routes import auth, users, patients, sessions,audio
from app.database import init_db
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from contextlib import asynccontextmanager



@asynccontextmanager
async def lifespan(app : FastAPI):
    await init_db()
    yield


app = FastAPI(title="Plataforma Psicólogos",lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las solicitudes (solo para desarrollo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="app/static"), name="static")


# Incluir rutas
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(audio.router, prefix="/audio", tags=["Audio"])
app.include_router(patients.router)
app.include_router(sessions.router)


@app.get("/")
async def read_root():
    return {"message": "API funcionando. Ve a /static/index.html para la interfaz"}
