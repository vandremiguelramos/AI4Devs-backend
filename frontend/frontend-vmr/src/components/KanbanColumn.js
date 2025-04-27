import React from 'react';
import { Card } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import CandidateCard from './CandidateCard';

const KanbanColumn = ({ title, candidates, stepId, onDrop }) => {
  // Implementar o drop
  const [{ isOver }, drop] = useDrop({
    accept: 'CANDIDATE',
    drop: (item) => onDrop(item, stepId),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <Card 
      ref={drop} 
      className={`kanban-column h-100 ${isOver ? 'drop-target' : ''}`}
      style={{ 
        backgroundColor: isOver ? '#f0f8ff' : '#f0f0f0',
        transition: 'background-color 0.2s ease'
      }}
    >
      <Card.Header className="text-center fw-bold">
        {title}
        <span className="ms-2 badge bg-primary">
          {candidates.length}
        </span>
      </Card.Header>
      <Card.Body className="p-2">
        {candidates.map(candidate => (
          <CandidateCard 
            key={`${candidate.fullName}-${title}`} 
            candidate={candidate}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default KanbanColumn; 