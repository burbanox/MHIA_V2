import axios from 'axios';

// ASEGÚRATE DE QUE ESTA URL SEA CORRECTA PARA TU BACKEND DE FASTAPI
// Si tu backend está en un puerto diferente o dominio (ej. si usas Docker),
// ajústalo aquí.
const API_BASE_URL = 'http://localhost:8000'; // Ejemplo: Cambia esto si tu API está en otro lugar

// Función para obtener el token de autenticación del localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// --- Funciones para la API de PACIENTES ---

/**
 * Lista todos los pacientes.
 * @returns {Promise<Array<object>>} - Una lista de objetos de paciente.
 */
export const listPatients = async () => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/patients/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al listar pacientes:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene los detalles de un paciente específico por su document_id.
 * @param {string} documentId - El document_id del paciente.
 * @returns {Promise<object>} - Los detalles del paciente.
 */
export const getPatientById = async (documentId) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/patients/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener paciente ${documentId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Elimina un paciente por su document_id.
 * @param {string} documentId - El document_id del paciente a eliminar.
 * @returns {Promise<any>} - Respuesta de la eliminación.
 */
export const deletePatient = async (documentId) => {
    try {
        const token = getAuthToken();
        const response = await axios.delete(`${API_BASE_URL}/patients/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar paciente ${documentId}:`, error.response?.data || error.message);
        throw error;
    }
};

// --- Funciones para la API de SESIONES ---

/**
 * Crea una nueva sesión para un paciente.
 * @param {object} sessionData - Datos de la nueva sesión (ej. patient_id, date, audio_url, transcription, analysis)
 * @returns {Promise<object>} - La sesión creada.
 */
export const createSession = async (sessionData) => {
    try {
        const token = getAuthToken();
        const response = await axios.post(`${API_BASE_URL}/sessions/`, sessionData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la sesión:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene una sesión específica por su ID.
 * @param {number} sessionId - El ID de la sesión.
 * @returns {Promise<object>} - Los detalles de la sesión.
 */
export const getSessionById = async (sessionId) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la sesión ${sessionId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza una sesión existente.
 * @param {number} sessionId - El ID de la sesión a actualizar.
 * @param {object} updateData - Los datos a actualizar de la sesión.
 * @returns {Promise<object>} - La sesión actualizada.
 */
export const updateSession = async (sessionId, updateData) => {
    try {
        const token = getAuthToken();
        const response = await axios.put(`${API_BASE_URL}/sessions/${sessionId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la sesión ${sessionId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Lista todas las sesiones para un paciente específico.
 * Esta es la función principal que usarás en PatientSessions.jsx.
 * @param {string} patientDocumentId - El document_id del paciente.
 * @returns {Promise<Array<object>>} - Una lista de objetos de sesión.
 */
export const listSessionsByPatient = async (patientDocumentId) => {
    try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/sessions/patient/${patientDocumentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al listar sesiones para el paciente ${patientDocumentId}:`, error.response?.data || error.message);
        throw error;
    }
};

