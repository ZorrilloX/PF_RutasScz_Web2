import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CatalogoPokemones = () => {
    const [pokemones, setPokemones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPokemones = async () => {
            try {
                const response = await axios.get('http://localhost:3000/pokeApi');
                setPokemones(response.data);
                setLoading(false);
            } catch {
                setError('Error al cargar los Pokémon.');
                setLoading(false);
            }
        };

        fetchPokemones();
    }, []);

    const filteredPokemones = pokemones.filter((pokemon) =>
        pokemon.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.noPokedex.toString().includes(searchTerm) ||
        (pokemon.tipo && pokemon.tipo.some((tipo) => tipo.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1 className="text-center mt-8">POKE API por QUINTEROS R MATEO</h1>

            <h1 className="text-center mt-4">Catálogo de Pokémon</h1>

            <Form className="mt-4 mb-4">
                <Form.Control
                    type="text"
                    placeholder="Buscar por nombre, número de Pokédex o tipo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>

            <Row className="mt-4 g-4 justify-content-center"> {/* 'justify-content-center' para centrar las columnas */}
                {filteredPokemones.map((pokemon) => (
                    <Col xs={12} sm={6} md={4} lg={4} key={pokemon.id} className="mb-4">
                        <Card style={{ textAlign: 'center', height: '100%', minHeight: '300px' }}> {/* Altura mínima para las tarjetas */}
                            <Card.Img 
                                variant="top" 
                                src={`http://localhost:3000/imagenes/${pokemon.id}.jpg`} 
                                alt={pokemon.nombre} 
                                style={{ cursor: 'pointer', height: '150px', objectFit: 'cover' }}
                                onClick={() => { window.location.href = `http://localhost:5173/pokeapi/${pokemon.id}`; }}
                            />
                            <Card.Body>
                                <Card.Title>{pokemon.nombre}</Card.Title>
                                <Card.Text>
                                    No. Pokedex: {pokemon.noPokedex}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {filteredPokemones.length === 0 && (
                    <Col xs={12}>
                        <p className="text-center">No se encontraron Pokémon.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default CatalogoPokemones;
