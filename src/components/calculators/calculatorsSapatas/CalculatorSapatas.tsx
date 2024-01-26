import { Container, Form } from "react-bootstrap"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import ImgSapata from "../../../assets/img/sapataImgWithOutBG.png"
import ImgEstribo from "../../../assets/img/estribo.png"
import { FormEvent } from 'react';
import { useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import '../../../assets/css/calculatorResponsive.css';

function CalcSapatas() {
    const [largura, setLargura] = useState(0);
    const [comprimento, setComprimento] = useState(0);
    const [altura, setAltura] = useState(0);
    const [quantidadeDeFerros, setQuantidadeDeFerros] = useState(0);
    const [quantidadeDeSapatas, setQuantidadeDeSapatas] = useState(0);
    const [bitola, setBitola] = useState('4.2');
    const [result, setResult] = useState(false);

    const pesos: { [key: string]: number } = {
        '4.2': 0.115, // Chaves como strings
        '5': 0.157,
        '6.3': 0.250, 
        '8': 0.398, 
        '10': 0.628, 
        '12.5': 0.985,
        '16': 1.610,
        '20': 2.550,
    }
    
    const transpasses: { [key: string]: number } = {
        '4.2': 5.5, // Chaves como strings
        '5': 5.5,
        '6.3': 6, 
        '8': 8, 
        '10': 10, 
        '12.5': 12,
        '16': 16,
        '20': 20,
    }

    //FormEvent é um tipo definido que representa um evento de formulário. Este tipo é usado quando você lida com eventos em um formulário, como um evento de envio (onSubmit).
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        
        setResult(!result)
    };
    
    const calculatorWeightEstribos = (lado1: number, lado2: number, bitolaEstribo: string, quantidadeFerrosParaEstribo: number): number => {
        const quantidadeEstribosPorSapata = quantidadeFerrosParaEstribo / 2
        const totalLength: number = (lado1 * 2) + (lado2 * 2) +  (transpasses[bitolaEstribo] * 2);
        const weigth: number = ((totalLength * pesos[bitolaEstribo]) * quantidadeEstribosPorSapata * quantidadeDeSapatas) / 100;

        return parseFloat(weigth.toFixed(2));
    }

    const weightEstribos = calculatorWeightEstribos(largura, altura, bitola, quantidadeDeFerros);
    const weightEstribosLess2 = calculatorWeightEstribos(largura, altura - 2, bitola, quantidadeDeFerros);

    const returnForm = (event: FormEvent) => {
        event.preventDefault()
        setResult(!result)
    }
    
    return (
        <>
            <Header></Header>
            {result === true ? 
                <Container className="mt-5 rounded-3 d-flex flex-column" >
                    <div className="table-responsive">    
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Bitola</th>
                                    <th>Quantidade de Estribos por Sapata</th>
                                    <th>Quantidade de Estribos Totais</th>
                                    <th>Largura</th>
                                    <th>Comprimento</th>
                                    <th>Peso Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>{bitola}</td>
                                    <td>{quantidadeDeFerros / 2}</td>
                                    <td>{quantidadeDeFerros / 2 * quantidadeDeSapatas}</td>
                                    <td>{largura}</td>
                                    <td>{altura}</td>
                                    <td>{weightEstribos} Kg</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>{bitola}</td>
                                    <td>{quantidadeDeFerros / 2}</td>
                                    <td>{quantidadeDeFerros / 2 * quantidadeDeSapatas}</td>
                                    <td>{comprimento}</td>
                                    <td>{altura - 2}</td>
                                    <td>{weightEstribosLess2} Kg</td>
                                </tr>
                                <tr>
                                    <td><strong>Total</strong></td>
                                    <td>-</td>
                                    <td>{quantidadeDeFerros}</td>
                                    <td>{quantidadeDeFerros * quantidadeDeSapatas}</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>{Number(weightEstribosLess2 + weightEstribos).toFixed(2)} Kg</td>
                                </tr>
                            </tbody>
                        </Table> 
                    </div>
                    <Card className="mb-3 w-50 text-center align-self-center" border="danger">
                        <Card.Body className="text-bold"><strong>Quantidade de Sapatas: {quantidadeDeSapatas}</strong></Card.Body>
                    </Card>
                    <div className="w-100 d-flex justify-content-center align-items-center gap-5">
                        <Button variant="primary" onClick={(event) => returnForm(event)}>Refazer Cálculo</Button>

                        <Button variant="dark" onClick={() => window.print()}>Imprimir</Button>
                    </div>
                    <Container className="mt-4 mb-4 d-flex justify-content-center align-items-center gap-2 flex-column">
                        <h3 className="text-body-secondary">Montagem das Sapatas:</h3>
                        <div className="mt-2 d-flex justify-content-center align-items-center gap-2 container-imgs-sapatas">
                            <Image src={ImgSapata} alt="Sapata"></Image>
                            <div>
                                <div className="w-100 d-flex justify-content-center flex-column align-items-center mb-3">
                                    <div>
                                        <span>{altura}</span>
                                        <Image src={ImgEstribo}></Image>
                                    </div>
                                    <span>{comprimento}</span>
                                </div>
                                <div className="w-100 d-flex justify-content-center flex-column align-items-center">
                                    <div>
                                        <span>{altura - 2}</span>
                                        <Image src={ImgEstribo}></Image>
                                    </div>
                                    <span>{comprimento}</span>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Container>
                : 
                <Container>
                    <Container>
                        <h1 className="mb-4 mt-4 text-center">Cálculo Sapatas</h1>
                    </Container>
                    <Form className="m-5 rounded-3" style={{minHeight: "50vh"}}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="largura">
                            <Form.Label>Largura</Form.Label>
                            <Form.Control 
                                type="number" placeholder="Digite a Largura" 
                                min={1}
                                value={largura} 
                                onChange={(event) => setLargura(Number(event.target.value))}
                                pattern=""
                            />
                            </Form.Group>
                            
                            <Form.Group as={Col} controlId="comprimento">
                                <Form.Label>Comprimento</Form.Label>
                                <Form.Control 
                                    type="number" placeholder="Digite o Comprimento" 
                                    value={comprimento} 
                                    onChange={(event) => setComprimento(Number(event.target.value))}
                                    min={1}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="altura">
                                <Form.Label>Altura</Form.Label>
                                <Form.Control 
                                    type="number" placeholder="Digite a Altura" 
                                    value={altura} 
                                    onChange={(event) => setAltura(Number(event.target.value))}
                                    min={1}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">

                            <Form.Group as={Col} controlId="quantidadeDeSapatas">
                                <Form.Label>Quantidade De Sapatas</Form.Label>
                                <Form.Control 
                                    type="number" placeholder="Digite a Quantidade De Sapatas" 
                                    value={quantidadeDeSapatas} 
                                    onChange={(event) => setQuantidadeDeSapatas(Number(event.target.value))}
                                    min={1}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="quantidadeDeFerros">
                                <Form.Label>Quantidade de ferros por sapatas</Form.Label>
                                <Form.Control 
                                    type="number" placeholder="Digite a Quantidade De Ferros" 
                                    value={quantidadeDeFerros} 
                                    onChange={(event) => setQuantidadeDeFerros(Number(event.target.value))}
                                    min={1}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="bitola">
                                <Form.Label>Bitola em mm</Form.Label>
                                <Form.Select 
                                    aria-label="Default select example"
                                    value={bitola}
                                    onChange={(event) => setBitola(event.target.value)}
                                >
                                    <option value="4.2">4.2</option>
                                    <option value="5">5</option>
                                    <option value="6.3">6.3</option>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                    <option value="12.5">12.5</option>
                                    <option value="16">16</option>
                                    <option value="20">20</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Button variant="primary" onClick={(event) => handleSubmit(event)}>
                            Calcular
                        </Button>
                    </Form>
                </Container>
            }
            <Footer></Footer>
        </>
    )
}

export default CalcSapatas