// patientsApi.js

const API_BASE_URL = 'http://localhost:8000'; // ¡IMPORTANTE! Cambia esto a la URL de tu API en producción

// Función auxiliar para obtener el token de autenticación
// Asegúrate de que esta función obtenga el token de donde lo almacenes en tu frontend
const getAuthToken = () => {
    // Ejemplo: obtener el token de localStorage
    return localStorage.getItem('authToken'); // O el nombre que uses para tu token
};

// Función auxiliar para manejar respuestas de la API
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || `Error en la solicitud: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }
    // Para DELETE, FastAPI devuelve 204 No Content, no hay JSON para parsear
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

/**
 * Crea un nuevo paciente.
 * @param {object} patientData - Los datos del paciente a crear (e.g., {document_id, name, ...}).
 * @returns {Promise<object>} El objeto del paciente creado.
 */
export const createPatient = async (patientData) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("No hay token de autenticación disponible. Inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
    });
    return handleResponse(response);
};

/**
 * Obtiene un paciente por su ID de documento.
 * @param {string} documentId - El ID de documento del paciente.
 * @returns {Promise<object>} El objeto del paciente.
 */
export const getPatient = async (documentId) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("No hay token de autenticación disponible. Inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/patients/${documentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(response);
};

/**
 * Actualiza un paciente existente por su ID de documento.
 * @param {string} documentId - El ID de documento del paciente a actualizar.
 * @param {object} patientData - Los datos del paciente a actualizar.
 * @returns {Promise<object>} El objeto del paciente actualizado.
 */
export const updatePatient = async (documentId, patientData) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("No hay token de autenticación disponible. Inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/patients/${documentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
    });
    return handleResponse(response);
};

/**
 * Lista todos los pacientes del psicólogo actual.
 * @returns {Promise<Array<object>>} Un array de objetos de pacientes.
 */
export const listPatients = async () => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("No hay token de autenticación disponible. Inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(response);
};

/**
 * Elimina un paciente por su ID de documento.
 * @param {string} documentId - El ID de documento del paciente a eliminar.
 * @returns {Promise<null>} Retorna null en caso de éxito (código 204).
 */
export const deletePatient = async (documentId) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error("No hay token de autenticación disponible. Inicia sesión.");
    }

    const response = await fetch(`${API_BASE_URL}/patients/${documentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(response);
};

// Ejemplo de cómo usar estas funciones (para probar en un navegador o entorno Node.js)
/*
// Asegúrate de tener un token válido aquí para las pruebas
localStorage.setItem('accessToken', 'TU_TOKEN_JWT_AQUI'); // SOLO PARA PRUEBAS, reemplaza con un token real

async function testCrudOperations() {
    try {
        console.log("--- Creando paciente ---");
        const newPatient = await createPatient({
            document_id: "100000001",
            first_name: "Juan",
            last_name: "Pérez",
            date_of_birth: "1990-05-15",
            gender: "Masculino",
            phone_number: "1234567890",
            email: "juan.perez@example.com",
            address: "Calle Falsa 123",
            city: "Ciudad Ejemplo",
            country: "País Ejemplo",
            notes: "Paciente inicial"
        });
        console.log("Paciente creado:", newPatient);

        console.log("\n--- Obteniendo paciente ---");
        const fetchedPatient = await getPatient(newPatient.document_id);
        console.log("Paciente obtenido:", fetchedPatient);

        console.log("\n--- Actualizando paciente ---");
        const updatedPatient = await updatePatient(newPatient.document_id, {
            phone_number: "0987654321",
            notes: "Notas actualizadas."
        });
        console.log("Paciente actualizado:", updatedPatient);

        console.log("\n--- Listando pacientes ---");
        const patientsList = await listPatients();
        console.log("Lista de pacientes:", patientsList);

        // Para borrar, descomenta con precaución para no borrar datos accidentalmente
        // console.log("\n--- Eliminando paciente ---");
        // await deletePatient(newPatient.document_id);
        // console.log("Paciente eliminado con éxito.");

        // console.log("\n--- Intentando obtener paciente eliminado (debería fallar) ---");
        // await getPatient(newPatient.document_id);

    } catch (error) {
        console.error("Error en la operación CRUD:", error.message);
    }
}

// Llama a la función para ejecutar las pruebas
// testCrudOperations();
*/