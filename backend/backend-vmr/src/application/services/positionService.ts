import { PrismaClient } from '@prisma/client';
import { IPositionRepository, PositionRepository } from '../../domain/repositories/positionRepository';
import { CandidateScoreService } from '../../domain/services/candidateScoreService';

interface CandidateResult {
  fullName: string;
  currentStep: string;
  averageScore: number | null;
}

export class PositionService {
  private repository: IPositionRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new PositionRepository(prisma);
  }

  async getCandidatesByPosition(positionId: number): Promise<CandidateResult[]> {
    console.log('Service: Iniciando busca para posição ID:', positionId);
    try {
      // Verificar se a posição existe
      const position = await this.repository.findById(positionId);
      console.log('Service: Posição encontrada:', position ? 'Sim' : 'Não');

      if (!position) {
        throw new Error('Posição não encontrada');
      }

      // Buscar aplicações para esta posição
      console.log('Service: Buscando aplicações para posição');
      const applications = await this.repository.findApplicationsByPositionId(positionId);
      console.log('Service: Aplicações encontradas:', applications.length);

      // Transformar os dados no formato desejado
      console.log('Service: Transformando dados das aplicações');
      const candidatesResult = applications.map(app => {
        // Calcular pontuação média das entrevistas usando o serviço de domínio
        const averageScore = CandidateScoreService.calculateAverageScore(app.interviews);

        // Montar o resultado
        return {
          fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
          currentStep: app.interviewStep.name,
          averageScore: averageScore
        };
      });

      console.log('Service: Resultado final:', candidatesResult);
      return candidatesResult;
    } catch (error) {
      console.error('Service: Erro ao buscar candidatos por posição:', error);
      throw error;
    }
  }
}

// Função auxiliar para manter compatibilidade com o código existente
const prisma = new PrismaClient();
const positionService = new PositionService(prisma);

export const getCandidatesByPosition = (positionId: number): Promise<CandidateResult[]> => {
  console.log('Função auxiliar: Chamando service com posição ID:', positionId);
  return positionService.getCandidatesByPosition(positionId);
}; 