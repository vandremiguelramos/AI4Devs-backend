import { PrismaClient } from '@prisma/client';

export interface IPositionRepository {
  findById(id: number): Promise<any>;
  findApplicationsByPositionId(positionId: number): Promise<any[]>;
}

export class PositionRepository implements IPositionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<any> {
    console.log('Repository: Buscando posição com ID:', id);
    try {
      const position = await this.prisma.position.findUnique({
        where: { id }
      });
      console.log('Repository: Posição encontrada:', position ? 'Sim' : 'Não');
      return position;
    } catch (error) {
      console.error('Repository: Erro ao buscar posição:', error);
      throw error;
    }
  }

  async findApplicationsByPositionId(positionId: number): Promise<any[]> {
    console.log('Repository: Buscando aplicações para posição ID:', positionId);
    try {
      const applications = await this.prisma.application.findMany({
        where: { positionId },
        include: {
          candidate: true,
          interviewStep: true,
          interviews: true
        }
      });
      console.log('Repository: Aplicações encontradas:', applications.length);
      return applications;
    } catch (error) {
      console.error('Repository: Erro ao buscar aplicações:', error);
      throw error;
    }
  }
} 