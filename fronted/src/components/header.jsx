import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import getUserFromToken from '../utils/getUserFromToken';
import iconAdmin from '../assets/icons/PanelAdmin.jpg';
import iconGeneral from '../assets/icons/admin.png';
import iconPublic from '../assets/icons/home.png';
import icon from '../assets/icons/icon.png';
import flecha from '../assets/icons/flecha.png';

const Header = () => {
    const token = localStorage.getItem('token');
    const user = getUserFromToken(token);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/RutesScz/login';
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
            <Container fluid>
                <Navbar.Brand href="/"><img src={icon} alt="home icon" style={{ width: '20px', marginRight: '5px' }} />RutasScz</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav>
                        {user && user.rol === 'administrador' && (
                            <>
                                <Nav.Link href="/panel/admin">
                                    <img src={iconAdmin} alt="Admin Icon" style={{ width: '20px', marginRight: '5px' }} />
                                    Panel Admin
                                </Nav.Link>
                                <Nav.Link href="/panel/general">
                                    <img src={iconGeneral} alt="General Icon" style={{ width: '20px', marginRight: '5px' }} />
                                    Panel General
                                </Nav.Link>
                                <Nav.Link href="/RutesScz">
                                    <img src={iconPublic} alt="Public Icon" style={{ width: '20px', marginRight: '5px' }} />
                                    Página Principal
                                </Nav.Link>
                            </>
                        )}
                        {user && user.rol === 'verificador' && (
                            <>
                                <Nav.Link href="/panel/general">
                                    <img src={iconGeneral} alt="General Icon" style={{ width: '20px', marginRight: '5px' }} />
                                    Panel General
                                </Nav.Link>
                                <Nav.Link href="/RutesScz">
                                    <img src={iconPublic} alt="Public Icon" style={{ width: '20px', marginRight: '5px' }} />
                                    Página Principal
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Button variant="outline-light" onClick={handleBack} className="mx-auto">
                        <img src={flecha} alt="Flecha Icon" style={{ width: '30px', marginRight: '5px' }} />
                    </Button>
                    <Nav>
                        {user ? (
                            <>
                                <Navbar.Text className="me-3">
                                    {user.email} ({user.rol})
                                </Navbar.Text>
                                <Button variant="outline-light" onClick={handleLogout}>
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline-light" href="/RutesScz/login">
                                Iniciar Sesión
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
