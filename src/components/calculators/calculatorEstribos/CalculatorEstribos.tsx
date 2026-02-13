import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { useState } from 'react';
import FormCalculatorEstribos from './FormCalculatorEstribos';
import Result from './Result';
import { useCalculationHistory } from '../../../hooks/useCalculationHistory';
import { CalculationHistory } from '../../common/CalculationHistory';
import { History } from 'lucide-react';

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

    // Hook de histórico
    const { history, addToHistory, removeFromHistory, clearHistory } =
        useCalculationHistory('estribos');

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

    const handleResultSet = (newResult: ResultInterface) => {
        setResult(newResult);

        // Adicionar ao histórico
        const shapeLabels: { [key: string]: string } = {
            square: 'Quadrado',
            rectangular: 'Retangular',
            triangular: 'Triangular',
            circular: 'Circular',
        };

        const summary = `${newResult.quantityTotal} estribo(s) ${shapeLabels[newResult.shape]} - Ø${newResult.gauge}mm - ${newResult.weight} Kg`;

        addToHistory(formData, newResult, summary);
    };

    // Carregar cálculo do histórico
    const loadCalculation = (item: any) => {
        setFormData(item.data);
        setResult(item.result);
        setIsHistoryOpen(false);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gradient-to-br from-steel-50 to-primary-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex justify-end print:hidden">
                        <button
                            onClick={() => setIsHistoryOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-steel-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all shadow-sm">
                            <History className="w-5 h-5 text-steel-600" />
                            <span className="font-medium text-steel-700">
                                Histórico
                            </span>
                            {history.length > 0 && (
                                <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full font-bold">
                                    {history.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {result.status === true ? (
                        <Result result={result} resetForm={() => resetForm()} />
                    ) : (
                        <FormCalculatorEstribos
                            setResult={handleResultSet}
                            setFormData={setFormData}
                            formData={formData}
                        />
                    )}
                </div>
            </main>
            <Footer />

            <CalculationHistory
                history={history}
                onLoadCalculation={loadCalculation}
                onRemoveItem={removeFromHistory}
                onClearHistory={clearHistory}
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </div>
    );
}

export default CalculatorEstribos;
