import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import adminImg from '../assets/icons/PanelAdmin.jpg';
import generalImg from '../assets/icons/admin.png';
import publicImg from '../assets/icons/home.png';
const Dashboard = () => {
    return (
        <>
            <Container className="mt-5" style={{ maxWidth: '800px' }}>
                <Row className="mb-4">
                    <Col>
                        <Card >
                            <a href="/panel/admin">
                                <Card.Img variant="top" src={adminImg} style={{ width:'100%', maxWidth: '200px' }}/>
                            </a>
                            <Card.Body>
                                <Card.Title>Panel Admin</Card.Title>
                                <Card.Text>
                                    Acceso completo para gestionar usuarios, carreteras, municipios e incidentes.
                                </Card.Text>
                                <Button variant="primary" href="/panel/admin">Ir al Panel Admin</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <a href="/panel/general">
                                <Card.Img variant="top" src={generalImg} style={{ width:'100%', maxWidth: '200px' }} />
                            </a>
                            <Card.Body>
                                <Card.Title>Panel de Control</Card.Title>
                                <Card.Text>
                                    Acceso para gestionar carreteras, municipios e incidentes.
                                </Card.Text>
                                <Button variant="primary" href="/panel/general">Ir al Panel General</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <a href="/RutesScz">
                                <Card.Img variant="top" src={publicImg} style={{ width:'100%', maxWidth: '200px' }}/>
                            </a>
                            <Card.Body>
                                <Card.Title>PÁGINA PRINCIPAL ;3</Card.Title>
                                <Card.Text>
                                    Qué nos deparará el camino?
                                </Card.Text>
                                <Button variant="primary" href="/RutesScz">Si quiero</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Dashboard;
