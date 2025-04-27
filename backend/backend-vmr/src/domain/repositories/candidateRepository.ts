import { PrismaClient } from '@prisma/client';

export interface ICandidateRepository {
  findById(id: number): Promise<any>;
  updateCandidateStage(applicationId: number, interviewStepId: number): Promise<any>;
}

export class CandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<any> {
    return this.prisma.candidate.findUnique({
      where: { id }
    });
  }

  async updateCandidateStage(applicationId: number, interviewStepId: number): Promise<any> {
    return this.prisma.application.update({
      where: { id: applicationId },
      data: { 
        currentInterviewStep: interviewStepId 
      },
      include: {
        candidate: true,
        interviewStep: true
      }
    });
  }
} 