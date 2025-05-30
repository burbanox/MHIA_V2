import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, updatePatient } from '../services/patients'; // Asume que tienes estas funciones
import '../assets/css/EditPatient.css'; // Crea este archivo CSS

function EditPatient() {
  const { patientId } = useParams(); // Obtener el document_id del paciente de la URL
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    tel: '',
    address: '',
    city: '',
    birth_date: '', // Formato YYYY-MM-DD para input type="date"
    gender: '',
    age: '', // Corregido: "ocupation" es el campo en el esquema
    psychologist_id: '', // Se llenará al cargar el paciente, no editable por el usuario
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const data = await getPatient(patientId);

        // Formatear la fecha de nacimiento si viene del backend en otro formato
        // El backend PatientRead usa `date_of_birth: datetime`. Si es un objeto datetime,
        // necesitamos formatearlo a 'YYYY-MM-DD' para el input type="date".
        const formattedBirthDate = data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '';

        setPatientData({
          name: data.name || '',
          email: data.email || '',
          tel: data.tel || '',
          address: data.address || '',
          city: data.city || '',
          birth_date: formattedBirthDate, // Asignar la fecha formateada
          gender: data.gender || '',
          age: data.age || '',
          origin: data.origin || '',
          ocupation: data.ocupation || '', // Asegúrate que el nombre del campo sea correcto
          psychologist_id: data.psychologist_id || '',
        });
        setError(null);
      } catch (err) {
        console.error('Error al obtener los datos del paciente:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido al cargar los datos del paciente.';
        if (err.message.includes('No hay token') || (err.response && err.response.status === 401)) {
          navigate('/LogIn'); // Redirigir al login si el token es inválido/falta
        } else if (err.response && err.response.status === 404) {
          setError('Paciente no encontrado.');
        } else {
          setError('Error al cargar los datos del paciente: ' + errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    } else {
      setError('ID de paciente no proporcionado.');
      setLoading(false);
    }
  }, [patientId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validación básica
    if (!patientData.name || !patientData.email || !patientData.tel || !patientData.birth_date) {
      setError('Por favor, completa los campos obligatorios: Nombre, Email, Teléfono y Fecha de Nacimiento.');
      setLoading(false);
      return;
    }

    try {
      // Envía solo los campos que pueden ser actualizados por el usuario
      const updateData = {
        name: patientData.name,
        email: patientData.email,
        tel: patientData.tel,
        address: patientData.address,
        city: patientData.city,
        birth_date: patientData.birth_date, // Envía en formato YYYY-MM-DD
        gender: patientData.gender,
        age: patientData.age ? parseInt(patientData.age, 10) : null, // Asegúrate que sea un número
        origin: patientData.origin,
        ocupation: patientData.ocupation,
      };

      const updatedPatient = await updatePatient(patientId, updateData);
      console.log('Paciente actualizado exitosamente:', updatedPatient);
      setSuccessMessage('Paciente actualizado exitosamente.');

      // Opcional: redirigir a la lista de pacientes o a la vista de sesiones del paciente
      setTimeout(() => {
        navigate('/patients'); // O navigate(`/sessions/${patientId}`);
      }, 2000);

    } catch (err) {
      console.error('Error al actualizar el paciente:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || err.message || 'Error desconocido al actualizar el paciente.';
      if (err.message.includes('No hay token') || (err.response && err.response.status === 401)) {
        navigate('/LogIn');
      } else {
        setError('Error al actualizar el paciente: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/patients'); // Volver a la lista de pacientes
  };

  if (loading) {
    return <div className="edit-patient-container loading">Cargando datos del paciente...</div>;
  }

  if (error) {
    return <div className="edit-patient-container error-message">{error}</div>;
  }

  // Prevenir renderizado si no hay datos de paciente (ej. después de un error 404 manejado)
  if (!patientData || !patientId) {
    return <div className="edit-patient-container">No se pudo cargar el paciente para edición.</div>;
  }

  return (
    <div className="edit-patient-container">
      <h1>Editar Paciente: {patientData.name} (ID: {patientId})</h1>

      <form onSubmit={handleSubmit} className="edit-patient-form">
        {/* Document ID - no editable */}
        <div className="form-group">
          <label htmlFor="document_id">Documento de Identidad:</label>
          <input
            type="text"
            id="document_id"
            value={patientId}
            disabled // El ID no debe ser editable una vez creado
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Nombre Completo:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={patientData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tel">Teléfono:</label>
          <input
            type="tel"
            id="tel"
            name="tel"
            value={patientData.tel}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={patientData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Ciudad:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={patientData.city}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birth_date">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={patientData.birth_date} // Debe estar en formato YYYY-MM-DD
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Género:</label>
          <select id="gender" name="gender" value={patientData.gender} onChange={handleChange}>
            <option value="">Selecciona...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decir">Prefiero no decir</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Edad:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={patientData.age}
            onChange={handleChange}
            min="0"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Actualizando...' : 'Actualizar Paciente'}
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPatient;