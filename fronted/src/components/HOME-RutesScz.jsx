import { useEffect, useState } from "react";
import { Container, Button, Form, Alert, Modal, Table } from "react-bootstrap";
import axios from "axios";
import CompMapMunicipio from "./ComMapHOME"; // Asumimos que el mapa es un componente ya funcional
import icon from '../assets/icons/icon.png';
import imgIncidente from '../assets/icons/advertencia.png';

const PaginaPrincipal = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [incidenteData, setIncidenteData] = useState({
        tipo: "",
        descripcion: "",
        ubicacion: { lat: null, lng: null },
        carreteraId: "",
    });
    const [carreteras, setCarreteras] = useState([]);
    const [showModalForm, setShowModalForm] = useState(false); // Controla el popup del formulario
    const [selectedCarretera, setSelectedCarretera] = useState(null);
    const [selectedCarreteraMap, setSelectedCarreteraMap] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal para el motivo de bloqueo
    const [filtroEstado, setFiltroEstado] = useState(""); // Estado para el filtro de estado en tablas y mapa


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incidentesRes, carreterasRes] = await Promise.all([
                    axios.get("http://localhost:3000/incidentes"),
                    axios.get("http://localhost:3000/carreteras"),
                ]);
                console.log(incidentesRes.data);
                console.log(carreterasRes.data);
                setIncidentes(incidentesRes.data);
                setCarreteras(carreterasRes.data);
            } catch (err) {
                setError(err.response.data.message || "Error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Función para manejar el botón "Ver carretera"
    const handleVerCarretera = (carretera) => {
        console.log(`Resaltando en el mapa la carretera: ${carretera.nombre}`);
        //hacer que la pagina se centre
        window.scrollTo({
            top: 140,
            behavior: 'smooth' // Esto hace que el desplazamiento sea suave
        });

        setSelectedCarreteraMap(carretera);
        // Aquí puedes enviar la información al mapa para resaltarlo
    };

    // Función para abrir el modal con el motivo de bloqueo
    const handleVerMotivo = async (carretera) => {
        //encontrar el id de carretera con un nuevo endpoint get
        const motivoRes = await axios.get(`http://localhost:3000/incidentes/${carretera.id}/IdDeCarretera`);
        console.log(motivoRes.data);
        //actualizar carretera.id
        carretera.incidenteId = motivoRes.data.incidenteId;
        //mostrar el modal con el motivo de bloqueo
        setSelectedCarretera(carretera);
        setShowModal(true);
    };

    // Función para mostrar el formulario y resetear los datos
    const handleCreate = () => {
        setIncidenteData({
            tipo: "",
            descripcion: "",
            ubicacion: { lat: incidenteData.ubicacion.lat, lng: incidenteData.ubicacion.lng },
            carreteraId: "",
        });
        setShowModalForm(true); // Mostrar el modal
    };
    // Función para guardar el incidente
    const handleSave = async () => {
        try {
            const dataToSave = {
                ...incidenteData,
                ubicacion: {
                    lat: parseFloat(incidenteData.ubicacion.lat),
                    lng: parseFloat(incidenteData.ubicacion.lng),
                },
                carreteraId: parseInt(incidenteData.carreteraId),
            };
            let incidenteId;

            
            const response = await axios.post("http://localhost:3000/incidentes", dataToSave);
            incidenteId = response.data.id;
        
            // Subir la imagen si existe
            if (incidenteData.image) {
                const formData = new FormData();
                formData.append("image", incidenteData.image);

                await axios.post(`http://localhost:3000/incidentes/${incidenteId}/upload-image`, formData);
            }

            setShowModalForm(false); // Cerrar el modal
        } catch (error) {
            setGeneralError(error.response?.data?.message || "Error al guardar el incidente.");
            window.scrollTo(0, 0);
        }
    };

    // Filtrar carreteras por el estado
    const handleFiltrarEstado = (estado) => {
        console.log("Estado seleccionado para filtro:", estado);
        setFiltroEstado(estado);
    };

    // Filtrar las carreteras en base al filtro de estado
    const carreterasFiltradas = carreteras.filter((carretera) => {
        console.log("Comparando estado de carretera:", carretera.estado, "con filtro de estado:", filtroEstado);
        return filtroEstado === "" || carretera.estado === filtroEstado;
    });

    console.log("Carreteras filtradas:", carreterasFiltradas);

    if (loading) return <h2>Cargando...</h2>;
    if (error) return <p>{error}</p>;

    return (
        <Container style={{ marginTop: "50px" }}>
            {generalError && <Alert variant="danger">{generalError}</Alert>}
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={icon} alt="home icon" style={{ width: '80px', marginRight: '10px' }} />
                    <span style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>RutasScz</span>
                </div>
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    style={{
                        padding: '12px 20px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        minWidth: '200px',
                    }}
                    className="ms-3" // Espacio entre el título y el botón
                ><img src={imgIncidente} alt="" style={{width:"30px", margin:"5px"}}></img>
                    Reportar un incidente
                </Button>
            </h1>


            <CompMapMunicipio //GRANDIOSO MAPA DIOS MIO
                incidenteData={incidenteData}
                setIncidenteData={setIncidenteData}
                carreteraSeleccionada={selectedCarreteraMap}
                setCarreteraSeleccionada={setSelectedCarreteraMap}
                carreterasFiltradas={carreterasFiltradas}
            />

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "700px" }}>
                {/* Tabla de carreteras */}
                <div style={{ flex: 1 }}>
                    <h2>Carreteras</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Municipio Origen</th>
                                <th>Municipio Destino</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carreterasFiltradas.map((carretera) => (
                                <tr key={carretera.id}>
                                    <td>{carretera.municipioOrigen.nombre}</td>
                                    <td>{carretera.municipioDestino.nombre}</td>
                                    <td>{carretera.nombre}</td>
                                    <td>
                                        <Button
                                            variant="info"
                                            onClick={() => handleVerCarretera(carretera)}
                                            className="me-2"
                                        >
                                            Ver carretera
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            style={{ maxWidth: '120px' }}
                                            variant={carretera.estado === "libre" ? "success" : "warning"}
                                            onClick={() => carretera.estado !== "libre" && handleVerMotivo(carretera)}
                                            disabled={carretera.estado === "libre"}
                                        >
                                            {carretera.estado === "libre" ? "Libre" : "Bloqueado Ver motivo"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* Nueva columna para los filtros */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px', marginLeft :'10px', padding:'10px', backgroundColor: '#FFFFFF', alignItems:'center'}}>
                    <h3>Filtros de Estado</h3>
                    <Button variant="primary" onClick={() => handleFiltrarEstado("libre")}>Transitable</Button>
                    <Button variant="warning" onClick={() => handleFiltrarEstado("No transitable por conflictos")}>No transitable por conflictos</Button>
                    <Button variant="secondary" onClick={() => handleFiltrarEstado("Restricción vehicular")}>Restricción vehicular</Button>
                    <Button variant="warning" onClick={() => handleFiltrarEstado("No transitable tráfico cerrado")}>No transitable tráfico cerrado</Button>
                    <Button variant="secondary" onClick={() => handleFiltrarEstado("Restricción vehicular especial")}>Restricción vehicular especial</Button>
                    <Button variant="primary" onClick={() => handleFiltrarEstado("")}>Todos</Button>
                </div>
            </div>


            {/* Modal de motivo de bloqueo */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Motivo de Bloqueo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCarretera && (
                        <>
                            <p><strong>Motivo:</strong> <h6>{selectedCarretera.razonBloqueo}</h6></p>
                            <img
                                src={`http://localhost:3000/imagenes/incidentes/${selectedCarretera.incidenteId}.jpg`}
                                alt="Incidente"
                                style={{ width: "100%", maxHeight: "400px" }}
                            />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Popup del formulario */}
            <Modal show={showModalForm} onHide={() => setShowModalForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reporte de Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Foto del incidente</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setIncidenteData({ ...incidenteData, image: e.target.files[0] })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTipo">
                            <Form.Label>Tipo de incidente</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tipo de incidente"
                                value={incidenteData.tipo}
                                onChange={(e) => setIncidenteData({ ...incidenteData, tipo: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Descripción del incidente"
                                value={incidenteData.descripcion}
                                onChange={(e) => setIncidenteData({ ...incidenteData, descripcion: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCarretera">
                            <Form.Label>Carretera</Form.Label>
                            <Form.Control
                                as="select"
                                value={incidenteData.carreteraId}
                                onChange={(e) => setIncidenteData({ ...incidenteData, carreteraId: e.target.value })}
                            >
                                <option value="">Seleccionar carretera</option>
                                {carreteras.map((carretera) => (
                                    <option key={carretera.id} value={carretera.id}>
                                        {carretera.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formUbicacion">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                readOnly
                                value={incidenteData.ubicacion.lat ? `Lat: ${incidenteData.ubicacion.lat}, Lng: ${incidenteData.ubicacion.lng}` : "Seleccione un punto en el mapa"}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleSave}>
                            Guardar
                        </Button>
                        <Button variant="secondary" onClick={() => setShowModalForm(false)}>
                            Cancelar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default PaginaPrincipal;
