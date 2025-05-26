/**
 * Registra un nuevo usuario en el sistema.
 * @param {object} userData - Un objeto con los datos del usuario a registrar.
 * @param {string} userData.document_id - El número de documento de identidad del usuario.
 * @param {string} userData.username - El nombre de usuario.
 * @param {string} userData.email - El correo electrónico del usuario.
 * @param {string} userData.password - La contraseña del usuario (se enviará sin hash para que el backend la procese).
 * @param {string} userData.name - El nombre completo del usuario.
 * @param {string} userData.tel - El número de teléfono del usuario.
 * @param {number} userData.age - La edad del usuario.
 * @param {string} [userData.role="psicologo"] - El rol del usuario (por defecto "psicologo").
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de la API o la rechaza con un error.
 */
export async function registerUser(userData) {
  // Define la URL de tu API de registro
  const apiUrl = "http://localhost:8000/users/register"; // Asegúrate de que esta sea la URL correcta de tu backend FastAPI

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), // Convierte el objeto JavaScript a una cadena JSON
    });

    // Verifica si la respuesta de la red fue exitosa
    if (!response.ok) {
      // Si la respuesta no es 2xx (por ejemplo, 400 Bad Request, 500 Internal Server Error)
      const errorData = await response.json(); // Intenta obtener los detalles del error del cuerpo de la respuesta
      throw new Error(errorData.detail || "Error desconocido al registrar el usuario.");
    }

    // Si la respuesta fue exitosa (código 201 Created)
    const successData = await response.json();
    return successData;

  } catch (error) {
    console.error("Hubo un problema con la operación de registro:", error.message);
    throw error; // Propaga el error para que pueda ser manejado por quien llama a la función
  }
}


/**
 * Realiza una llamada de login a la API.
 * @param {string} username - El nombre de usuario del usuario (en este caso, el email o username de tu base de datos).
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} Una promesa que resuelve con la respuesta de la API (ej. un token de acceso) o la rechaza con un error.
 */
export async function loginUser(username, password) {
  // ¡CAMBIAR ESTA URL para que coincida con tu endpoint de FastAPI!
  // Tu FastAPI tiene un APIRouter con prefix="/auth", así que la ruta completa es /auth/token
  const apiUrl = "http://localhost:8000/auth/token"; // <-- ¡Ajuste importante aquí!

  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // FastAPI con OAuth2 espera este tipo
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Credenciales inválidas.");
    }

    const successData = await response.json();
    return successData; // Esto contendrá el access_token y token_type
  } catch (error) {
    console.error("Hubo un problema con la operación de login:", error.message);
    throw error;
  }
}