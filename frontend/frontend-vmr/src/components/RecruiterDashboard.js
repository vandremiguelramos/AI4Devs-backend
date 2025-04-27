import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/lti-logo.png'; // Ruta actualizada para importar desde src/assets

const RecruiterDashboard = () => {
    return (
        <Container className="mt-5">
            <div className="text-center"> {/* Contenedor para el logo */}
                <img src={logo} alt="LTI Logo" style={{ width: '150px' }} />
            </div>
            <h1 className="mb-4 text-center">Dashboard do Recrutador</h1>
            <Row className="justify-content-center">
                <Col md={5} className="mb-4">
                    <Card className="shadow p-4 h-100">
                        <h5 className="mb-4">Adicionar Candidato</h5>
                        <p className="text-muted">Cadastre novos candidatos no sistema</p>
                        <div className="mt-auto">
                            <Link to="/add-candidate">
                                <Button variant="primary" className="w-100">Adicionar Novo Candidato</Button>
                            </Link>
                        </div>
                    </Card>
                </Col>
                
                <Col md={5} className="mb-4">
                    <Card className="shadow p-4 h-100">
                        <h5 className="mb-4">Kanban de Candidatos</h5>
                        <p className="text-muted">Visualize os candidatos por etapa do processo seletivo</p>
                        <div className="mt-auto">
                            <Link to="/kanban">
                                <Button variant="success" className="w-100">Ver Kanban</Button>
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RecruiterDashboard;