import { Request, Response } from 'express';
import { getCandidatesByPosition } from '../../application/services/positionService';

export const getCandidatesByPositionId = async (req: Request, res: Response) => {
  console.log('Controller: Iniciando busca de candidatos para posição:', req.params.id);
  try {
    const positionId = parseInt(req.params.id);
    
    if (isNaN(positionId)) {
      console.log('Controller: ID de posição inválido');
      return res.status(400).json({ error: 'ID de posição inválido' });
    }

    console.log('Controller: Chamando service para posição ID:', positionId);
    const candidates = await getCandidatesByPosition(positionId);
    console.log('Controller: Candidatos encontrados:', candidates);
    res.json(candidates);
  } catch (error) {
    console.error('Controller: Erro ao buscar candidatos por posição:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}; 