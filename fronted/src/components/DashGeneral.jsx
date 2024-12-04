import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import municipiosImg from '../assets/icons/municipio-Icon.jpg'; // Reemplaza con la ruta de tu imagen
import carreterasImg from '../assets/icons/rutes.png'; // Reemplaza con la ruta de tu imagen
import incidentesImg from '../assets/icons/incidentes.png'; // Reemplaza con la ruta de tu imagen

const GeneralPanel = () => {
    return (
        <Container className="mt-5">
            <Row className="mb-4">
                <Col>
                    <Card>
                        <a href="/panel/general/municipios">
                            <Card.Img variant="top" src={municipiosImg} />
                        </a>
                        <Card.Body>
                            <Card.Title>Gestionar Municipios</Card.Title>
                            <Card.Text>
                                Administrar y gestionar los municipios.
                            </Card.Text>
                            <Button variant="primary" href="/panel/general/municipios">Gestionar Municipios</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <a href="/panel/general/carreteras">
                            <Card.Img variant="top" src={carreterasImg} />
                        </a>
                        <Card.Body>
                            <Card.Title>Gestionar Carreteras</Card.Title>
                            <Card.Text>
                                Administrar y gestionar las carreteras.
                            </Card.Text>
                            <Button variant="primary" href="/panel/general/carreteras">Gestionar Carreteras</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <a href="/panel/general/incidentes">
                            <Card.Img variant="top" src={incidentesImg} />
                        </a>
                        <Card.Body>
                            <Card.Title>Gestionar Incidentes</Card.Title>
                            <Card.Text>
                                Administrar y gestionar los incidentes.
                            </Card.Text>
                            <Button variant="primary" href="/panel/general/incidentes">Gestionar Incidentes</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default GeneralPanel;
