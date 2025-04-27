import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Badge } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCandidatesByPosition, getPositions, getInterviewSteps } from '../services/positionService';
import { updateCandidateStage } from '../services/candidateService';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = () => {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [interviewSteps, setInterviewSteps] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [debug, setDebug] = useState(false); // Para ativar/desativar informações de depuração

  // Buscar posições e etapas de entrevista ao montar o componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [positionsData, stepsData] = await Promise.all([
          getPositions(),
          getInterviewSteps()
        ]);
        
        setPositions(positionsData);
        setInterviewSteps(stepsData);
        
        if (positionsData.length > 0) {
          setSelectedPosition(positionsData[0].id);
        }
      } catch (err) {
        setError('Erro ao carregar dados iniciais');
        console.error('Erro ao carregar dados iniciais:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Buscar candidatos quando a posição selecionada mudar
  useEffect(() => {
    if (!selectedPosition) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const candidatesData = await getCandidatesByPosition(selectedPosition);
        console.log('Candidatos carregados:', candidatesData);
        
        // Contar quantos candidatos têm IDs necessários para arrastar
        const draggableCandidates = candidatesData.filter(
          c => c.candidateId && c.applicationId
        );
        
        if (debug) {
          console.log(`${draggableCandidates.length} de ${candidatesData.length} candidatos podem ser arrastados`);
        }
        
        setCandidates(candidatesData);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar candidatos');
        console.error('Erro ao carregar candidatos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedPosition, debug]);

  // Agrupar candidatos por etapa
  const groupCandidatesByStep = () => {
    const groupedCandidates = {};
    
    candidates.forEach(candidate => {
      if (!groupedCandidates[candidate.currentStep]) {
        groupedCandidates[candidate.currentStep] = [];
      }
      groupedCandidates[candidate.currentStep].push(candidate);
    });
    
    return groupedCandidates;
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
  };

  // Alternar modo de depuração
  const toggleDebug = () => {
    setDebug(!debug);
  };

  // Lidar com soltar um candidato em uma coluna
  const handleDrop = async (candidate, newStepId) => {
    // Encontrar o nome da etapa atual
    const stepInfo = interviewSteps.find(step => step.id === newStepId);
    
    // Se o candidato já estiver nesta etapa, não fazer nada
    if (candidate.currentStep === stepInfo.name) {
      return;
    }
    
    // Log para debugging
    console.log('Tentando mover candidato:', {
      candidato: candidate.fullName,
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      de: candidate.currentStep,
      para: stepInfo.name,
      stepId: newStepId
    });
    
    // Validar se temos os IDs necessários
    if (!candidate.candidateId || !candidate.applicationId) {
      setError(`Não foi possível mover ${candidate.fullName}: IDs necessários não encontrados`);
      console.error('IDs ausentes:', { candidate });
      return;
    }
    
    try {
      // Mostrar mensagem de sucesso temporariamente
      setSuccess(`Movendo ${candidate.fullName} para ${stepInfo.name}...`);
      
      // Chamar o serviço para atualizar a etapa
      const result = await updateCandidateStage(
        candidate.candidateId,
        candidate.applicationId,
        newStepId
      );
      
      console.log('Resultado da atualização:', result);
      
      // Atualizar a lista de candidatos
      setCandidates(prevCandidates => {
        return prevCandidates.map(c => {
          if (c.applicationId === candidate.applicationId) {
            return {
              ...c,
              currentStep: stepInfo.name
            };
          }
          return c;
        });
      });
      
      setSuccess(`${candidate.fullName} movido para ${stepInfo.name} com sucesso!`);
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Erro ao atualizar etapa do candidato:', err);
      console.error('Detalhes do erro:', err.response?.data || 'Sem detalhes adicionais');
      
      const errorMessage = err.response?.data?.error || err.message || 'Erro desconhecido';
      setError(`Erro ao mover ${candidate.fullName}: ${errorMessage}`);
      
      // Limpar a mensagem de erro após 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const groupedCandidates = groupCandidatesByStep();

  // Mapear as etapas para as colunas
  // Se não houver candidatos em uma etapa, a coluna ainda deve ser exibida
  const columns = interviewSteps.map(step => ({
    id: step.id,
    name: step.name,
    candidates: groupedCandidates[step.name] || []
  }));

  // Contar quantos candidatos têm IDs necessários para arrastar
  const draggableCandidates = candidates.filter(
    c => c.candidateId && c.applicationId
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Container fluid className="kanban-container py-4">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <Form.Group style={{ flexGrow: 1 }}>
            <Form.Label>Selecionar Posição</Form.Label>
            <Form.Select 
              value={selectedPosition} 
              onChange={handlePositionChange}
              disabled={loading || positions.length === 0}
            >
              {positions.map(position => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <button 
            onClick={toggleDebug} 
            className={`btn btn-sm ms-3 ${debug ? 'btn-secondary' : 'btn-outline-secondary'}`}
            style={{ height: 'fit-content', marginTop: '25px' }}
          >
            Debug
          </button>
        </div>

        {debug && (
          <Alert variant="info" className="mb-3">
            <h6>Informações de depuração:</h6>
            <p className="mb-1">Total de candidatos: {candidates.length}</p>
            <p className="mb-1">Candidatos arrastáveis: {draggableCandidates.length}</p>
            <p className="mb-0">
              Status: <Badge bg="success">{draggableCandidates.length} arrastáveis</Badge> <Badge bg="secondary">{candidates.length - draggableCandidates.length} fixos</Badge>
            </p>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-3">
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        {loading && <p className="text-center">Carregando...</p>}

        <Row className="g-4">
          {columns.map(column => (
            <Col key={column.id} xs={12} md={6} lg={4} xl={3}>
              <KanbanColumn 
                title={column.name}
                candidates={column.candidates}
                stepId={column.id}
                onDrop={handleDrop}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </DndProvider>
  );
};

export default KanbanBoard; 