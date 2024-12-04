import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import CompMapMunicipio from "./CompMapMunicipio";

const GestionMunicipios = () => {
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [municipioData, setMunicipioData] = useState({
        nombre: "",
        lat: null,
        lng: null,
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMunicipios = async () => {
            if (!token) {
                alert("No tienes acceso. Por favor, inicia sesión.");
                window.location.href = "/RutesScz/login";
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/municipios", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMunicipios(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar los municipios.", err);
                localStorage.removeItem("token");
                window.location.href = "/RutesScz/login";
            }
        };

        fetchMunicipios();
    }, [token]);

    const handleCreate = () => {
        setMunicipioData({ nombre: "", lat: null, lng: null });
        setFormVisible(true);
    };

    const handleEdit = (municipio) => {
        setMunicipioData(municipio);
        setFormVisible(true);
    };

    const handleSave = async () => {
        const dataToSave = { 
            ...municipioData,
            lat: parseFloat(municipioData.lat),
            lng: parseFloat(municipioData.lng),
        };
        console.log(municipioData);
        try {
            if (municipioData.id) {
                // Actualizar municipio
                await axios.put(
                    `http://localhost:3000/municipios/${municipioData.id}`,
                    dataToSave,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Crear nuevo municipio
                await axios.post("http://localhost:3000/municipios", dataToSave, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setFormVisible(false);
            const response = await axios.get("http://localhost:3000/municipios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMunicipios(response.data);
            setGeneralError("");
        } catch (error) {
            setGeneralError("Error al guardar el municipio.", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este municipio?")) {
            try {
                await axios.delete(`http://localhost:3000/municipios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMunicipios(municipios.filter((m) => m.id !== id));
            } catch (error) {
                if (error.response && error.response.data.message) {
                    setGeneralError(error.response.data.message);
                } else {
                    setGeneralError("Error al eliminar el municipio.");
                }
                //mover la vista de la pagina hacia arriba
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    if (loading) return <h2>Cargando...</h2>;
    if (error) return <p>{error}</p>;

    return (
        <Container style={{ marginTop: "50px" }}>
            {generalError && <Alert variant="danger">{generalError}</Alert>}
            <h1 className="my-3">Gestión de Municipios</h1>
            {!formVisible && (
                <>
                    <CompMapMunicipio
                        municipioData={municipioData}
                        setMunicipioData={setMunicipioData}
                    />
                    <Button onClick={handleCreate} className="mb-3">
                        Crear Municipio
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Latitud</th>
                                <th>Longitud</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {municipios.map((municipio) => (
                                <tr key={municipio.id}>
                                    <td>{municipio.id}</td>
                                    <td>{municipio.nombre}</td>
                                    <td>{municipio.lat}</td>
                                    <td>{municipio.lng}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => handleEdit(municipio)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(municipio.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            {formVisible && (
                <Form>
                    <h2 className="text-center">
                        {municipioData.id ? "Editar Municipio" : "Crear Municipio"}
                    </h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={municipioData.nombre}
                            onChange={(e) =>
                                setMunicipioData({ ...municipioData, nombre: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>(Marca las coordenadas haciendo CLICK)</Form.Label>
                        <CompMapMunicipio
                            municipioData={municipioData}
                            setMunicipioData={setMunicipioData}
                        />
                    </Form.Group>      
                    

                    <Form.Group className="mb-3">
                        <Form.Label>Latitud</Form.Label>
                        <Form.Control
                            type="number"
                            value={municipioData.lat || ""}
                            onChange={(e) =>
                                setMunicipioData({ ...municipioData, lat: parseFloat(e.target.value) })
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Longitud</Form.Label>
                        <Form.Control
                            type="number"
                            value={municipioData.lng || ""}
                            onChange={(e) =>
                                setMunicipioData({ ...municipioData, lng: parseFloat(e.target.value) })
                            }
                        />
                    </Form.Group>
                    <Button variant="success" className="me-2" onClick={handleSave}>
                        Guardar
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setGeneralError("");
                            setFormVisible(false);
                        }}
                    >
                        Cancelar
                    </Button>
                </Form>
            )}
            
        </Container>
    );
};

export default GestionMunicipios;
