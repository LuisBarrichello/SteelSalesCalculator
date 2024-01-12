import Banner from "../assets/img/undraw_calculator_re_alsc.svg"
import { Link } from "react-router-dom";

import Header from './common/Header';
import Footer from './common/Footer';
import { Container } from 'react-bootstrap';

function Home () {

    return (
        <>
            <Header></Header>
            <Container>
                <div className="container mt-3 mb-3">
                    <div className="row">
                    <div className="col-md">
                        <img src={Banner} alt="Banner" className="illustration-home img-fluid d-none d-sm-block" />
                    </div>
                        <div className="col mt-5 d-flex align-items-center justify-content-center flex-column">
                            <div>
                                <h1 className="h2">Bem-vindo à Calculadora para facilitar as vendas da Comercial Goldoni</h1>
                                <p className="lead">Facilitando seus cálculos relacionados a aços na construção civil e serralheria.</p>
                                <div className="d-flex gap-2">
                                    <Link to="/calculator-bobininhas">
                                        <button type="button" className="btn btn-outline-dark">
                                                Calcular Bobininhas
                                        </button>
                                    </Link>
                                    <Link to="/calculator-sapatas">
                                        <button type="button" className="btn btn-outline-dark">
                                            Calcular Sapatas
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <Footer></Footer>
        </>
    )
}

export default Home