import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const FormularioPokemon = () => {
    const [pokemon, setPokemon] = useState({
        nombre: '',
        noPokedex: '',
        idTipo1: '',
        idTipo2: null,
        idHabilidad1: '',
        idHabilidad2:  null,
        idHabilidad3:  null,
        descripcion: '',
        hp: '',
        attack: '',
        defense: '',
        spattack: '',
        spdefense: '',
        speed: '',
        nivelEvolucion: '',
        idEvPrevia: null,
        idEvSiguiente: null,
    });
    const [pokemons, setPokemons] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const cargarTiposYHabilidades = async () => {
            try {
                const [tiposResponse, habilidadesResponse, pokemonsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/tipos'),
                    axios.get('http://localhost:3000/habilidades'),
                    axios.get('http://localhost:3000/pokemon')
                ]);
                setTipos(tiposResponse.data);
                setHabilidades(habilidadesResponse.data);
                setPokemons(pokemonsResponse.data);

                if (id) {
                    const pokemonResponse = await axios.get(`http://localhost:3000/pokemon/${id}`); // Cambiado a comillas invertidas
                    setPokemon(pokemonResponse.data);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        cargarTiposYHabilidades();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const newValue = type === 'file' ? files[0] : value;
        setPokemon({
            ...pokemon,
            [name]: newValue,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Valores a insertar:", pokemon);
            if (id) {
                await axios.put(`http://localhost:3000/pokemon/${id}`, pokemon);
            } else {
                await axios.post('http://localhost:3000/pokemon', pokemon);
            }
            navigate('/pokemones');
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
                                    <Form.Label>No Pokedex:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="noPokedex" 
                                        value={pokemon.noPokedex} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Tipo 1:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idTipo1" 
                                        value={pokemon.idTipo1} 
                                        onChange={handleChange} 
                                        required 
                                    >
                                        <option value="">Seleccionar Tipo 1</option>
                                        {tipos.map(tipo => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Tipo 2:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idTipo2" 
                                        value={pokemon.idTipo2} 
                                        onChange={handleChange} 
                                    >
                                        <option value="">Seleccionar Tipo 2</option>
                                        {tipos.map(tipo => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Habilidad 1:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idHabilidad1" 
                                        value={pokemon.idHabilidad1} 
                                        onChange={handleChange} 
                                        required 
                                    >
                                        <option value="">Seleccionar Habilidad 1</option>
                                        {habilidades.map(habilidad => (
                                            <option key={habilidad.id} value={habilidad.id}>{habilidad.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Habilidad 2:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idHabilidad2" 
                                        value={pokemon.idHabilidad2} 
                                        onChange={handleChange} 
                                    >
                                        <option value="">Seleccionar Habilidad 2</option>
                                        {habilidades.map(habilidad => (
                                            <option key={habilidad.id} value={habilidad.id}>{habilidad.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Habilidad 3:</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        name="idHabilidad3" 
                                        value={pokemon.idHabilidad3} 
                                        onChange={handleChange} 
                                    >
                                        <option value="">Seleccionar Habilidad 3</option>
                                        {habilidades.map(habilidad => (
                                            <option key={habilidad.id} value={habilidad.id}>{habilidad.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        name="descripcion" 
                                        value={pokemon.descripcion} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>HP:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="hp" 
                                        value={pokemon.hp} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Attack:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="attack" 
                                        value={pokemon.attack} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Defense:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="defense" 
                                        value={pokemon.defense} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Sp. Attack:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="spattack" 
                                        value={pokemon.spattack} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Sp. Defense:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="spdefense" 
                                        value={pokemon.spdefense} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Speed:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="speed" 
                                        value={pokemon.speed} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Nivel Evolución:</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        name="nivelEvolucion" 
                                        value={pokemon.nivelEvolucion} 
                                        onChange={handleChange} 
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
                                        {pokemons.map(evSig => (
                                            <option key={evSig.id} value={evSig.id}>{evSig.nombre}</option>
                                        ))}
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
