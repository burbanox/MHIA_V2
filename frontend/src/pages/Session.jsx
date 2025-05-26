import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById } from '../services/sessions'; // Asume que tienes esta función
import '../assets/css/Session.css'; // Crea este archivo CSS

function Session() {
  const { sessionId } = useParams(); // Obtener el ID de la sesión de la URL
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        const data = await getSessionById(sessionId);
        console.log('Detalles de la sesión:', data);
        setSession(data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener los detalles de la sesión:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido al cargar la sesión.';
        if (err.message.includes('No hay token') || (err.response && err.response.status === 401)) {
          navigate('/LogIn'); // Redirigir al login si el token es inválido/falta
        } else if (err.response && err.response.status === 404) {
          setError('Sesión no encontrada.');
        } else {
          setError('Error al cargar la sesión: ' + errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionDetails();
    } else {
      setError('ID de sesión no proporcionado.');
      setLoading(false);
    }
  }, [sessionId, navigate]);

  if (loading) {
    return <div className="session-detail-container loading">Cargando detalles de la sesión...</div>;
  }

  if (error) {
    return <div className="session-detail-container error-message">{error}</div>;
  }

  if (!session) {
    return <div className="session-detail-container">No se encontraron datos para esta sesión.</div>;
  }

  // Formatear la fecha para una mejor legibilidad
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      // Opciones para formatear la fecha y hora
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Formato 24 horas
      };
      return date.toLocaleDateString('es-ES', options);
    } catch (e) {
      console.error("Error al formatear la fecha:", isoString, e);
      return isoString; // Retorna la cadena original si hay error de formato
    }
  };

  const handleBackToPatient = () => {
    if (session && session.patient_id) {
        navigate(`/sessions/${session.patient_id}`); // Volver a la lista de sesiones del paciente
    } else {
        navigate('/patients'); // Si no hay ID de paciente, volver a la lista de pacientes
    }
  };

  const handleEditSession = () => {
    // Implementar la navegación a la página de edición de sesión
    // Por ejemplo: navigate(`/edit-session/${session.id}`);
    alert('Funcionalidad de edición aún no implementada.');
  };

  return (
    <div className="session-detail-container">
      <div className="session-header">
        <h1>Detalles de la Sesión {session.id}</h1>
        <button onClick={handleBackToPatient} className="back-button">
          Volver a Sesiones del Paciente
        </button>
      </div>

      <div className="session-card">
        <p><strong>Paciente ID:</strong> {session.patient_id}</p>
        <p><strong>Fecha y Hora:</strong> {formatDate(session.date)}</p>
        <p><strong>URL de Audio:</strong> <a href={session.audio_url} target="_blank" rel="noopener noreferrer">{session.audio_url}</a></p>

        {session.audio_url && (
          <div className="audio-player-container">
            <label>Reproducir Audio:</label>
            <audio controls src={session.audio_url}>
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}

        <div className="session-content">
          <label>Transcripción:</label>
          <p className="session-text">{session.transcription || 'No hay transcripción disponible.'}</p>
        </div>

        {/* El campo de análisis ahora es opcional y solo se muestra si existe */}
        {session.analysis && (
            <div className="session-content">
                <label>Análisis:</label>
                <p className="session-text">{session.analysis}</p>
            </div>
        )}

        <p className="created-at"><strong>Creada el:</strong> {formatDate(session.created_at)}</p>

        <div className="session-actions">
          <button onClick={handleEditSession} className="edit-button">
            Editar Sesión
          </button>
          {/* Aquí podrías añadir un botón para eliminar la sesión */}
        </div>
      </div>
    </div>
  );
}

export default Session;