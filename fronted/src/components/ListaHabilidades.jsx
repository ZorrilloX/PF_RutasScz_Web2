import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const ListaHabilidades = () => {
    const [listaHabilidades, setListaHabilidades] = useState([]);

    useEffect(() => {
        getListaHabilidades();
        document.title = "Lista de Habilidades"; 
    }, []);

    const getListaHabilidades = () => {
        axios.get('http://localhost:3000/habilidades')
            .then(res => {
                setListaHabilidades(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar esta habilidad?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/habilidades/${id}`)
            .then(() => {
                getListaHabilidades(); // Actualizar lista después de eliminar
            }).catch(error => {
                console.log(error);
            });
    };

    return (
        <Container className="mt-3 mb-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Lista de Habilidades</h2>
                            </Card.Title>
                            <Button variant="success" className="mb-3" as={Link} to="/habilidades/create">Agregar Habilidad</Button>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaHabilidades.map(habilidad => (
                                        <tr key={habilidad.id}>
                                            <td>{habilidad.id}</td>
                                            <td>{habilidad.nombre}</td>
                                            <td><Link className="btn btn-primary" to={"/habilidades/" + habilidad.id}>Editar</Link></td>
                                            <td><Button variant="danger" onClick={() => eliminar(habilidad.id)}>Eliminar</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ListaHabilidades;
