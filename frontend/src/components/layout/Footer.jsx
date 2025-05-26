import React from 'react';
import brainImage from '../../assets/img/Brain.png'; // Importa la imagen del cerebro

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={contactUsStyle}>
        <h3>Contáctanos</h3>
        <p style={contactInfoStyle}>Email: info@mhia.com</p>
        <p style={contactInfoStyle}>Instagram: @mhia_oficial</p>
        <p style={contactInfoStyle}>Teléfono: +57 300 123 4567</p>
      </div>
      <div style={logoContainerStyle}>
        <img src={brainImage} alt="MHIA Brain" style={logoStyle} />
      </div>
    </footer>
  );
}

export default Footer;

// Estilos CSS en línea
const footerStyle = {
  backgroundColor: '#e0ffe0', // Verde claro
  color: '#333', // Texto oscuro
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'space-between', // Coloca los elementos a los extremos
  alignItems: 'center', // Centra verticalmente los elementos
  width: '100%', // Ocupa todo el ancho
  /* Cambiamos de 'fixed' a 'static' o 'relative' */
  position: 'relative',
  bottom: 0,
  left: 0,
  zIndex: 100, // Asegura que esté por encima de otros elementos si es necesario
};

const contactUsStyle = {
  textAlign: 'left',
};

const contactInfoStyle = {
  fontSize: '0.9em',
  margin: '3px 0',
};

const logoContainerStyle = {
  marginRight: '5%', // Agrega un margen a la derecha para separarlo del borde
};

const logoStyle = {
  width: '90px', // Ajusta el tamaño según sea necesario
  height: 'auto',
};