import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import CompMapMunicipio from "./CompMapIncidentes";

const GestionIncidentes = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [incidenteData, setIncidenteData] = useState({
        tipo: "",
        descripcion: "",
        ubicacion: { lat: null, lng: null },
        carreteraId: "",
    });
    const [verificados, setVerificados] = useState(false);
    const [carreteras, setCarreteras] = useState([]);
    const [tiposIncidente] = useState(["Desvíos", "Accidentes", "Obras"]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                alert("No tienes acceso. Por favor, inicia sesión.");
                window.location.href = "/RutesScz/login";
                return;
            }

            try {
                const [incidentesRes, carreterasRes] = await Promise.all([
                    axios.get("http://localhost:3000/incidentes/admin", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:3000/carreteras", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setIncidentes(incidentesRes.data);
                setCarreteras(carreterasRes.data);
            } catch (err) {
                setError(err.response.data.message || "Error al cargar los datos.");
                localStorage.removeItem("token");
                window.location.href = "/RutesScz/login";
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleCreate = () => {
        setIncidenteData({
            tipo: "",
            descripcion: "",
            ubicacion: { lat: null, lng: null },
            carreteraId: "",
        });
        setFormVisible(true);
    };

    const handleSave = async () => {
        try {
            // Preparar los datos del incidente (sin la imagen)
            const dataToSave = {
                ...incidenteData,
                ubicacion: {
                    lat: parseFloat(incidenteData.ubicacion.lat),
                    lng: parseFloat(incidenteData.ubicacion.lng),
                },
                carreteraId: parseInt(incidenteData.carreteraId),
            };
            let incidenteId;

            if (incidenteData.id) {
                // Actualizar incidente existente
                await axios.put(`http://localhost:3000/incidentes/${incidenteData.id}`, dataToSave, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                incidenteId = incidenteData.id;
            } else {
                // Crear un nuevo incidente y obtener su ID
                const response = await axios.post("http://localhost:3000/incidentes", dataToSave, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                incidenteId = response.data.id; // Asume que el backend devuelve el ID en la respuesta
            }
    
            // Subir la imagen si existe
            if (incidenteData.image) {
                const formData = new FormData();
                formData.append("image", incidenteData.image);

                await axios.post(`http://localhost:3000/incidentes/${incidenteId}/upload-image`, formData);
            }
    
            // Ocultar el formulario y actualizar la lista de incidentes
            setFormVisible(false);
            const updatedIncidentes = await axios.get("http://localhost:3000/incidentes/admin", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIncidentes(updatedIncidentes.data);
        } catch (error) {
            setGeneralError(error.response?.data?.message || "Error al guardar el incidente.");
            window.scrollTo(0, 0);
        }
    };
    

    const handleCancel = () => {
        setFormVisible(false);
        setIncidenteData({
            tipo: "",
            descripcion: "",
            ubicacion: { lat: null, lng: null },
            carreteraId: "",
        });
    };

    const handleEdit = (incidente) => {
        setIncidenteData({
            ...incidente,
            carreteraId: incidente.carretera?.id || "",
        });
        setFormVisible(true);
    };
    const handleValidate = async (id, isVerified) => {
        try {
            await axios.put(`http://localhost:3000/incidentes/${id}/validar`, { verificado: !isVerified }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIncidentes(incidentes.map(i => i.id === id ? { ...i, verificado: !isVerified } : i));
        } catch (error) {
            setGeneralError(isVerified ? "Error al invalidar el incidente." : "Error al validar el incidente.", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este incidente?")) {
            try {
                await axios.delete(`http://localhost:3000/incidentes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIncidentes(incidentes.filter((i) => i.id !== id));
            } catch (error) {
                setGeneralError(error.response.data.message || "Error al eliminar el incidente.");
            }
        }
    };

    if (loading) return <h2>Cargando...</h2>;
    if (error) return <p>{error}</p>;

    return (
        <Container style={{ marginTop: "50px" }}>
            {generalError && <Alert variant="danger">{generalError}</Alert>}
            <h1 className="my-3">Gestión de Incidentes</h1>
            {!formVisible ? (
                <>
                 <CompMapMunicipio
                            incidenteData={incidenteData}
                            setIncidenteData={setIncidenteData}
                        />
                    <div className="mb-3">
                        <Button onClick={handleCreate} style={{ marginRight: "10px" }}>
                            Crear Incidente
                        </Button>
                        <Button
                            variant={verificados ? "primary" : "secondary"}
                            onClick={() => setVerificados((prev) => !prev)}
                        >
                            {verificados ? "Verificados Activado" : "Todos"}
                        </Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Carretera</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidentes
                                .filter((incidente) => !verificados || incidente.verificado)
                                .map((incidente) => (
                                    <tr key={incidente.id}>
                                        <td>{incidente.id}</td>
                                        <td>{incidente.tipo}</td>
                                        <td>{incidente.descripcion}</td>
                                        <td>{incidente.carretera?.nombre}</td>
                                        <td>
                                            <Button
                                                variant={incidente.verificado ? "warning" : "success"}
                                                className="me-2"
                                                onClick={() =>
                                                    handleValidate(incidente.id, incidente.verificado)
                                                }
                                            >
                                                {incidente.verificado ? "Invalidar" : "Validar"}
                                            </Button>
                                            <Button
                                                className="me-2"
                                                onClick={() => handleEdit(incidente)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(incidente.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </>
            ) : (
                <Form style={{ width: "40vw" }}>
                    <h2 className="text-center">
                        {incidenteData.id ? "Editar Incidente" : "Crear Incidente"}
                    </h2>
                    <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            as="select"
                            value={incidenteData.tipo || ""}
                            onChange={(e) => setIncidenteData({ ...incidenteData, tipo: e.target.value })}
                        >
                            <option value="">Selecciona una Tipo de incidente</option>
                            {tiposIncidente.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={incidenteData.descripcion}
                            onChange={(e) => setIncidenteData({ ...incidenteData, descripcion: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Carretera</Form.Label>
                        <Form.Control
                            as="select"
                            value={incidenteData.carreteraId || ""}
                            onChange={(e) => setIncidenteData({ ...incidenteData, carreteraId: e.target.value })}
                        >
                            <option value="">Selecciona una carretera</option>
                            {carreteras.map((carretera) => (
                                <option key={carretera.id} value={carretera.id}>
                                    {carretera.nombre}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ubicación</Form.Label>
                        <CompMapMunicipio
                            incidenteData={incidenteData}
                            setIncidenteData={setIncidenteData}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Foto del incidente</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIncidenteData({ ...incidenteData, image: e.target.files[0] })}
                        />
                    </Form.Group>
                    <Button onClick={handleSave} className="mt-3 me-2">
                        {incidenteData.id ? "Actualizar" : "Guardar"}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} className="mt-3">
                        Cancelar
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default GestionIncidentes;
