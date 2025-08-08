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
                <div
                    className="container my-5 py-5 d-flex justify-content-center flex-column align-items-center"
                    style={{ minHeight: '80vh' }}>
                    <div className="row g-5 align-items-center">
                        <div className="col-12 col-md-5 text-center">
                            <img
                                src={Banner}
                                alt="Banner"
                                className="illustration-home img-fluid d-none d-sm-block "
                            />
                        </div>
                        <div className="col-12 col-md-7 d-flex align-items-center justify-content-center flex-column text-center">
                            <div>
                                <h1 className="h2 fw-bold text-primary mb-3">
                                    Bem-vindo à Steel Sales Calculator
                                </h1>
                                <p className="lead text-secondary mb-4">
                                    Facilitando seus cálculos relacionados a
                                    aços na construção civil.
                                </p>
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    <Link to="/calculator-bobininhas">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark">
                                            Calcular Bobininhas
                                        </button>
                                    </Link>
                                    <Link to="/calculator-sapatas">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark">
                                            Calcular Sapatas
                                        </button>
                                    </Link>
                                    <Link to="/calculator-estribos">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark">
                                            Calcular Estribos
                                        </button>
                                    </Link>
                                    <Link to="/calculator-colunas">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark">
                                            Calcular Colunas
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
    );
}

export default Home