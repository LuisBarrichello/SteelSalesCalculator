import { useEffect, useState } from "react"
import rebarData from "../../../data/rebarData.json"

function FormCalculatorEstribos() {
    const [formData, setFormData] = useState({
        shape: 'square',
        gauge: 4.2,
        side: [],
        quantityTotal: 1,
    })

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }
    useEffect(() => {
        console.log(formData)
    })

    const inputSide = (
        <div className="form-floating mb-3 mt-3">
            <input 
            type="number" 
            className={`form-control ${formData.side.length === 0 ? 'is-invalid' : ''}`}
            id="" 
            placeholder="" 
            name="" 
            min={1} 
            onChange={(event) => {handleInputChange('', event.target.value)}}
        />
            <label htmlFor="">Digite tamanho do lado</label>
            <div className="invalid-feedback">A quantidade deve ser maior que a bitola em centímetros (ex: 6.4mm = 6cm)</div>
        </div>
    )

    const renderInputSide = () => {
        if (formData.shape === 'triangular') {
            return (
                <>
                    {inputSide}
                    {inputSide}
                    {inputSide}
                </>
            );
        } else if(formData.shape === 'rectangular') {
            return (
                <>
                    {inputSide}
                    {inputSide}
                </>
            )
        } else {
            return (
                <>
                    {inputSide}
                </>
            )
        }
    };

    const handleSubmit = () => {
        
    }
    
    return (
        <section className="container">
            <h1 className="mb-4 mt-4 text-center">Cálculo Estribos</h1>
            <form action="">
                <div  className="form-floating mb-3 mt-3">
                    <select 
                        name="shape" 
                        id="" 
                        className="form-select" 
                        onChange={(event) => handleInputChange('shape', event.target.value)}
                        required
                    >
                        <option value="square">Quadrado</option>
                        <option value="rectangular">Retangular</option>
                        <option value="triangular">Triangular</option>
                    </select>
                    <label htmlFor="">Qual shape?</label>
                </div>
                <div  className="form-floating mb-3 mt-3">
                    <select 
                        name="gauge" 
                        id="" 
                        className="form-select" 
                        onChange={(event) => handleInputChange('gauge', event.target.value)}
                        required
                    >
                        <option value="4.2">4.2</option>
                        <option value="5">5</option>
                        <option value="6.3">6.3</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12.5">12.5</option>
                        <option value="16">16</option>
                        <option value="20">20</option>
                    </select>
                    <label htmlFor="gauge">Qual Bitola?</label>
                </div>
                <div className="form-floating mb-3 mt-3">
                    <input 
                    type="number" 
                    className={`form-control ${formData.quantityTotal === 0 ? 'is-invalid' : ''}`}
                    id="" 
                    placeholder="" 
                    name="quantityTotal" 
                    min={1} 
                    onChange={(event) => {handleInputChange('quantityTotal', event.target.value)}}
                />
                    <label htmlFor="">Digite a quantidade total de estribos</label>
                    <div className="invalid-feedback">A quantidade deve ser maior que 0</div>
                </div>
                {renderInputSide()}
                <button 
                    type="button" 
                    className="btn btn-primary mb-4"
                    onClick={() => handleSubmit()}
                >Calcular</button>
            </form>
        </section>
    )
}

export default FormCalculatorEstribos