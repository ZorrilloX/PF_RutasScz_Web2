import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'; // Importar componentes de Bootstrap

const FormImagenPokemon = () => {
    const { id } = useParams(); // Capturamos el ID de la URL
    const [imagen, setImagen] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Inicializar el hook de navegación

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imagen) {
            setError("Por favor, selecciona una imagen.");
            return;
        }

        const formData = new FormData();
        formData.append('imagen', imagen);

        try {
            const response = await fetch(`http://localhost:3000/api/upload-imagen/${id}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("Imagen cargada con éxito");
                setImagen(null); // Limpiar el estado de imagen
                navigate('/pokemones'); // Redireccionar a la página de pokemones
            } else {
                const errorData = await response.json(); // Captura el mensaje de error del servidor
                setError(errorData.message || "Error al cargar la imagen.");
            }
        } catch (error) {
            console.error('Error al enviar la imagen:', error);
            setError("Error al enviar la imagen.");
        }
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Cargar Imagen de Pokémon (ID: {id})</h2>
                            </Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="imagen">
                                    <Form.Label>Selecciona la imagen:</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImagen(e.target.files[0])}
                                        required
                                    />
                                </Form.Group>
                                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores */}
                                <Form.Group className="mt-3">
                                    <Button type="submit" variant="primary">Cargar Imagen</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormImagenPokemon;
