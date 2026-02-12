import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { useState } from 'react';
import FormCalculatorEstribos from './FormCalculatorEstribos';
import Result from './Result';

interface LengthSides {
    [key: number]: number;
}

export interface ResultInterface {
    status: boolean;
    weight: number;
    shape: string;
    quantitySide: number;
    gauge: number;
    lengthSides: LengthSides;
    quantityTotal: number;
}

export interface FormData {
    shape: string;
    quantitySide: number;
    gauge: number;
    lengthSides: LengthSides;
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
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gradient-to-br from-steel-50 to-primary-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {result.status === true ? (
                        <Result result={result} resetForm={() => resetForm()} />
                    ) : (
                        <FormCalculatorEstribos
                            setResult={setResult}
                            setFormData={setFormData}
                            formData={formData}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CalculatorEstribos;
