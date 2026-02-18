import { useState } from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import FormCalculatorSapatas from './FormCalculatorSapatas';
import ResultsDisplay from './ResultsDisplay';
import {
    useCalculationHistory,
    CalculationHistoryItem,
} from '../../../hooks/useCalculationHistory';
import { CalculationHistory } from '../../common/CalculationHistory';
import { History } from 'lucide-react';

export interface SapatasFormData {
    width: number;
    length: number;
    height: number;
    ironBarsPerSapata: number;
    quantityOfSapatas: number;
    gauge: number;
}

export interface SapatasResult {
    weightStirrups: number;
    weightStirrupsLess2: number;
    totalWeight: number;
    status: boolean;
}

const REBAR_WEIGHTS: { [key: number]: number } = {
    4.2: 0.115,
    5: 0.157,
    6.3: 0.25,
    8: 0.398,
    10: 0.628,
    12.5: 0.985,
    16: 1.61,
    20: 2.55,
};

const OVERLAPS: { [key: number]: number } = {
    4.2: 5.5,
    5: 5.5,
    6.3: 6,
    8: 8,
    10: 10,
    12.5: 12,
    16: 16,
    20: 20,
};

function CalculatorSapatas() {
    const initialFormData: SapatasFormData = {
        width: 0,
        length: 0,
        height: 0,
        ironBarsPerSapata: 0,
        quantityOfSapatas: 0,
        gauge: 4.2,
    };

    const [formData, setFormData] = useState<SapatasFormData>(initialFormData);

    const [results, setResults] = useState<SapatasResult>({
        weightStirrups: 0,
        weightStirrupsLess2: 0,
        totalWeight: 0,
        status: false,
    });

    const { history, addToHistory, removeFromHistory, clearHistory } =
        useCalculationHistory('sapatas');

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const handleInputChange = (field: keyof SapatasFormData, value: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const calculateStirrupWeight = (
        side1: number,
        side2: number,
        gauge: number,
        barsPerStirrup: number,
        qtySapatas: number,
    ): number => {
        const stirrupsPerSapata = barsPerStirrup / 2;
        const totalLength = side1 * 2 + side2 * 2 + OVERLAPS[gauge] * 2;

        const weight =
            (totalLength *
                REBAR_WEIGHTS[gauge] *
                stirrupsPerSapata *
                qtySapatas) /
            100;

        return parseFloat(weight.toFixed(2));
    };

    const handleSubmit = () => {
        const {
            width,
            length,
            height,
            gauge,
            ironBarsPerSapata,
            quantityOfSapatas,
        } = formData;

        if (
            width <= 0 ||
            length <= 0 ||
            height <= 0 ||
            ironBarsPerSapata <= 0 ||
            quantityOfSapatas <= 0
        ) {
            return;
        }

        const weightStirrups = calculateStirrupWeight(
            width,
            height,
            gauge,
            ironBarsPerSapata,
            quantityOfSapatas,
        );

        const weightStirrupsLess2 = calculateStirrupWeight(
            length,
            height - 2,
            gauge,
            ironBarsPerSapata,
            quantityOfSapatas,
        );

        const totalWeight = weightStirrups + weightStirrupsLess2;

        const newResult: SapatasResult = {
            weightStirrups,
            weightStirrupsLess2,
            totalWeight,
            status: true,
        };

        setResults(newResult);

        const summary = `${quantityOfSapatas} sapata(s) - ${width}x${length}x${height}cm - ${ironBarsPerSapata} ferros - Ø${gauge}mm - ${totalWeight.toFixed(2)} Kg`;

        addToHistory(formData, newResult, summary);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setResults({
            weightStirrups: 0,
            weightStirrupsLess2: 0,
            totalWeight: 0,
            status: false,
        }); 
    };

    const loadCalculation = (item: CalculationHistoryItem) => {
        const data = item.data as any;

        setFormData({
            width: data.width,
            length: data.length,
            height: data.height,
            ironBarsPerSapata:
                data.ironBarsPerSapata,
            quantityOfSapatas:
                data.quantityOfSapatas,
            gauge: Number(data.gauge),
        });

        const res = item.result as SapatasResult;
        setResults({
            weightStirrups: res.weightStirrups,
            weightStirrupsLess2: res.weightStirrupsLess2,
            totalWeight: res.totalWeight,
            status: true,
        });

        setIsHistoryOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="grow bg-linear-to-br from-steel-50 to-primary-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

                    {results.status ? (
                        <ResultsDisplay
                            formData={formData}
                            results={results}
                            resetForm={resetForm}
                        />
                    ) : (
                        <FormCalculatorSapatas
                            formData={formData}
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

export default CalculatorSapatas;
