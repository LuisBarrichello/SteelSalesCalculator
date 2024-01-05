import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header({calculatorSapata, calculatorBobininha, resetCalculators}) {
    
    return (
        <Navbar bg='dark' data-bs-theme="dark" expand="lg" className='no-print'>
            <Container>
                <Navbar.Brand href="#home">Goldoni Sales Calculator</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link
                            onClick={(event) => resetCalculators(event)}
                        >Home</Nav.Link>
                        <Nav.Link 
                            onClick={(event) => calculatorBobininha(event)}
                        >Calcular Bobininhas</Nav.Link>
                        <Nav.Link 
                            
                            onClick={(event) => calculatorSapata(event)}
                        >Calcular Sapatas</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;