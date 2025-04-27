import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

export const uploadCV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // Devuelve la ruta del archivo y el tipo
    } catch (error) {
        throw new Error('Error al subir el archivo:', error.response.data);
    }
};

export const sendCandidateData = async (candidateData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/candidates`, candidateData);
        return response.data;
    } catch (error) {
        throw new Error('Error al enviar datos del candidato:', error.response.data);
    }
};

export const updateCandidateStage = async (candidateId, applicationId, interviewStepId) => {
    console.log('Chamando API para atualizar estágio com:', {
        candidateId,
        applicationId,
        interviewStepId
    });
    
    try {
        const response = await axios.put(`${API_BASE_URL}/candidates/${candidateId}/stage`, {
            applicationId,
            interviewStepId
        });
        return response.data;
    } catch (error) {
        console.error('Erro completo ao atualizar etapa:', error);
        
        // Repassar o erro para que seja tratado pelo componente
        throw error;
    }
};