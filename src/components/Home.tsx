import Banner from "../assets/img/undraw_calculator_re_alsc.svg"

function Home () {

    return (
        <>
            <div className="container mt-3 mb-3">
                <div className="row">
                    <div className="col">
                        <img src={Banner} alt="Banner" className="img-fluid" />
                    </div>
                    <div className="col mt-5 d-flex align-items-center justify-content-center flex-column">
                        <div>
                            <h1 className="h2">Bem-vindo à Calculadora para facilitar as vendas da Comercial Goldoni</h1>
                            <p className="lead">Facilitando seus cálculos relacionados a aços na construção civil e serralheria.</p>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-outline-dark">Calcular Bobininhas</button>
                                <button type="button" className="btn btn-outline-dark">Calcular Sapatas</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home