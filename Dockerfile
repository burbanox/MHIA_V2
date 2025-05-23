# Usa una imagen base de Python 3.10 slim para reducir el tamaño
FROM python:3.10-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /code

# Copia solo los archivos de dependencias primero (mejora la cache de Docker)
COPY ./requirements.txt /code/requirements.txt

# Instala las dependencias sin usar la caché de pip
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Instalar FFmpeg y Whisper solo si USE_WHISPER está definido
ARG USE_WHISPER=false
RUN if [ "$USE_WHISPER" = "true" ]; then \
        apt-get update && apt-get install -y ffmpeg && \
        pip install --no-cache-dir openai-whisper; \
    fi

# Copia el código fuente de la aplicación
COPY . /code

# Expone el puerto 8000 (opcional, pero útil para referencia)
EXPOSE 8000

# Variable de entorno para evitar que Python genere archivos pyc y bytecode
ENV PYTHONUNBUFFERED=1

# Comando por defecto para producción (en desarrollo se sobrescribe con docker-compose.override.yml)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]