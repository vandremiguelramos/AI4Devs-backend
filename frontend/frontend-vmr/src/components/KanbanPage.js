import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';
import logo from '../assets/lti-logo.png';

const KanbanPage = () => {
  return (
    <Container fluid>
      <Row className="py-3 bg-light">
        <Col className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img src={logo} alt="LTI Logo" style={{ width: '80px' }} className="me-3" />
            <h2 className="mb-0">Kanban de Candidatos</h2>
          </div>
          <div>
            <Link to="/" className="btn btn-outline-primary me-2">
              Dashboard
            </Link>
            <Link to="/add-candidate" className="btn btn-primary">
              Adicionar Candidato
            </Link>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <KanbanBoard />
        </Col>
      </Row>
    </Container>
  );
};

export default KanbanPage; 