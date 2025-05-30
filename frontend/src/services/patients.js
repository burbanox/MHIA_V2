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
