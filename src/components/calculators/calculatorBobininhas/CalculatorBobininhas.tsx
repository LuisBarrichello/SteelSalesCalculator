import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { useEffect, useState } from 'react';
import DataCoil from '../../../data/weightMetroLinearCoil.json';
import ComponentCalculationResult from './ComponentCalculationResult';
import InputFormBobininhas from './InputFormBobininhas';
import { handleCalculation } from './HandleCalculation';
import { useCalculationHistory } from '../../../hooks/useCalculationHistory';
import { CalculationHistory } from '../../common/CalculationHistory';
import { History } from 'lucide-react';

function CalcBobininhas() {
    const [formState, setFormState] = useState({
        thickness: 0.43,
        qualityOfMaterial: 'bgl',
        hasCuts: false,
        quantityOfCuts: 0,
        quantityOfMeters: 0,
        quantityOfCoil: 1,
        cuts: {},
        weight: [0],
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
        status: false,
    });

    const [dataCoil, setDataCoil] = useState<{
        [key: string]: { thickness: string; weight: number }[];
    }>({});

    const {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getHistoryItem,
    } = useCalculationHistory('bobininhas');

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

    const handleInputChange = (
        field: string,
        value: string | number | boolean,
    ) => {
        if (field === 'hasCuts') {
            setFormState((prevState) => ({
                ...prevState,
                hasCuts: value === 'true',
            }));
        } else if (field.startsWith('cutWidth_')) {
            const cutIndex = parseInt(field.split('_')[1], 10);
            const newCutsWidths = {
                ...formState.cuts,
                [cutIndex]: Number(value),
            };
            setFormState((prevState) => ({
                ...prevState,
                cuts: newCutsWidths,
            }));
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
            const newResult = {
                thickness: formState.thickness,
                qualityOfMaterial: formState.qualityOfMaterial,
                weight: weightResult as number[],
                quantityOfMeters: formState.quantityOfMeters,
                quantityOfCoil: formState.quantityOfCoil,
                quantityOfCuts: formState.quantityOfCuts,
                hasCuts: formState.hasCuts,
                cuts: formState.cuts,
                status: true,
            };

            setResult(newResult);

            const totalWeight = (weightResult as number[]).reduce(
                (acc, w) => acc + w,
                0,
            );
            const summary = `${formState.quantityOfCoil} bobina(s) - ${formState.qualityOfMaterial.toUpperCase()} ${formState.thickness}mm - ${formState.quantityOfMeters}m - ${totalWeight.toFixed(2)} Kg`;

            addToHistory(formState, newResult, summary);
        }
    };

    useEffect(() => {
        setDataCoil(DataCoil);
        resetForm();
    }, []);

    useEffect(() => {
        if (dataCoil && dataCoil[formState.qualityOfMaterial]) {
            const selectedMaterial = dataCoil[formState.qualityOfMaterial][0];
            setFormState((prevState) => ({
                ...prevState,
                thickness: Number(selectedMaterial.thickness),
            }));
        }
    }, [formState.qualityOfMaterial]);

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
    };

    const loadCalculation = (item: any) => {
        setFormState(item.data);
        setResult(item.result);
        setIsHistoryOpen(false);
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
                        <ComponentCalculationResult
                            result={result}
                            resetForm={resetForm}
                        />
                    ) : (
                        <InputFormBobininhas
                            formState={formState}
                            dataCoil={dataCoil}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
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

export default CalcBobininhas;
