import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useEffect, useState } from "react";
import DataCoil from "../../../data/weightMetroLinearCoil.json"
import ComponentCalculationResult from "./ComponentCalculationResult";
import InputFormBobininhas from "./InputFormBobininhas";
import { handleCalculation } from "./HandleCalculation";

function CalcBobininhas() {
    
    const [formState, setFormState] = useState({
        thickness: 0.43,
        qualityOfMaterial: 'bgl',
        hasCuts: false,
        quantityOfCuts: 0,
        quantityOfMeters: 0,
        quantityOfCoil: 1,
        cuts: {},
        weight: [0]
    });

    const [result, setResult] = useState<Result>({
        thickness: 0, 
        qualityOfMaterial: '',
        hasCuts: false,
        cuts: {},
        weight: [0], 
        quantityOfCuts: 0,
        quantityOfMeters: 0, 
        quantityOfCoil: 0,
        status: false
    })

    const [dataCoil, setDataCoil] = useState<{ [key: string]: {thickness: string; weight: number;}[]}>({})

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

    const handleInputChange = (field: string, value: string | number | boolean) => {
        if (field === 'hasCuts') {
            setFormState((prevState) => ({
                ...prevState,
                hasCuts: value === 'true'
            }));
        } else if(field.startsWith('cutWidth_')) {
            const cutIndex = parseInt(field.split('_')[1], 10);
            const newCutsWidths = { ...formState.cuts, [cutIndex]: Number(value) };
            setFormState((prevState) => ({
                ...prevState,
                cuts: newCutsWidths,
            }))
        } else {
            setFormState((prevState) => ({ ...prevState, [field]: value }));
        }
    };
    
    const handleSubmit = () => {
        if (!formState || !dataCoil) {
            console.error('Form state or data coil is null or undefined');
            return;
        }

        const weightResult = handleCalculation(formState, dataCoil);
        if (weightResult !== undefined) {
            setResult({
                thickness: formState.thickness,
                qualityOfMaterial: formState.qualityOfMaterial,
                weight: weightResult as number[],
                quantityOfMeters: formState.quantityOfMeters,
                quantityOfCoil: formState.quantityOfCoil,
                quantityOfCuts: formState.quantityOfCuts, 
                hasCuts: formState.hasCuts,
                cuts: formState.cuts,
                status: true,
            });
        }
    };

    useEffect(() => {
        // Simula uma requisição assíncrona para carregar os dados
        setDataCoil(DataCoil);
        resetForm()
    }, []);

    useEffect(() => {
        if(dataCoil && dataCoil[formState.qualityOfMaterial]) {
            const selectedMaterial  = dataCoil[formState.qualityOfMaterial][0]
            setFormState((prevState) => ({...prevState, thickness: Number(selectedMaterial.thickness)}));
        }
    }, [formState.qualityOfMaterial])
    
    const resetForm = () => {
        setFormState({
            thickness: 0.43,
            qualityOfMaterial: 'bgl',
            hasCuts: false,
            quantityOfCuts: 0,
            quantityOfMeters: 15,
            quantityOfCoil: 1,
            cuts: {},
            weight: [0],
        });
    
        setResult((prevState) => ({
            ...prevState,
            thickness: 0.43,
            qualityOfMaterial: 'bgl',
            hasCuts: false,
            quantityOfCuts: 0,
            quantityOfMeters: 0,
            quantityOfCoil: 1,
            cuts: {},
            weight: [0],
            status: false,
        }));
    }

    return (
        <>
            <Header></Header>
            <div className="container mb-3 mt-3">
                {result.status === true ? 
                    <ComponentCalculationResult result={result} resetForm={resetForm}/>
                    :    
                    <InputFormBobininhas formState={formState} dataCoil={dataCoil} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
                }
            </div>
            <Footer></Footer>
        </>
    )
}

export default CalcBobininhas