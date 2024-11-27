import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const FormularioPokemon = () => {
    const [pokemon, setPokemon] = useState({
        nombre: '',
        noPokedex: '',
        idTipo1: '',
        idTipo2: '',
        idHabilidad1: '',
        idHabilidad2: '',
        idHabilidad3: '',
        descripcion: '',
        hp: '',
        attack: '',
        defense: '',
        spattack: '',
        spdefense: '',
        speed: '',
        nivelEvolucion: '',
        idEvPrevia: '',
        idEvSiguiente: '',
    });
    const [pokemons, setPokemons] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const navigate = useNavigate(); // Cambia useHistory por useNavigate
    const { id } = useParams(); // Para editar un Pokémon

    useEffect(() => {
        const cargarTiposYHabilidades = async () => {
            try {
                const [tiposResponse, habilidadesResponse] = await Promise.all([
                    axios.get('http://localhost:3000/tipos'),
                    axios.get('http://localhost:3000/habilidades'),
                ]);
                setTipos(tiposResponse.data);
                setHabilidades(habilidadesResponse.data);

                // Si estamos editando, cargar el Pokémon
                if (id) {
                    const pokemonResponse = await axios.get(`http://localhost:3000/pokemon/${id}`);
                    setPokemon(pokemonResponse.data);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        cargarTiposYHabilidades();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPokemon({
            ...pokemon,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // Actualizar Pokémon existente
                await axios.put(`http://localhost:3000/pokemon/${id}`, pokemon);
            } else {
                // Crear nuevo Pokémon
                await axios.post('http://localhost:3000/pokemon', pokemon);
            }
            navigate('/pokemon'); // Redirigir a la lista de Pokémon
        } catch (error) {
            console.error('Error al guardar Pokémon:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h1>{id ? 'Editar Pokémon' : 'Agregar Pokémon'}</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="nombre" 
                                        value={pokemon.nombre} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>
                                
                                <Form.Group>
                                    <Form.Label>ID Evolución Previa:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idEvPrevia" 
                                        value={pokemon.idEvPrevia} 
                                        onChange={handleChange} 
                                    >
                                        <option value="">Seleccionar Evolución Previa</option>
                                        {pokemons.map(evPrev => (
                                            <option key={evPrev.id} value={evPrev.id}>{evPrev.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>ID Evolución Siguiente:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idEvSiguiente" 
                                        value={pokemon.idEvSiguiente} 
                                        onChange={handleChange} 
                                    >
                                        <option value="">Seleccionar Evolución Siguiente</option>
                                        
                                    </Form.Control>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    {id ? 'Actualizar' : 'Agregar'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormularioPokemon;
