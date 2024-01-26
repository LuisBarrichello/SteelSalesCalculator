import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useState } from "react";
import FormCalculatorEstribos from "./FormCalculatorEstribos";
import Result from "./Result"

export interface ResultInterface {
    status: boolean;
    weight: number;
    shape: string;
    quantitySide: number;
    gauge: number;
    lengthSides: object;
    quantityTotal: number;
}

export interface FormData {
    shape: string;
    quantitySide: number;
    gauge: number;
    lengthSides: object;
    quantityTotal: number;
}

function CalculatorEstribos() {
    const [formData, setFormData] = useState<FormData>({
        shape: 'square',
        quantitySide: 1,
        gauge: 4.2,
        lengthSides: { '0': 0 },
        quantityTotal: 1,
    });
    
    const [result, setResult] = useState<ResultInterface>({
        status: false,
        weight: 0,
        shape: '',  
        quantitySide: 0,
        gauge: 0,
        lengthSides: {},
        quantityTotal: 0,
    });

    const resetForm = () => {
        setFormData({
            shape: 'square',
            quantitySide: 1,
            gauge: 4.2,
            lengthSides: {},
            quantityTotal: 1,
        });
    
        setResult({
            status: false,
            weight: 0,
            shape: '',
            quantitySide: 0,
            gauge: 0,
            lengthSides: {},
            quantityTotal: 0,
        });
    };
    
    
    return (
        <>
            <Header></Header>
            {result.status === true ? 
                <Result result={result} resetForm={() => resetForm()}></Result>
            :
                <FormCalculatorEstribos 
                    setResult={setResult} 
                    setFormData={setFormData}
                    formData={formData}
                />
            }
            <Footer></Footer>
        </>
    )
}

export default CalculatorEstribos