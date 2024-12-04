import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import userMgmtImg from '../assets/icons/usuarios.png'; // Reemplaza con la ruta de tu imagen
import logImg from '../assets/icons/logs.png'; // Reemplaza con la ruta de tu imagen

const AdminPanel = () => {
    return (
        <Container className="mt-5" style={{ maxWidth: '800px' }}>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <a href="/panel/admin/usuarios">
                            <Card.Img variant="top" src={userMgmtImg} />
                        </a>
                        <Card.Body>
                            <Card.Title>Gestionar Usuarios</Card.Title>
                            <Card.Text>
                                Administrar y gestionar los usuarios del sistema.
                            </Card.Text>
                            <Button variant="primary" href="/panel/admin/usuarios">Gestionar Usuarios</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <a href="/panel/admin/logs">
                            <Card.Img variant="top" src={logImg} />
                        </a>
                        <Card.Body>
                            <Card.Title>Ver Lista de Log</Card.Title>
                            <Card.Text>
                                Ver historial de cambios y actividad del sistema.
                            </Card.Text>
                            <Button variant="primary" href="/panel/admin/log">Ver Lista de Log</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPanel;
