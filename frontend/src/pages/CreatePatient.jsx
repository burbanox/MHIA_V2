import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../services/patients';
function CreatePatient() {
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState({
    document_id: '',
    first_name: '',
    last_name: '',
    gender: '',
    phone_number: '',
    email: '',
    age: '',
    address: '', // ¡Añadido de nuevo aquí!
    city: '',    // ¡Añadido de nuevo aquí!
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSend = {
        document_id: patientData.document_id,
        name: `${patientData.first_name} ${patientData.last_name}`.trim(),
        email: patientData.email,
        tel: patientData.phone_number,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        address: patientData.address, // ¡Añadido al objeto a enviar!
        city: patientData.city,       // ¡Añadido al objeto a enviar!
      };

      if (isNaN(dataToSend.age)) {
        throw new Error("La edad debe ser un número válido.");
      }

      const newPatient = await createPatient(dataToSend);
      console.log('Paciente creado exitosamente:', newPatient);
      setSuccess(true);
      alert('¡Paciente creado exitosamente!');
      navigate('/patients');
    } catch (err) {
      console.error('Error al crear paciente:', err);
      let errorMessage = 'Hubo un error al crear el paciente.';
      if (err.response && err.response.data && err.response.data.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(d => {
            const loc = d.loc.length > 1 ? d.loc[1] : d.loc[0];
            return `${loc}: ${d.msg}`;
          }).join(', ');
        } else {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Registrar Nuevo Paciente</h1>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={errorMessageStyle}>{error}</p>}
        {success && <p style={successMessageStyle}>Paciente creado exitosamente.</p>}

        <div style={formGroupRowStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="document_id" style={labelStyle}>Cédula / Documento:</label>
            <input
              type="text"
              id="document_id"
              name="document_id"
              value={patientData.document_id}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="first_name" style={labelStyle}>Nombre:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={patientData.first_name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={formGroupRowStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="last_name" style={labelStyle}>Apellido:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={patientData.last_name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="age" style={labelStyle}>Edad:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={patientData.age}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={formGroupRowStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="gender" style={labelStyle}>Género:</label>
            <select
              id="gender"
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="phone_number" style={labelStyle}>Teléfono:</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={patientData.phone_number}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={formGroupRowStyle}>
          
          <div style={formGroupStyle}>
            <label htmlFor="address" style={labelStyle}>Dirección:</label> {/* ¡Añadido al JSX! */}
            <input
              type="text"
              id="address"
              name="address"
              value={patientData.address}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}> {/* Esto podría ser un formGroupStyle si lo quieres en una fila */}
            <label htmlFor="city" style={labelStyle}>Ciudad:</label> {/* ¡Añadido al JSX! */}
            <input
              type="text"
              id="city"
              name="city"
              value={patientData.city}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        

          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={patientData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

        <div style={buttonContainerStyle}>
          <button type="submit" style={submitButtonStyle} disabled={loading}>
            {loading ? 'Creando...' : 'Crear Paciente'}
          </button>
          <button type="button" style={cancelButtonStyle} onClick={() => navigate('/patients')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePatient;

const containerStyle = {
  backgroundColor: '#e0ffe0', // Verde claro
  minHeight: '100vh',
  padding: '40px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
  backgroundColor: '#72EE30', // Verde brillante
  width: '100%',
  maxWidth: '800px',
  padding: '15px 20px',
  borderRadius: '8px',
  marginBottom: '30px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const formStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px', // Espacio entre grupos de campos
};

const formGroupStyle = {
  flex: '1', // Para que los campos en una fila ocupen el espacio disponible
  minWidth: '280px', // Evita que los campos se hagan demasiado pequeños en pantallas estrechas
};

const formGroupRowStyle = {
  display: 'flex',
  flexWrap: 'wrap', // Permite que los elementos se envuelvan en pantallas pequeñas
  gap: '20px', // Espacio entre los grupos de campos en la misma fila
  justifyContent: 'space-between', // Distribuye el espacio entre los campos
};


const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333',
  fontSize: '0.95em',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1em',
  boxSizing: 'border-box', // Incluye padding y borde en el ancho total
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end', // Alinea los botones a la derecha
  gap: '15px', // Espacio entre los botones
  marginTop: '20px',
  borderTop: '1px solid #eee',
  paddingTop: '20px',
};

const baseButtonStyle = {
  padding: '12px 25px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1em',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
};

const submitButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
    transform: 'scale(1.02)',
  },
};

const cancelButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: '#f0f0f0',
  color: '#333',
  border: '1px solid #ccc',
  '&:hover': {
    backgroundColor: '#e0e0e0',
    transform: 'scale(1.02)',
  },
};

const errorMessageStyle = {
  color: '#d9534f', // Rojo para errores
  backgroundColor: '#f2dede',
  border: '1px solid #ebccd1',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '15px',
  textAlign: 'center',
};

const successMessageStyle = {
  color: '#5cb85c', // Verde para éxito
  backgroundColor: '#dff0d8',
  border: '1px solid #d6e9c6',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '15px',
  textAlign: 'center',
};