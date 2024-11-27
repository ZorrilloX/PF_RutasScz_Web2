import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormHabilidad = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        if (!id) return;
        getHabilidadById();
    }, [id]);

    const getHabilidadById = () => {
        axios.get(`http://localhost:3000/habilidades/${id}`)
            .then(res => {
                const habilidad = res.data;
                setNombre(habilidad.nombre);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onChangeNombre = (e) => {
        setNombre(e.target.value);
    };

    const onGuardarClick = (e) => {
        e.preventDefault();
        const habilidad = { nombre };
        if (id) {
            axios.put(`http://localhost:3000/habilidades/${id}`, habilidad)
                .then(res => {
                    console.log(res.data);
                    navigate('/habilidades');
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            axios.post('http://localhost:3000/habilidades', habilidad)
                .then(res => {
                    console.log(res.data);
                    navigate('/habilidades');
                    setNombre('');
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Formulario Habilidad</h2>
                            </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control value={nombre} type="text" onChange={onChangeNombre} />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Button onClick={onGuardarClick}>Guardar datos</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormHabilidad;
