import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom"

function Header() {
    
    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="no-print">
            <Container>
                <NavLink to="/" className="navbar-brand">
                    Steel Sales Calculator
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <li>
                            <NavLink to="/" className="nav-link">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/calculator-bobininhas"
                                className="nav-link"
                            >
                                Calcular Bobininhas
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/calculator-sapatas"
                                className="nav-link"
                            >
                                Calcular Sapatas
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/calculator-estribos"
                                className="nav-link"
                            >
                                Calcular Estribos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/calculator-colunas"
                                className="nav-link position-relative"
                            >
                                Calcular Colunas
                            </NavLink>
                        </li>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;