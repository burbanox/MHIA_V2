import os
from fastapi import HTTPException

# Constantes
MODEL_SIZES = ["tiny", "base", "small", "medium", "large"]
DEFAULT_MODEL_SIZE = "base"
USE_WHISPER = os.getenv("USE_WHISPER", "false").lower() == "true"

class AudioTranscriptionService:
    def __init__(self, model_size: str = DEFAULT_MODEL_SIZE):
        """
        Inicializa el servicio de transcripción de audio con el modelo Whisper especificado.

        Args:
            model_size (str): Tamaño del modelo de Whisper a utilizar. 
                              Opciones: "tiny", "base", "small", "medium", "large".
                              Por defecto es "base".
        """
        self.model_size = model_size
        self.model = None

        if USE_WHISPER:
            self._initialize_whisper_model()
        else:
            print("Whisper no está habilitado. Para usarlo, establece USE_WHISPER=true.")

    def _initialize_whisper_model(self):
        """
        Inicializa el modelo de Whisper.
        """
        try:
            import whisper
            if self.model_size not in MODEL_SIZES:
                raise ValueError(f"Tamaño de modelo no válido. Opciones: {MODEL_SIZES}")
            self.model = whisper.load_model(self.model_size)
        except ImportError:
            raise ImportError("Whisper no está instalado. Por favor, instala whisper para usar este servicio.")

    def transcribe_audio(self, file_path: str) -> str:
        """
        Transcribe un archivo de audio a texto usando Whisper.

        Args:
            file_path (str): Ruta al archivo de audio que se desea transcribir.

        Returns:
            str: Texto transcrito del archivo de audio.

        Raises:
            HTTPException: Si el archivo no se encuentra o si Whisper no está habilitado.
        """
        if not USE_WHISPER:
            raise HTTPException(status_code=400, detail="Whisper no está habilitado. Establece USE_WHISPER=true para usarlo.")

        if not os.path.exists(file_path):
            raise HTTPException(status_code=400, detail="Archivo no encontrado")

        if self.model is None:
            raise HTTPException(status_code=500, detail="El modelo de Whisper no se ha inicializado correctamente.")

        result = self.model.transcribe(file_path)
        return result["text"]

# Ejemplo de uso
if __name__ == "__main__":
    service = AudioTranscriptionService()
    try:
        transcript = service.transcribe_audio("/home/burbanox/MHIA/audio_prueba.ogg")
        print("Transcripción:", transcript)
    except Exception as e:
        print(f"Error: {e}")