import rebarData from "../../../data/rebarData.json"
import { handleCalculation } from "./HandleCalculation";
import { FormData, ResultInterface } from "./CalculatorEstribos";

interface FormProps {
    setResult: (result: ResultInterface) => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    formData: FormData;
}



function FormCalculatorEstribos({setResult, setFormData, formData}: FormProps) {
    
    const handleInputChange = (field: string, value: string | boolean | number) => {
        if(field === 'shape') { 
            if(typeof value === 'string') {
                setFormData((prevState: FormData) => ({
                    ...prevState,
                    [field]: value,
                    quantitySide: value === 'rectangular' ? 2 : 1
                }))
            }
        } else if(field.startsWith('lengthSides_')) {
            const indexSide = field.split('_')[1]
            const sides = { ...formData.lengthSides, [indexSide]: Number(value)}
            setFormData((prevState: FormData) => ({
                ...prevState,
                lengthSides: sides
            }))
        } else {
            setFormData((prevState: FormData) => ({
                ...prevState,
                [field]: value
            }))
        }
    } 
    
    const handleSubmit = () => {
        const weight = Number(handleCalculation(rebarData, formData))
        setResult({
            status: true,
            weight: weight,
            ...formData
        });
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
                        <option value="circular">Circular</option>
                    </select>
                    <label htmlFor="">Qual shape?</label>
                </div>
                <div  className="form-floating mb-3 mt-3">
                    <select 
                        name="gauge" 
                        id="" 
                        className="form-select" 
                        onChange={(event) => handleInputChange('gauge', Number(event.target.value))}
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
                    onChange={(event) => {handleInputChange('quantityTotal', Number(event.target.value))}}
                />
                    <label htmlFor="">Digite a quantidade total de estribos</label>
                    <div className="invalid-feedback">A quantidade deve ser maior que 0</div>
                </div>
                {[...Array(formData.quantitySide)].map((_, index) => {
                    return (
                        <div className="form-floating mb-3 mt-3" key={index}>
                            <input 
                            type="number" 
                            className={`form-control ${Object.keys(formData.lengthSides).length === 0 ? 'is-invalid' : ''}`}
                            id="" 
                            name="lengthSides" 
                            min={1} 
                            onChange={(event) => {handleInputChange(`lengthSides_${index}`, event.target.value)}}
                        />
                            <label htmlFor="">Digite tamanho {formData.shape === 'circular' ? <span className="text-danger">do raio</span> : 'do lado'} em cm</label>
                            <div className="invalid-feedback">A quantidade deve ser maior que a bitola em centímetros (ex: 6.4mm = 6cm)</div>
                        </div>
                    )
                })}
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