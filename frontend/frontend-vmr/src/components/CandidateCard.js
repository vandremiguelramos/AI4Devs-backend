import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { PersonFill, StarFill } from 'react-bootstrap-icons';
import { useDrag } from 'react-dnd';

const CandidateCard = ({ candidate }) => {
  // Implementar drag and drop
  const [{ isDragging }, drag] = useDrag({
    type: 'CANDIDATE',
    item: { 
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      fullName: candidate.fullName,
      currentStep: candidate.currentStep
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  // Função para determinar a cor do badge de pontuação
  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'secondary';
    if (score >= 4) return 'success';
    if (score >= 3) return 'warning';
    return 'danger';
  };

  // Função para formatar a pontuação
  const formatScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return score.toFixed(1);
  };

  // Verifica se o candidato tem os IDs necessários para drag and drop
  const hasDragIds = candidate.candidateId && candidate.applicationId;

  return (
    <Card 
      ref={drag} 
      className={`mb-2 candidate-card ${isDragging ? 'dragging' : ''} ${!hasDragIds ? 'disabled-drag' : ''}`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: hasDragIds ? 'grab' : 'not-allowed'
      }}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <div className="candidate-icon me-2">
            <PersonFill size={20} />
          </div>
          <Card.Title className="mb-0 fs-6">
            {candidate.fullName}
            {!hasDragIds && (
              <small className="text-muted ms-2" title="Este candidato não pode ser movido">
                (fixo)
              </small>
            )}
          </Card.Title>
        </div>
        
        <div className="d-flex justify-content-end">
          <Badge 
            bg={getScoreColor(candidate.averageScore)} 
            className="d-flex align-items-center"
          >
            <StarFill className="me-1" size={12} />
            {formatScore(candidate.averageScore)}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CandidateCard; 