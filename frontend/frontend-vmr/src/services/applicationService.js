import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

// Buscar todas as aplicações
export const getAllApplications = async () => {
  try {
    // Dados fictícios para simulação - em produção, isso seria substituído por uma chamada de API real
    // const response = await axios.get(`${API_BASE_URL}/applications`);
    // return response.data;
    
    // Simulando uma resposta da API para fins de teste
    return [
      {
        id: 1,
        candidate: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe'
        },
        currentInterviewStep: 2
      },
      {
        id: 2,
        candidate: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe'
        },
        currentInterviewStep: 2
      },
      {
        id: 3,
        candidate: {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith'
        },
        currentInterviewStep: 2
      },
      {
        id: 4,
        candidate: {
          id: 3,
          firstName: 'Carlos',
          lastName: 'García'
        },
        currentInterviewStep: 1
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar aplicações:', error);
    throw new Error('Falha ao buscar aplicações');
  }
};

// Gerar o mapeamento de candidatos para suas respectivas aplicações
export const getCandidateMappings = async () => {
  try {
    const applications = await getAllApplications();
    
    // Constrói o mapeamento dinamicamente
    const mapping = {};
    applications.forEach(app => {
      const fullName = `${app.candidate.firstName} ${app.candidate.lastName}`;
      
      if (!mapping[fullName]) {
        mapping[fullName] = [];
      }
      
      // Um candidato pode ter múltiplas aplicações
      mapping[fullName].push({
        candidateId: app.candidate.id,
        applicationId: app.id,
        currentInterviewStep: app.currentInterviewStep
      });
    });
    
    return mapping;
  } catch (error) {
    console.error('Erro ao gerar mapeamento de candidatos:', error);
    throw new Error('Falha ao gerar mapeamento de candidatos');
  }
}; 