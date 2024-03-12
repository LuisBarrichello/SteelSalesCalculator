import { useEffect, useState } from "react";

interface FormState {
    thickness: number;
    qualityOfMaterial: string;
    hasCuts: boolean;
    quantityOfCuts: number;
    quantityOfMeters: number;
    quantityOfCoil: number;
    cuts: object;
}  

interface DataCoil {
    [key: string]: {thickness: string; weight: number;}[];
}

interface Props {
formState: FormState;
dataCoil: DataCoil;
handleInputChange: (field: string, value: string | number | boolean) => void;
handleSubmit: () => void
}


function InputFormBobininhas({ formState, dataCoil, handleInputChange, handleSubmit }: Props) {
    const [widthCoil, setWidthCoil] = useState<number>(0);

    useEffect(() => {
        const totalWidth  = Object.values(formState.cuts).reduce((acc, item) => acc + item, 0)
        setWidthCoil(totalWidth)
    }, [formState.cuts])

    return (
        <>
            <h1 className="mb-4 mt-4 text-center">Cálculo Bobininhas</h1>
            <form action="">
                <div className="form-floating mb-3 mt-3">
                    <select 
                        name="" 
                        id="" 
                        className="form-select"
                        required
                        onChange={(event) => handleInputChange('qualityOfMaterial', event.target.value)}
                    >
                        <option value="bgl">Galvalume</option>
                        <option value="azul">Azul</option>
                        <option value="branca">Branca</option>
                        <option value="cinza">Cinza</option>
                        <option value="vermelha">Vermelha</option>
                        <option value="preta">Preta</option>
                        <option value="ceramica">Ceramica</option>
                        <option value="revestimento-x">Revestimento X</option>
                    </select>
                    <label htmlFor="">Escolha qualidade do material</label>
                </div>

                <div className="form-floating">
                    <select 
                        name="" 
                        id="" 
                        className="form-select" onChange={(event) => handleInputChange('thickness', Number(event.target.value))}
                        required
                    >   
                        {dataCoil && dataCoil[formState.qualityOfMaterial] && dataCoil[formState.qualityOfMaterial].map((item, index: number) => {
                            return <option key={index} value={item.thickness}>{item.thickness}</option>
                        })}
                    </select>
                    <label htmlFor="">Escolha espessura da chapa</label>
                </div>
                
                <div className="form-floating mb-3 mt-3">
                    <input 
                        type="number" 
                        className={`form-control ${formState.quantityOfCoil <= 0 ? 'is-invalid' : ''}`}
                        id="" 
                        placeholder="" 
                        name="quantityOfCoil" 
                        required
                        min={1} 
                        onChange={(event) => {handleInputChange('quantityOfCoil', Number(event.target.value))}}
                    />
                    <label htmlFor="quantityOfCoil">Digite a quantidade de bobininhas</label>
                    <div className="invalid-feedback">A quantidade de bobinas deve ser maior que zero.</div>
                </div>

                <div  className="form-floating mb-3 mt-3">
                    <select 
                        name="hasCuts" 
                        id="" 
                        className="form-select" 
                        onChange={(event) => handleInputChange('hasCuts', event.target.value)}
                        required
                    >
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                    </select>
                    <label htmlFor="hasCuts">Possui cortes?</label>
                </div>

                <div className="form-floating mb-3 mt-3">
                        <input 
                        type="number" 
                        className={`form-control ${formState.quantityOfMeters <= 14 ? 'is-invalid' : ''}`}
                        id="" 
                        placeholder="" 
                        name="quantityOfMeters" 
                        min={15} 
                        onChange={(event) => {handleInputChange('quantityOfMeters', event.target.value)}}
                    />
                        <label htmlFor="quantityOfMeters">Digite a quantidade de metros</label>
                        <div className="invalid-feedback">A quantidade de metros deve ser no mínimo 15 metros</div>
                </div>
                
                {formState.hasCuts === true ?
                    <>
                        <div className="form-floating mb-3 mt-3">
                            <input 
                            type="number" 
                            className={`form-control ${formState.quantityOfCuts < 1 || formState.quantityOfCuts > 6 ? 'is-invalid' : ''}`}
                            id="" 
                            placeholder="" 
                            name="quantityOfCuts" 
                            min={2} 
                            max={6} 
                            onChange={(event) => {handleInputChange('quantityOfCuts', Number(event.target.value))}}
                        />
                            <label htmlFor="quantityOfCuts">Quantos cortes</label>
                        </div>
                        
                        
                        {[...Array(formState.quantityOfCuts)].map((_, index) => {
                            return (
                                <div className="form-floating mb-3 mt-3" key={index}>
                                    <input 
                                        type="number" 
                                        className={`form-control ${widthCoil !== 1200 ? 'is-invalid' : ''}`}
                                        id="" 
                                        placeholder="" 
                                        name="cutWidth" 
                                        min={100} 
                                        max={1200} 
                                        onChange={(event) => {handleInputChange(`cutWidth_${index}`, Number(event.target.value))}}
                                    />
                                    <label htmlFor="cutWidth">Largura do corte {index + 1}</label>
                                    <div className="invalid-feedback">A soma dos cortes deve resulta em 1200mm</div>
                                </div>
                            )
                        })}
                        
                    </>
                : 
                    <></>
                }

                <button 
                    type="button" 
                    className="btn btn-primary mb-4"
                    onClick={() => handleSubmit()}
                >Calcular</button>
            </form>
        </>
    );
}

export default InputFormBobininhas;
