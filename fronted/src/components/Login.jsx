import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/usuarios/login', { email, password });
            const { token } = response.data;

            // Guardar el token en el localStorage
            localStorage.setItem('token', token);

            // Redirigir a la página protegida
            window.location.href = '/panel';
        } catch (err) {
            setError('Credenciales inválidas. Inténtalo de nuevo.', err);
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Iniciar Sesión</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin} className="mt-4">
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Iniciar Sesión
                </Button>
            </Form>
        </Container>
    );
};

export default Login;
