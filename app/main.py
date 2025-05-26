from fastapi import FastAPI
from app.routes import auth, users, patients, sessions, audio
from app.database import init_db
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Importa SPAStaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Plataforma Psicólogos", lifespan=lifespan)

origins = [
    "http://localhost:5173",  # Tu aplicación React
    "http://127.0.0.1:5173",  # Otra forma común de acceder a localhost
    # Añade cualquier otro origen desde donde accedas a tu API
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # <-- Usar la lista explícita
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Incluir rutas de la API
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(audio.router, prefix="/audio", tags=["Audio"])
app.include_router(patients.router)
app.include_router(sessions.router)

# --- Configuración para servir la carpeta dist de React ---

# Define la ruta a tu carpeta dist de React
# Asegúrate de que esta ruta sea correcta con respecto a la ubicación de tu main.py
# Por ejemplo, si main.py está en la raíz de tu proyecto y dist está en la raíz también:
REACT_BUILD_DIR = Path("/code/app/dist") # <--- ¡CAMBIO AQUÍ!

# Si tienes tu app React en una subcarpeta, por ejemplo 'frontend/dist':
# REACT_BUILD_DIR = Path(__file__).parent.parent / "frontend" / "dist"


# Verifica si la carpeta dist existe
if not REACT_BUILD_DIR.is_dir():
    print(f"Advertencia: La carpeta de construcción de React no se encontró en {REACT_BUILD_DIR}")
    print("Asegúrate de que tu aplicación React esté construida y la carpeta 'dist' exista.")
    print("Si estás en desarrollo, puedes comentar la sección de StaticFiles por ahora.")
    # O podrías lanzar una excepción si prefieres que la aplicación no se inicie sin la carpeta
    # raise RuntimeError(f"React build directory not found at {REACT_BUILD_DIR}")


# Sirve los archivos estáticos de la aplicación React
# La ruta "/" es importante para que capture todas las demás rutas.
# El nombre "react_app" es opcional.
app.mount("/", StaticFiles(directory=REACT_BUILD_DIR, html=True), name="react_app")

# Opcional: Una ruta para el root si quieres que sea diferente de la SPA
# @app.get("/")
# async def read_root():
#     return {"message": "API funcionando. La UI está disponible en la raíz."}