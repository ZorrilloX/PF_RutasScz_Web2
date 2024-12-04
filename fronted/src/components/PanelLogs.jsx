import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";

const GestionLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token"); // Token para la autorización

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/logs", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(response.data);
            } catch (err) {
                setError(err.response.data.message || "Error al cargar los logs.");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    if (loading) return <h2>Cargando...</h2>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1 className="my-5">Logs del Sistema</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tabla</th>
                        <th>Acción</th>
                        <th>Detalle</th>
                        <th>Usuario ID</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.tabla}</td>
                            <td>{log.accion}</td>
                            <td>{JSON.stringify(log.detalle)}</td>
                            <td>{log.usuarioId}</td>
                            <td>
                                {new Date(log.createdAt).toLocaleString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default GestionLogs;
