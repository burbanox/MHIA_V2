import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/users'; // Asumo que esta función hace la petición a /auth/token
import axios from 'axios'; // Necesitaremos axios para la segunda petición a /users/me

function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const API_BASE_URL = "http://localhost:8000"; // Asegúrate que esta sea la URL correcta de tu backend

  const handleLogIn = async () => {
    try {
      // 1. Llama a la función de login para obtener el token
      // Asumo que loginUser envía {username: email, password: password} a /auth/token
      const loginResponse = await loginUser(email, password);
      console.log('Inicio de sesión exitoso, token obtenido:', loginResponse);

      // Guarda el token en localStorage
      localStorage.setItem('authToken', loginResponse.access_token);

      // 2. Ahora, haz una petición a /users/me para obtener los detalles del usuario
      const userDetailsResponse = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${loginResponse.access_token}`, // Usa el token recién obtenido
        },
      });

      // 3. Guarda el nombre completo del usuario en localStorage
      console.log('Detalles del usuario obtenidos:', userDetailsResponse.data);
      const userName = userDetailsResponse.data.name; // Asegúrate que 'full_name' sea el nombre del campo en tu UserRead schema
      localStorage.setItem("currentUserName", userName);
      console.log('Nombre de usuario guardado:', userName);


      alert('¡Inicio de sesión exitoso!');
      navigate("/patients"); // Navegar después del inicio de sesión exitoso

    } catch (error) {
      console.error('Fallo el inicio de sesión:', error.message);
      // Puedes refinar el mensaje de error si es un 401 del backend
      const errorMessage = error.response && error.response.data && error.response.data.detail
        ? error.response.data.detail
        : error.message;
      alert(`Error al iniciar sesión: ${errorMessage}`);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Log In</h2>
      <div style={formGroupStyle}>
        <label htmlFor="email" style={labelStyle}>Email:</label>
        <input
          type="email"
          id="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
      <button style={buttonStyle} onClick={handleLogIn}>
        Log In
      </button>
      <p style={linkStyle}>
        ¿No tienes una cuenta? <span onClick={() => navigate('/SignUp')} style={signUpLinkStyle}>Sign Up</span>
      </p>
    </div>
  );
}

export default LogIn;

// Estilos CSS en línea (sin cambios)
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

const signUpLinkStyle = {
  color: '#007bff',
  cursor: 'pointer',
};