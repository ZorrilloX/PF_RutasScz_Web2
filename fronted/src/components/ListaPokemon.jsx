import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Card } from 'react-bootstrap';

const ListaPokemon = () => {
    const [pokemons, setPokemons] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [habilidades, setHabilidades] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [pokemonsResponse, tiposResponse, habilidadesResponse] = await Promise.all([
                    axios.get('http://localhost:3000/pokemon'),
                    axios.get('http://localhost:3000/tipos'), // Asegúrate de tener esta ruta
                    axios.get('http://localhost:3000/habilidades'), // Asegúrate de tener esta ruta
                ]);

                setPokemons(pokemonsResponse.data);
                setTipos(tiposResponse.data);
                setHabilidades(habilidadesResponse.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        cargarDatos();
    }, []);

    const obtenerNombreTipo = (id) => {
        const tipo = tipos.find(t => t.id === id);
        return tipo ? tipo.nombre : 'N/A';
    };

    const obtenerNombreHabilidad = (id) => {
        const habilidad = habilidades.find(h => h.id === id);
        return habilidad ? habilidad.nombre : 'N/A';
    };
    
    const obtenerNombreEvolucion = (id) => {
        const evolucion = pokemons.find(p => p.id === id);
        return evolucion ? evolucion.nombre : 'N/A';
    };

    const eliminarPokemon = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/pokemon/${id}`);
            setPokemons(pokemons.filter(pokemon => pokemon.id !== id));
        } catch (error) {
            console.error('Error al eliminar Pokémon:', error);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h1>Lista de Pokémones</h1>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Link to="/pokemones/create" className="btn btn-primary">Agregar Pokémon</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Acciones</th>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>No Pokedex</th>
                                        <th>Tipo 1</th>
                                        <th>Tipo 2</th>
                                        <th>Habilidad 1</th>
                                        <th>Habilidad 2</th>
                                        <th>Habilidad 3</th>
                                        <th>Descripción</th>
                                        <th>HP</th>
                                        <th>Attack</th>
                                        <th>Defense</th>
                                        <th>Sp. Attack</th>
                                        <th>Sp. Defense</th>
                                        <th>Speed</th>
                                        <th>Nivel Evolución</th>
                                        <th>ID Evolución Previa</th>
                                        <th>ID Evolución Siguiente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pokemons.map(pokemon => (
                                        <tr key={pokemon.id}>
                                            <td>
                                                <Link to={`/pokemones/${pokemon.id}/photo`} className="btn btn-primary me-2" style={{marginTop: '10px'}}>Imagen</Link>
                                                <Link to={`/pokemones/${pokemon.id}`} className="btn btn-warning me-2" style={{marginTop: '10px'}}>Editar</Link>
                                                <Button variant="danger" onClick={() => eliminarPokemon(pokemon.id)} style={{marginTop: '10px'}}>Eliminar</Button>
                                            </td>
                                            <td>{pokemon.id}</td>
                                            <td>{pokemon.nombre}
                                                <Card.Img
                                                variant="top"
                                                src={`http://localhost:3000/imagenes/${pokemon.id}.jpg`}
                                                style={{ marginTop: '40px', width: '150px', height: '150px' }}
                                                />
                                            </td>
                                            <td>{pokemon.noPokedex}</td>
                                            <td>{obtenerNombreTipo(pokemon.idTipo1)}</td>
                                            <td>{obtenerNombreTipo(pokemon.idTipo2) || 'N/A'}</td>
                                            <td>{obtenerNombreHabilidad(pokemon.idHabilidad1)}</td>
                                            <td>{obtenerNombreHabilidad(pokemon.idHabilidad2) || 'N/A'}</td>
                                            <td>{obtenerNombreHabilidad(pokemon.idHabilidad3) || 'N/A'}</td>
                                            <td>{LimitarCaracteres(pokemon.descripcion, 100)}</td>
                                            <td>{pokemon.hp}</td>
                                            <td>{pokemon.attack}</td>
                                            <td>{pokemon.defense}</td>
                                            <td>{pokemon.spattack}</td>
                                            <td>{pokemon.spdefense}</td>
                                            <td>{pokemon.speed}</td>
                                            <td>{pokemon.nivelEvolucion || 'N/A'}</td>
                                            <td>{obtenerNombreEvolucion(pokemon.idEvPrevia) || 'N/A'}</td>
                                            <td>{obtenerNombreEvolucion(pokemon.idEvSiguiente) || 'N/A'}</td>
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
};
const LimitarCaracteres = (description, maxLength) => {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
};
export default ListaPokemon;
