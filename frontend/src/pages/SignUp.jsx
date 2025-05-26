import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/users'; // Asegúrate de que la ruta sea correcta

function SignUp() {
  const navigate = useNavigate();
  // Estados existentes para email y password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Nuevos estados para los campos adicionales requeridos por la API
  const [documentId, setDocumentId] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('psicologo'); // Valor por defecto

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return; // Detener la ejecución si las contraseñas no coinciden
    }

    // Crear el objeto con los datos del usuario que espera la API
    const userData = {
      document_id: documentId,
      username: username,
      email: email,
      password: password,
      name: name,
      tel: tel,
      age: parseInt(age), // Asegúrate de que la edad sea un número
      role: role,
    };

    try {
      // Llamar a la función de registro desde users.js
      const response = await registerUser(userData);
      console.log('Usuario registrado exitosamente:', response);
      alert('¡Usuario registrado exitosamente!');
      navigate('/patients'); // Navegar después del registro exitoso
    } catch (error) {
      console.error('Fallo el registro del usuario:', error.message);
      alert(`Error al registrar usuario: ${error.message}`);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Sign Up</h2>

      {/* Campos existentes */}
      <div style={formGroupStyle}>
        <label htmlFor="email" style={labelStyle}>Email:</label>
        <input
          type="email"
          id="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Campo requerido
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="password" style={labelStyle}>Password:</label>
        <input
          type="password"
          id="password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          style={inputStyle}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {/* Nuevos campos para los datos del usuario */}
      <div style={formGroupStyle}>
        <label htmlFor="documentId" style={labelStyle}>Cédula / Documento de Identidad:</label>
        <input
          type="text"
          id="documentId"
          style={inputStyle}
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="username" style={labelStyle}>Nombre de Usuario:</label>
        <input
          type="text"
          id="username"
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="name" style={labelStyle}>Nombre Completo:</label>
        <input
          type="text"
          id="name"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="tel" style={labelStyle}>Teléfono:</label>
        <input
          type="tel" // Tipo 'tel' para números de teléfono
          id="tel"
          style={inputStyle}
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          required
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="age" style={labelStyle}>Edad:</label>
        <input
          type="number" // Tipo 'number' para la edad
          id="age"
          style={inputStyle}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      {/* Campo para el rol (opcional, si quieres permitir al usuario elegir) */}
      <div style={formGroupStyle}>
        <label htmlFor="role" style={labelStyle}>Rol:</label>
        <select
          id="role"
          style={inputStyle}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="psicologo">Psicólogo</option>
          {/* Puedes añadir más roles si tu aplicación los soporta */}
        </select>
      </div>

      <button style={buttonStyle} onClick={handleSignUp}>
        Sign Up
      </button>
      <p style={linkStyle}>
        ¿Ya tienes una cuenta? <span onClick={() => navigate('/LogIn')} style={logInLinkStyle}>Log In</span>
      </p>
    </div>
  );
}

export default SignUp;

// Estilos CSS en línea (son los mismos que en LogIn para mantener la estética)
const containerStyle = {
  backgroundColor: '#e0ffe0', // Verde claro
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
};

const headingStyle = {
  fontSize: '2em',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '20px',
};

const formGroupStyle = {
  marginBottom: '15px',
  width: '80%',
  maxWidth: '300px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  color: '#555',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1em',
};

const buttonStyle = {
  backgroundColor: '#000',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1em',
  marginTop: '20px',
  width: '80%',
  maxWidth: '300px',
};

const linkStyle = {
  marginTop: '15px',
  color: '#555',
};

const logInLinkStyle = {
  color: '#007bff',
  cursor: 'pointer',
};