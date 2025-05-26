import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSession, getPatientById } from '../services/sessions'; // Asegúrate de que esta ruta sea correcta
import '../assets/css/CreateSession.css';

function CreateSession() {
  const navigate = useNavigate();
  const { patientDocumentId } = useParams();

  const [patientName, setPatientName] = useState('Cargando...');
  const [sessionData, setSessionData] = useState({
    patient_id: patientDocumentId,
    date: '',
    audio_url: '', // Esta será la URL final (subida o grabada)
    transcription: '',
  });

  // Estados para la funcionalidad de audio
  const [audioFile, setAudioFile] = useState(null); // Para el archivo MP3 subido
  const [recording, setRecording] = useState(false); // Estado de la grabación
  const [audioBlob, setAudioBlob] = useState(null); // El blob de audio grabado
  const mediaRecorderRef = useRef(null); // Referencia al MediaRecorder
  const audioChunksRef = useRef([]); // Para almacenar los chunks de audio durante la grabación
  const audioPreviewRef = useRef(null); // Referencia al elemento <audio> para previsualizar
  const fileInputRef = useRef(null); // Referencia al input de tipo file

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const patient = await getPatientById(patientDocumentId);
        setPatientName(patient.name || 'Paciente Desconocido');
      } catch (err) {
        console.error('Error al obtener el nombre del paciente:', err);
        setPatientName('Paciente Desconocido');
      }
    };

    if (patientDocumentId) {
      fetchPatientName();
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSessionData(prevData => ({
        ...prevData,
        date: `${year}-${month}-${day}T${hours}:${minutes}`,
      }));
    } else {
      setError('ID de paciente no proporcionado.');
    }
  }, [patientDocumentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Funcionalidad de Subida de Archivo ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'audio/mpeg') { // Validar que sea MP3
      setAudioFile(file);
      setAudioBlob(null); // Limpiar cualquier grabación si se sube un archivo
      setSessionData(prevData => ({ ...prevData, audio_url: '' })); // Limpiar URL previa
      setError(null);
    } else {
      setAudioFile(null);
      setError('Por favor, selecciona un archivo MP3 válido.');
    }
  };

  // Función para abrir el selector de archivos al hacer clic en el botón
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  // --- Funcionalidad de Grabación de Audio ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = []; // Limpiar chunks anteriores
      setAudioBlob(null); // Limpiar grabación anterior
      setAudioFile(null); // Limpiar archivo subido si se inicia grabación
      setSessionData(prevData => ({ ...prevData, audio_url: '' })); // Limpiar URL previa
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Limpiar el input de archivo
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // Usa audio/mp3 o audio/mpeg según sea compatible con tu navegador.
        // audio/webm es más universal, pero si tu backend espera MP3, podría ser un problema.
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' }); // Asume MP3
        setAudioBlob(audioBlob);
        // Genera una URL de objeto temporal para la previsualización
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioPreviewRef.current) {
          audioPreviewRef.current.src = audioUrl;
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setError(null);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      setError('No se pudo acceder al micrófono. Asegúrate de dar permiso.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Detener la pista del micrófono
      setRecording(false);
    }
  };

  const resetAudio = () => {
    setAudioFile(null);
    setAudioBlob(null);
    if (audioPreviewRef.current) {
        audioPreviewRef.current.src = ''; // Limpiar la previsualización
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Limpiar el input de archivo
    }
    setSessionData(prevData => ({ ...prevData, audio_url: '' }));
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    audioChunksRef.current = [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    let finalAudioUrl = '';

    if (!audioFile && !audioBlob) {
      setError('Por favor, sube un archivo de audio MP3 o graba una sesión.');
      setLoading(false);
      return;
    }

    if (!sessionData.date) {
      setError('Por favor, selecciona la fecha y hora de la sesión.');
      setLoading(false);
      return;
    }

    try {
      // --- Lógica para "subir" el archivo/blob y obtener la URL ---
      // ESTE ES EL PUNTO CLAVE PARA INTEGRAR CON TU BACKEND DE SUBIDA DE ARCHIVOS
      // La implementación real requeriría enviar FormData o el Blob al backend
      // y esperar la URL pública del archivo subido.

      let fileToUpload = null;
      if (audioFile) {
        fileToUpload = audioFile;
      } else if (audioBlob) {
        // Convertir el Blob a un File para que el backend lo maneje de forma similar
        fileToUpload = new File([audioBlob], `recording_${Date.now()}.mp3`, { type: 'audio/mpeg' });
      }

      if (fileToUpload) {
        // Aquí llamarías a tu servicio para subir el archivo al backend
        // Ejemplo conceptual (necesitarías una función `uploadAudio` en `services/sessions.js`
        // que maneje la subida real y devuelva la URL).

        // const uploadResponse = await uploadAudio(fileToUpload);
        // finalAudioUrl = uploadResponse.audio_url;

        // *** SIMULACIÓN PARA DEMOSTRACIÓN ***
        finalAudioUrl = `http://example.com/uploads/${fileToUpload.name || 'recorded_audio'}.mp3`;
        console.log(`Simulando subida de archivo: ${fileToUpload.name || 'grabación'}. URL: ${finalAudioUrl}`);
        // **********************************
      } else {
        setError('No se detectó ningún archivo de audio para subir.');
        setLoading(false);
        return;
      }

      // Actualizar sessionData con la URL final antes de enviar al backend
      const dataToSend = {
        ...sessionData,
        audio_url: finalAudioUrl,
        // analysis ya no se envía
      };

      const newSession = await createSession(dataToSend);
      console.log('Sesión creada exitosamente:', newSession);
      setSuccessMessage('Sesión creada exitosamente.');

      // Opcional: limpiar el formulario o redirigir
      setSessionData({
        patient_id: patientDocumentId,
        date: '',
        audio_url: '',
        transcription: '',
        // analysis se ha eliminado
      });
      resetAudio(); // Limpiar el estado de audio

      setTimeout(() => {
        navigate(`/sessions/${patientDocumentId}`);
      }, 2000);

    } catch (err) {
      console.error('Error al crear la sesión:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido al crear la sesión.';
      if (err.message.includes('No hay token') || (err.response && err.response.status === 401)) {
        navigate('/LogIn');
      } else {
        setError('Error al crear la sesión: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetAudio(); // Limpiar el audio al cancelar
    navigate(`/sessions/${patientDocumentId}`);
  };

  return (
    <div className="create-session-container">
      <h1>Nueva Sesión para: {patientName} (ID: {patientDocumentId})</h1>

      <form onSubmit={handleSubmit} className="create-session-form">
        <div className="form-group">
          <label htmlFor="date">Fecha y Hora de la Sesión:</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={sessionData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sección de carga y grabación de audio */}
        <div className="form-group audio-upload-section">
          <label>Audio de la Sesión:</label>
          <div className="audio-options">
            {/* Botón explícito para subir archivo */}
            <div className="upload-audio">
              <button type="button" onClick={handleUploadButtonClick} className="upload-button" disabled={loading}>
                📂 Subir Archivo MP3
              </button>
              <input
                type="file"
                id="audio_file"
                name="audio_file"
                accept="audio/mpeg" // Aceptar solo MP3
                onChange={handleFileChange}
                ref={fileInputRef} // Referencia al input
                style={{ display: 'none' }} // Ocultar el input nativo
              />
              {audioFile && <span className="selected-file-name">Archivo: {audioFile.name}</span>}
            </div>

            {/* Sección de grabación */}
            <div className="record-audio">
              {!recording ? (
                <button type="button" onClick={startRecording} disabled={loading} className="record-button">
                  🔴 Grabar Audio
                </button>
              ) : (
                <button type="button" onClick={stopRecording} disabled={loading} className="stop-record-button">
                  ⬛ Detener Grabación
                </button>
              )}
              {recording && <span className="recording-indicator">Grabando...</span>}
            </div>
          </div>

          {/* Previsualización del audio */}
          {(audioFile || audioBlob) && (
            <div className="audio-preview-container">
              <audio ref={audioPreviewRef} controls src={audioFile ? URL.createObjectURL(audioFile) : (audioBlob ? URL.createObjectURL(audioBlob) : '')}>
                Tu navegador no soporta el elemento de audio.
              </audio>
              <button type="button" onClick={resetAudio} className="reset-audio-button">
                X
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="transcription">Notas:</label>
          <textarea
            id="transcription"
            name="transcription"
            value={sessionData.transcription}
            onChange={handleChange}
            rows="5"
            placeholder="Opcional: puedes escribir notas aquí si no tienes transcripción automática."
          ></textarea>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading || (!audioFile && !audioBlob)} className="submit-button">
            {loading ? 'Creando...' : 'Crear Sesión'}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSession;