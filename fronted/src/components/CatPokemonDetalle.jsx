import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './header';

const calcularHP = (baseStat, iv = 31, ev = 0, nivel = 100) => {
    return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * nivel) / 100) + nivel + 10;
};

const calcularStat = (baseStat, iv = 31, ev = 0, nivel = 100, naturaleza = 1.0) => {
    return Math.floor((Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * nivel) / 100) + 5) * naturaleza);
};

const CatPokemonDetalle = () => {
    const [pokemon, setPokemon] = useState(null);
    const [lineaEvolutiva, setLineaEvolutiva] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { pokemonId } = useParams();
    

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/pokeApi/${pokemonId}`);
                setPokemon(response.data);

                // Obtener la línea evolutiva
                const evolucionesResponse = await axios.get(`http://localhost:3000/pokeApi/evoluciones/${pokemonId}`);
                setLineaEvolutiva(evolucionesResponse.data);
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos del Pokémon');
                setLoading(false);
            }
        };
        fetchPokemonDetail();
    }, [pokemonId]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        
        <Container>
            <Row className="mt-4">
                <Col md={4}>
                    <Card>
                        <Card.Img
                            variant="top"
                            src={`http://localhost:3000/imagenes/${pokemonId}.jpg`}
                            alt={pokemon.nombre}
                        />
                        <Card.Body>
                            <Card.Title>{pokemon.nombre} #{pokemon.noPokedex}</Card.Title>
                            
                            <h5>Habilidades</h5>
                            <h4>{pokemon.habilidad1.nombre}</h4>
                            {pokemon.habilidad2 && <h4>{pokemon.habilidad2.nombre}</h4>}
                            {pokemon.habilidad3 && <h4>{pokemon.habilidad3.nombre}</h4>}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <h3>Estadísticas Base y Valores en Nivel 100</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Stat</th>
                                <th>Valor Base</th>
                                <th>Mínimo (Nv. 100)</th>
                                <th>Máximo (Nv. 100)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>HP</td>
                                <td>{pokemon.hp}</td>
                                <td>{calcularHP(pokemon.hp, 0, 0, 100)}</td>
                                <td>{calcularHP(pokemon.hp, 31, 252, 100)}</td>
                            </tr>
                            <tr>
                                <td>Ataque</td>
                                <td>{pokemon.attack}</td>
                                <td>{calcularStat(pokemon.attack, 0, 0, 100, 0.9)}</td>
                                <td>{calcularStat(pokemon.attack, 31, 252, 100, 1.1)}</td>
                            </tr>
                            <tr>
                                <td>Defensa</td>
                                <td>{pokemon.defense}</td>
                                <td>{calcularStat(pokemon.defense, 0, 0, 100, 0.9)}</td>
                                <td>{calcularStat(pokemon.defense, 31, 252, 100, 1.1)}</td>
                            </tr>
                            <tr>
                                <td>Ataque Especial</td>
                                <td>{pokemon.spattack}</td>
                                <td>{calcularStat(pokemon.spattack, 0, 0, 100, 0.9)}</td>
                                <td>{calcularStat(pokemon.spattack, 31, 252, 100, 1.1)}</td>
                            </tr>
                            <tr>
                                <td>Defensa Especial</td>
                                <td>{pokemon.spdefense}</td>
                                <td>{calcularStat(pokemon.spdefense, 0, 0, 100, 0.9)}</td>
                                <td>{calcularStat(pokemon.spdefense, 31, 252, 100, 1.1)}</td>
                            </tr>
                            <tr>
                                <td>Velocidad</td>
                                <td>{pokemon.speed}</td>
                                <td>{calcularStat(pokemon.speed, 0, 0, 100, 0.9)}</td>
                                <td>{calcularStat(pokemon.speed, 31, 252, 100, 1.1)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Línea Evolutiva */}
            <Row className="mt-4">
                <Card><Card.Text>{pokemon.descripcion}</Card.Text></Card>
                <h3>Línea Evolutiva</h3>
                
                <Col md={4}>
                    {lineaEvolutiva.evolution1 && (
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`http://localhost:3000/imagenes/${lineaEvolutiva.evolution1.id}.jpg`}
                                alt={lineaEvolutiva.evolution1.nombre}
                                style={{ cursor: 'pointer' }}
                                onClick={() => { window.location.href = `http://localhost:5173/pokeapi/${lineaEvolutiva.evolution1.id}`; }}
                            />
                            <Card.Body>
                                <Card.Title>{lineaEvolutiva.evolution1.nombre}</Card.Title>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
                <Col md={4}>
                    {lineaEvolutiva.evolution2 && (
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`http://localhost:3000/imagenes/${lineaEvolutiva.evolution2.id}.jpg`}
                                alt={lineaEvolutiva.evolution2.nombre}
                                style={{ cursor: 'pointer' }}
                                onClick={() => { window.location.href = `http://localhost:5173/pokeapi/${lineaEvolutiva.evolution2.id}`; }}
                            />
                            <Card.Body>
                                <Card.Title>{lineaEvolutiva.evolution2.nombre}</Card.Title>
                                <p>Evoluciona en el nivel {lineaEvolutiva.evolution1.nivelEvolucion}</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
                
                <Col md={4}>
                    {lineaEvolutiva.evolution3 && (
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`http://localhost:3000/imagenes/${lineaEvolutiva.evolution3.id}.jpg`}
                                alt={lineaEvolutiva.evolution3.nombre}
                                style={{ cursor: 'pointer' }}
                                onClick={() => { window.location.href = `http://localhost:5173/pokeapi/${lineaEvolutiva.evolution3.id}`; }}
                            />
                            <Card.Body>
                                <Card.Title>{lineaEvolutiva.evolution3.nombre}</Card.Title>
                                <p>Evoluciona en el nivel {lineaEvolutiva.evolution2.nivelEvolucion}</p>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CatPokemonDetalle;