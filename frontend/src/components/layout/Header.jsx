import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Add this
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("authToken"));
  }, [location]); // Update on route change

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };

    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const goToLogIn = () => {
    navigate("/LogIn");
  };

  const goToSignUp = () => {
    navigate("/SignUp");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Función para manejar el clic en el logo
  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/patients"); // Redirige a /patients si está logueado
    } else {
      navigate("/"); // Redirige a la página de inicio si no está logueado
    }
  };

  return (
    <header style={headerStyle}>
      {/* Usamos la nueva función handleLogoClick */}
      <span style={logoStyle} onClick={handleLogoClick}>MHIA</span>
      <div>
        {isLoggedIn ? (
          <button style={signUpButtonStyle} onClick={handleLogout}>
            Log Out
          </button>
        ) : (
          <>
            <button style={logInButtonStyle} onClick={goToLogIn}>
              Log In
            </button>
            <button style={signUpButtonStyle} onClick={goToSignUp}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

// Estilos CSS en línea (sin cambios)
const headerStyle = {
  backgroundColor: "#72EE30", // Verde brillante
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 20px",
};

const logoStyle = {
  fontSize: "1.5em",
  fontWeight: "bold",
  color: "#333",
  cursor: "pointer", // Agregamos cursor: pointer para indicar que es clickeable
};

const buttonStyle = {
  padding: "8px 15px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontSize: "1em",
};

const logInButtonStyle = {
  ...buttonStyle,
  backgroundColor: "transparent",
  color: "#333",
  marginRight: "10px",
};

const signUpButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#000",
  color: "#fff",
};