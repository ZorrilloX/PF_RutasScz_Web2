import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const ListaTipos = () => {
    const [listaTipos, setListaTipos] = useState([]);

    useEffect(() => {
        getListaTipos();
        document.title = "Lista de Tipos"; 
    }, []);

    const getListaTipos = () => {
        axios.get('http://localhost:3000/tipos')
            .then(res => {
                setListaTipos(res.data);
            }).catch(error => {
                console.log(error);
            });
    }

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar este tipo?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/tipos/${id}`)
            .then(() => {
                getListaTipos();  // Actualizar lista después de eliminar
            }).catch(error => {
                console.log(error);
            });
    }

    return (
        <Container className="mt-3 mb-3">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Lista de Tipos</h2>
                            </Card.Title>
                            <Button variant="success" className="mb-3" as={Link} to="/tipos/create">Agregar Tipo</Button>
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
                                    {listaTipos.map(tipo =>
                                        <tr key={tipo.id}>
                                            <td>{tipo.id}</td>
                                            <td>{tipo.nombre}</td>
                                            <td><Link className="btn btn-primary" to={"/tipos/" + tipo.id}>Editar</Link></td>
                                            <td><Button variant="danger" onClick={() => eliminar(tipo.id)}>Eliminar</Button></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ListaTipos;