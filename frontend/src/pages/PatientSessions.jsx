import React, { useState, useEffect } from 'react';
import patientImage from './../assets/img/descargar.jpg'; // Considera si quieres una imagen dinámica o estática
import { useNavigate, useParams } from "react-router-dom";
import { getPatientById, listSessionsByPatient } from '../services/sessions'; // <--- O la ruta correcta a tus servicios
import '../assets/css/PatientSessions.css';

function PatientSessions() {
  const navigate = useNavigate();
  const { patientDocumentId } = useParams(); // Obtenemos el ID del paciente de la URL

  const [patientName, setPatientName] = useState("Cargando..."); // Estado para el nombre real del paciente
  const [sessions, setSessions] = useState([]); // Las sesiones completas del backend
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSessions, setFilteredSessions] = useState([]); // Sesiones filtradas para la tabla
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Cargando..."); // Nombre del psicólogo logueado

  const getUserName = () => {
    return localStorage.getItem("currentUserName") || "Usuario Desconocido";
  };

  // Función para cargar los datos del paciente y sus sesiones
  const fetchPatientAndSessionsData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener los detalles del paciente (para el nombre)
      const patientData = await getPatientById(patientDocumentId);
      setPatientName(patientData.name || "Paciente Desconocido"); // Asume que el backend envía 'name' para el paciente

      // 2. Obtener las sesiones del paciente
      const sessionsData = await listSessionsByPatient(patientDocumentId);
      // Formatear la fecha para una mejor visualización si es necesario
      const formattedSessions = sessionsData.map(session => ({
        ...session,
        // Suponiendo que session.date es un string ISO (ej. "2023-10-27T10:00:00Z")
        // Puedes ajustarlo para mostrar solo la fecha o fecha y hora
        displayDate: new Date(session.date).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setSessions(formattedSessions);
      setFilteredSessions(formattedSessions);
    } catch (err) {
      console.error("Error al cargar los datos del paciente y sesiones:", err);
      // Mejorar el manejo de errores para mostrar detalles específicos del backend si es posible
      const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al cargar datos.";
      if (err.message.includes("No hay token") || (err.response && err.response.status === 401)) {
        navigate("/LogIn");
      } else {
        setError("Error al cargar los datos: " + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserName(getUserName()); // Carga el nombre del psicólogo al montar
    if (patientDocumentId) {
      fetchPatientAndSessionsData();
    }
  }, [patientDocumentId, navigate]); // Dependencias para recargar si el ID del paciente o la navegación cambian

  // Función de búsqueda (actualizada para los nuevos campos y propiedades del backend)
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = sessions.filter(session =>
      (session.displayDate && session.displayDate.toLowerCase().includes(term)) || // Búsqueda por fecha mostrada
      (currentUserName.toLowerCase().includes(term)) || // Búsqueda por nombre del terapeuta (psicólogo logueado)
      (session.transcription && session.transcription.toLowerCase().includes(term)) || // Búsqueda por notas (transcripción)
      (session.analysis && session.analysis.toLowerCase().includes(term)) // Búsqueda por análisis
    );
    setFilteredSessions(filtered);
  };

  const handleNewSessionClick = () => {
    navigate(`/create-session/${patientDocumentId}`);
  };

  const handleViewSession = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  const handleEditSession = (sessionId) => {
    navigate(`/edit-session/${sessionId}`);
  };

  if (loading) {
    return <div className="patient-sessions-container">Cargando sesiones...</div>;
  }

  if (error) {
    return <div className="patient-sessions-container error-message">{error}</div>;
  }

  return (
    <div className="patient-sessions-container">
      <div className="patient-header">
        {/* Aquí puedes poner la imagen del paciente si el backend la proporciona, o mantener una estática */}
        <img src={patientImage} alt={`Imagen de ${patientName}`} className="patient-image" />
        <h1>Paciente: {patientName}</h1> {/* Muestra el nombre real del paciente */}
      </div>

      <div className="sessions-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar sesiones por fecha, terapeuta, notas o análisis..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>
        <button className="new-session-button" onClick={handleNewSessionClick}>Nueva Sesión</button>
      </div>

      <div className="table-container">
        <table className="sessions-table">
          <thead>
            <tr>
              <th>ID de Sesión</th>
              <th>Fecha y Hora</th>
              <th>Terapeuta</th>
              <th>Tipo de Sesión</th>
              <th>Duración (min)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <tr key={session.id}>
                  <td>{session.id}</td>
                  <td>{session.displayDate}</td>
                  <td>{currentUserName}</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>{session.transcription ? session.transcription.substring(0, 100) + '...' : 'Sin notas'}</td>
                  <td>{session.analysis ? session.analysis.substring(0, 100) + '...' : 'Sin análisis'}</td>
                  <td>
                    <button className="view-button" onClick={() => handleViewSession(session.id)}>Ver</button>
                    <button className="edit-button" onClick={() => handleEditSession(session.id)}>Editar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No se encontraron sesiones para este paciente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientSessions;