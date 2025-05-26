import React, { useState, useEffect } from "react";
import "../assets/css/SelectPatient.css";
import { useNavigate } from "react-router-dom";
import { listPatients, deletePatient } from '../services/sessions'; // Asegúrate que esta ruta es correcta

function SelectPatient() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("Cargando...");

  const getUserName = () => {
    return localStorage.getItem("currentUserName") || "Usuario Desconocido";
  };

  const fetchPatientsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      console.error("Error al cargar los pacientes:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error desconocido al cargar pacientes.";
      if (err.message.includes("No hay token") || (err.response && err.response.status === 401)) {
        navigate("/LogIn");
      } else {
        setError("Error al cargar los pacientes: " + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserName(getUserName());
    fetchPatientsData();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = patients.filter(
      (patient) =>
        (patient.name && patient.name.toLowerCase().includes(term)) ||
        (patient.document_id && String(patient.document_id).toLowerCase().includes(term)) ||
        (patient.email && patient.email.toLowerCase().includes(term)) ||
        (patient.tel && String(patient.tel).toLowerCase().includes(term)) ||
        (patient.gender && patient.gender.toLowerCase().includes(term)) ||
        (patient.age && String(patient.age).toLowerCase().includes(term))
    );
    setFilteredPatients(filtered);
  };

  const handleNewPatientClick = () => {
    navigate("/create-patient");
  };

  const handleEditPatient = (document_id) => {
    navigate(`/edit-patient/${document_id}`);
  };

  const handleDeletePatient = async (document_id) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al paciente con ID: ${document_id}?`
      )
    ) {
      try {
        await deletePatient(document_id);
        fetchPatientsData(); // Recargar la lista después de eliminar
      } catch (err) {
        console.error(
          `Error al eliminar paciente con ID ${document_id}:`,
          err.response?.data?.detail || err.message
        );
        setError("Error al eliminar el paciente. " + (err.response?.data?.detail || err.message));
      }
    }
  };

  const goToPatientSessions = (patientDocumentId) => {
    // Asegúrate de que esta ruta coincida con la que tienes en App.jsx
    navigate(`/sessions/${patientDocumentId}`);
  };

  if (loading) {
    return (
      <div className="select-patient-container">Cargando pacientes...</div>
    );
  }

  if (error) {
    return (
      <div className="select-patient-container error-message">{error}</div>
    );
  }

  return (
    <div className="select-patient-container">
      <div className="header">
        <h1>MÉDICO: {currentUserName}</h1>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className="new-patient-button" onClick={handleNewPatientClick}>
          Nuevo Paciente
        </button>
      </div>

      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Edad</th> {/* COLUMNA AÑADIDA / AJUSTADA */}
              <th>Género</th> {/* COLUMNA AÑADIDA / AJUSTADA */}
              <th>Teléfono</th> {/* COLUMNA AÑADIDA / AJUSTADA */}
              <th>Email</th> {/* COLUMNA AÑADIDA / AJUSTADA */}
              {/* Eliminadas o comentadas las que no están en PatientRead */}
              {/* <th>Fecha Nac.</th> */}
              {/* <th>Centro</th> */}
              <th>Ver Historial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.document_id}>
                  <td>{patient.document_id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age || 'N/A'}</td> {/* Accede a la propiedad 'age' */}
                  <td>{patient.gender || 'N/A'}</td> {/* Accede a la propiedad 'gender' */}
                  <td>{patient.tel || 'N/A'}</td> {/* Accede a la propiedad 'tel' */}
                  <td>{patient.email || 'N/A'}</td> {/* Accede a la propiedad 'email' */}
                  {/* Si añades Fecha Nac. y Centro a PatientRead, usarías: */}
                  <td>
                    <button
                      className="view-history-button"
                      onClick={() => goToPatientSessions(patient.document_id)}
                    >
                      Ver Historial
                    </button>
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEditPatient(patient.document_id)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeletePatient(patient.document_id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* ColSpan ajustado para que coincida con el número total de columnas visibles (8) */}
                <td colSpan="8">No se encontraron pacientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SelectPatient;