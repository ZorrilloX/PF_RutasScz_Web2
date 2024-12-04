import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Modal, Alert } from "react-bootstrap";
import axios from "axios";

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState("");

    const [userData, setUserData] = useState({
        email: "",
        rol: "",
    });
    const token = localStorage.getItem("token"); // el supremo token

    useEffect(() => {
        const verificarToken = async () => {
            console.log(token);
            if (!token) {
                alert("No tienes acceso. Por favor, inicia sesión.");
                window.location.href = "../../rutesScz/login";
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/usuarios", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsuarios(response.data);
                setLoading(false);
            } catch (err) {
                alert("Los verificadores no pueden entrar a esta seccion");
                setError("Los verificadores no pueden entrar a esta seccion", err);
                window.location.href = "../../rutesScz/login";
            }
        };

        verificarToken();
    }, [token]);

    const handleEdit = (usuario) => {
        setUserData(usuario);
        setFormVisible(true);
        setPasswordVisible(false);
    };

    const handleCreate = () => {
        setUserData({ email: "", rol: "", password: "" });
        setFormVisible(true);
        setPasswordVisible(true);
    };

    const handleSave = async () => {
        try {
            if (userData.id) {
                delete userData.password;
                console.log("EDIT");
                await axios.put(
                    `http://localhost:3000/usuarios/${userData.id}`,
                    userData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                console.log("POST");
                await axios.post("http://localhost:3000/usuarios", userData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setFormVisible(false);
            setLoading(false);
            const response = await axios.get("http://localhost:3000/usuarios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsuarios(response.data);
            //setLoading(false);
            setGeneralError("");
        } catch (error) {
            if (error.response && error.response.data.message) {
                setGeneralError(error.response.data.message);
            };
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await axios.delete(`http://localhost:3000/usuarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsuarios(usuarios.filter((u) => u.id !== id));
                setGeneralError("");
            } catch (error) {
                setGeneralError("Error al eliminar el usuario.", error);
            }
        }
    };

    const handleChangePassword = async () => {
        try {
            await axios.put(
                `http://localhost:3000/usuarios/${currentUser.id}/cambiar-password`,
                { password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChangePasswordVisible(false);
            setNewPassword("");
            setGeneralError("");
        } catch (error) {
            if (error.response && error.response.data.message) {
                setGeneralError(error.response.data.message);
            } else {
                setGeneralError("Error al conectar con el servidor.");
            }
        }
    };

    if (loading) return <h2>Cargando...</h2>;
    if (error) return <p>{error}</p>;

    return (
        <Container style={{ marginTop: "-100px" }}>
            {generalError && <Alert variant="danger">{generalError}</Alert>}
            <h1 className="my-3">Gestión de Usuarios</h1>
            {!formVisible && (
                <>
                    <Button onClick={handleCreate} className="mb-3">
                        Crear Usuario
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => handleEdit(usuario)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => {
                                                setCurrentUser(usuario);
                                                setChangePasswordVisible(true);
                                            }}
                                        >
                                            Cambiar Contraseña
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(usuario.id)}
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
                        {userData.id ? "Editar Usuario" : "Crear Usuario"}
                    </h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                                setUserData({ ...userData, email: e.target.value })
                            }
                        />
                    </Form.Group>
                    {passwordVisible && (
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={userData.password || ""}
                                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                disabled={!!userData.id} />
                            </Form.Group>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>ROL</Form.Label>
                        <Form.Control
                            as="select"
                            value={userData.rol}
                            onChange={(e) =>
                                setUserData({ ...userData, rol: e.target.value })
                            }
                        >
                            <option value="">Selecciona un ROL</option>
                            <option value="administrador">administrador</option>
                            <option value="verificador">verificador</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="success" className="me-2" onClick={handleSave}>
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        setGeneralError(""),
                            setFormVisible(false)
                    }}>
                        Cancelar
                    </Button>
                </Form>
            )}

            <Modal
                show={changePasswordVisible}
                onHide={() => setChangePasswordVisible(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Title>` {currentUser?.email} `</Modal.Title>
                    <Form.Group>
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setChangePasswordVisible(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword}>
                        Cambiar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GestionUsuarios;
