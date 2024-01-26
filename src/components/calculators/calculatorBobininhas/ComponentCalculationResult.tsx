import ImgSliter from "../../../assets/img/cortesbobininha.png"

interface Result {
    weight: number[];
    quantityOfMeters: number;
    quantityOfCoil: number;
    qualityOfMaterial: string;
    quantityOfCuts: number;
    hasCuts: boolean;
    cuts: { [key: string]: number };
    thickness: number;
    status: boolean;
}

interface Props {
    result: Result;
    resetForm: () => void;
}

function CalculationResult({ result, resetForm }: Props) {
    const { hasCuts, cuts } = result;

    return (
        <>
            <div className="table-responsive">
                <table className="table table-hover mt-2">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Quantidade de Bobinas</th>
                            <th>Qualidade da matéria prima</th>
                            <th>Espessura</th>
                            <th>Largura</th>
                            <th>Comprimento</th>
                            <th>Peso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hasCuts === true ? 
                            Object.keys(cuts).map((_, cutIndex) => {
                                return (
                                    <>
                                        <tr >
                                            <td>{cutIndex}</td>
                                            <td>{result.quantityOfCoil}</td>
                                            <td>{result.qualityOfMaterial.toUpperCase()}</td>
                                            <td>{result.thickness}</td>
                                            <td>{cuts[cutIndex]}</td>
                                            <td>{result.quantityOfMeters}</td>
                                            <td>{result.weight[cutIndex].toFixed(2)} Kg</td>
                                        </tr>
                                        
                                    </>
                                )
                            })
                        :
                            <>
                                <tr>
                                    <td>1</td>
                                    <td>{result.quantityOfCoil}</td>
                                    <td>{result.qualityOfMaterial.toUpperCase()}</td>
                                    <td>{result.thickness}</td>
                                    <td>1200</td>
                                    <td>{result.quantityOfMeters}</td>
                                    <td>{result.weight} Kg</td>
                                </tr>
                            </>
                        }
                        <tr>
                            <td><strong>Peso Total</strong></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{result.weight.reduce((acc, item) => acc + item)} Kg</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <section className="mt-5">
                <div className="w-100 d-flex justify-content-center align-items-center gap-5">
                    <button className="btn btn-primary" onClick={() => resetForm()}>Refazer Cálculo</button>

                    <button className="btn btn-dark" onClick={() => window.print()}>Imprimir</button>
                </div>
            </section>
            <section className="container">
                <div className="row mt-5">
                    <div className="col-sm-6 no-print">
                        <h5>Resumo do processão de Fabricação</h5>
                        <img src={ImgSliter} alt="" className="mx-auto d-block" style={{ maxWidth: '100%', height: 'auto' }}/>
                    </div>
                    <div className="col">
                        <h4>Obervações Importantes</h4>
                        <div className="card border-danger  mb-3" >
                            <div className="card-body text-dark">
                                <h5 className="card-title">Quantidade Máxima de Kg por Corte</h5>
                                <p className="card-text">Peso por montagem é limitado a <strong className="text-danger ">500 Kgs máximo</strong>, devido ao limite do eixo de saída da máquina.
                                </p>
                            </div>
                        </div>

                        <div className="card border-danger  mb-3" >
                            <div className="card-body text-dark">
                                <h5 className="card-title">Quantidade de Cortes</h5>
                                <p className="card-text">No máximo <strong className="text-danger ">6 cortes em uma bobina</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default CalculationResult