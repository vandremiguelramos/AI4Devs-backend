import axios from 'axios';
import { getCandidateMappings } from './applicationService';

const API_BASE_URL = 'http://localhost:3010';

export const getCandidatesByPosition = async (positionId) => {
  try {
    // Buscar os candidatos da posição e o mapeamento em paralelo
    const [candidatesResponse, candidateMappings] = await Promise.all([
      axios.get(`${API_BASE_URL}/positions/${positionId}/candidates`),
      getCandidateMappings()
    ]);
    
    // Enriquecer os dados recebidos com IDs necessários para o drag-and-drop
    const enrichedCandidates = candidatesResponse.data.map(candidate => {
      // Procurar o mapeamento pelo nome completo
      const candidateApps = candidateMappings[candidate.fullName];
      
      if (candidateApps && candidateApps.length > 0) {
        // Encontrar a aplicação para esta posição 
        // Neste exemplo, estamos simplesmente usando a primeira aplicação do candidato
        // Em um cenário real, você teria que verificar qual aplicação corresponde à posição
        const candidateInfo = candidateApps[0];
        
        return {
          ...candidate,
          candidateId: candidateInfo.candidateId,
          applicationId: candidateInfo.applicationId
        };
      }
      
      // Se não encontrar no mapeamento, manter os dados originais
      return candidate;
    });
    
    console.log('Candidatos enriquecidos:', enrichedCandidates);
    return enrichedCandidates;
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    throw new Error('Falha ao buscar candidatos para a posição');
  }
};

export const getPositions = async () => {
  try {
    // Implementação futura - atualmente retorna posições hardcoded para testes
    // const response = await axios.get(`${API_BASE_URL}/positions`);
    // return response.data;
    
    return [
      { id: 1, title: 'Software Engineer' },
      { id: 2, title: 'Data Scientist' }
    ];
  } catch (error) {
    console.error('Erro ao buscar posições:', error);
    throw new Error('Falha ao buscar posições');
  }
};

export const getInterviewSteps = async () => {
  try {
    // Implementação futura - atualmente retorna etapas hardcoded para testes
    // const response = await axios.get(`${API_BASE_URL}/interview-steps`);
    // return response.data;
    
    return [
      { id: 1, name: 'Initial Screening' },
      { id: 2, name: 'Technical Interview' },
      { id: 3, name: 'Manager Interview' }
    ];
  } catch (error) {
    console.error('Erro ao buscar etapas de entrevista:', error);
    throw new Error('Falha ao buscar etapas de entrevista');
  }
}; 