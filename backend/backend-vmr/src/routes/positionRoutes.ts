import { Router } from 'express';
import { getCandidatesByPositionId } from '../presentation/controllers/positionController';

const router = Router();

// Endpoint para obter candidatos por posição
router.get('/:id/candidates', getCandidatesByPositionId);

export default router; 