import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import CompMapCarreteras from "./CompMapCarreteras";
import CompMapViewCarretera from "./CompMapViewCarreteras";

const GestionCarreteras = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [carreteraData, setCarreteraData] = useState({
        nombre: "",
        municipioOrigen: "",
        municipioDestino: "",
        estado: "libre",
        razonBloqueo: "ninguna",
        puntos: [], // Array de coordenadas
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCarreteras = async () => {
            if (!token) {
                alert("No tienes acceso. Por favor, inicia sesión.");
                window.location.href = "/RutesScz/login";
                return;
            }

            try {
                // Cargar las carreteras
                const responseCarreteras = await axios.get("http://localhost:3000/carreteras", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCarreteras(responseCarreteras.data);

                // Cargar los municipios
                const responseMunicipios = await axios.get("http://localhost:3000/municipios", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMunicipios(responseMunicipios.data);

                setLoading(false);
            } catch (err) {
                setError("Error al cargar las carreteras o municipios.", err);
                localStorage.removeItem("token");
                window.location.href = "/RutesScz/login";
            }
        };

        fetchCarreteras();
    }, [token]);

    const handleCreate = () => {
        setCarreteraData({ nombre: "", municipioOrigen: "", municipioDestino: "", puntos: [] });
        setFormVisible(true);
    };

    const handleSave = async () => {
        console.log("municipio origen ", carreteraData.municipioOrigen);
        let municipioOrigenId;
        let municipioDestinoId;
        //añadir validacion
        if (!carreteraData.municipioOrigen){
             // Mapeo para encontrar los ID con ayuda de el nombre del municipio en carreteraData.nombre1
            const municipioOrigen = municipios.find((m) => m.nombre === carreteraData.nombre1).id;
            const municipioDestino = municipios.find((m) => m.nombre === carreteraData.nombre2).id;
            console.log(municipioDestino, "  ", municipioOrigen);
            if (!municipioOrigen || !municipioDestino) {
                setError("Debes seleccionar correctamente los municipios de origen y destino.");
                return;
            }
            console.log(municipioDestino, "  ", municipioOrigen);
            municipioOrigenId = municipioOrigen;
            municipioDestinoId = municipioDestino;
        }

        const dataToSave = {
            ...carreteraData,
            municipioOrigen: parseInt(municipioOrigenId),
            municipioDestino: parseInt(municipioDestinoId),
            estado: carreteraData.estado,
            razonBloqueo: carreteraData.razonBloqueo,
            puntos: carreteraData.puntos, // Convertir puntos a string
        };
        try {
            console.log(dataToSave);
            if (carreteraData.id) {
                // Actualizar carretera
                await axios.put(
                    `http://localhost:3000/carreteras/${carreteraData.id}`,
                    dataToSave,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Crear nueva carretera
                await axios.post("http://localhost:3000/carreteras", dataToSave, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setFormVisible(false);
            const response = await axios.get("http://localhost:3000/carreteras", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCarreteras(response.data);
            setGeneralError("");
        } catch (error) {
            setGeneralError("Error al guardar la carretera.", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta carretera?")) {
            try {
                await axios.delete(`http://localhost:3000/carreteras/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCarreteras(carreteras.filter((c) => c.id !== id));
            } catch (error) {
                setGeneralError("Error al eliminar la carretera.", error);
            }
        }
    };

    const handleRemovePunto = (index) => {
        const updatedPuntos = [...carreteraData.puntos];
        updatedPuntos.splice(index, 1);
        setCarreteraData({ ...carreteraData, puntos: updatedPuntos });
    };

    if (loading) return <h2>Cargando...</h2>;
    if (error) return <p>{error}</p>;

    return (
        <Container style={{ marginTop: "50px" }}>
            {generalError && <Alert variant="danger">{generalError}</Alert>}
            <h1 className="my-3">Gestión de Carreteras</h1>
            {!formVisible && (
                <>
                    <Form.Label><h5>(click en una carretera para ver mas informacion)</h5></Form.Label>
                    <Form style={{marginBottom : '10px'}}>
                        <CompMapViewCarretera />
                    </Form>
                    

                    <Button onClick={handleCreate} className="mb-3">
                        Crear Carretera
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Municipio Inicio</th>
                                <th>Municipio Fin</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carreteras.map((carretera) => (
                                <tr key={carretera.id}>
                                    <td>{carretera.id}</td>
                                    <td>{carretera.nombre}</td>
                                    <td>
                                        {carretera.municipioOrigen
                                            ? carretera.municipioOrigen.nombre
                                            : "Sin municipio"}
                                    </td>
                                    <td>
                                        {carretera.municipioDestino
                                            ? carretera.municipioDestino.nombre
                                            : "Sin municipio"}
                                    </td>
                                    <td>
                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => {
                                            setCarreteraData({
                                                ...carretera,
                                                municipioOrigen: carretera.municipioOrigen.id,
                                                municipioDestino: carretera.municipioDestino.id,
                                                puntos: typeof carretera.puntos === "string" 
                                                    ? JSON.parse(carretera.puntos) 
                                                    : carretera.puntos,
                                            });
                                            setFormVisible(true);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(carretera.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )};

            {formVisible && (
                <Form>
                    <h2 className="text-center">
                        {carreteraData.id ? "Editar Carretera" : "Crear Carretera"}
                    </h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={carreteraData.nombre}
                            onChange={(e) =>
                                setCarreteraData({ ...carreteraData, nombre: e.target.value })
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control
                            as="select"
                            value={carreteraData.estado || ""}
                            onChange={(e) =>
                                setCarreteraData({
                                    ...carreteraData,
                                    estado: e.target.value,
                                })
                            }
                        >
                            <option value="">Selecciona Estado</option>
                            <option value="libre">Libre</option>
                            <option value="No transitable por conflictos">No transitable por conflictos</option>
                            <option value="Restricción vehicular">Restricción vehicular</option>
                            <option value="No transitable tráfico cerrado">No transitable tráfico cerrado</option>
                            <option value="Restricción vehicular especial">Restricción vehicular especial</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">

                        <Form.Label>Razón de Bloqueo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Especifica una razón si está bloqueada"
                            value={carreteraData.razonBloqueo}
                            onChange={(e) =>
                                setCarreteraData({ ...carreteraData, razonBloqueo: e.target.value })
                            }
                        />
                    </Form.Group>

                    <CompMapCarreteras
                        carreteraData={carreteraData}
                        setCarreteraData={setCarreteraData}
                    />

                    <Form.Group className="mb-3">
                        <div className="mt-3">
                            <strong>Puntos actuales:</strong>
                            <ul>
                                {carreteraData.puntos.map((punto, index) => (
                                    <li key={index}>
                                        Lat: {punto.lat}, Lng: {punto.lng}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleRemovePunto(index)}
                                        >
                                            X
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Form.Group>

                    <Button variant="success" onClick={handleSave} className="me-2">
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={() => setFormVisible(false)}>
                        Cancelar
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default GestionCarreteras;
