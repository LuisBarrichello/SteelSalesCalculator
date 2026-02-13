import { useState } from 'react';
import Footer from '../../common/Footer';
import Header from '../../common/Header';
import FormCalculatorColunas from './FormCalculatorColunas';
import {
    calculatesNumberOfStirrupsPerColumns,
    calculatesTotalNumberOfBars,
    calculatesTotalNumberOfStirrups,
    calculatesTotalWeightOfBars,
    calculatesTotalWeightOfStirrups,
} from './HandleCalculation';
import ResultsDisplay from './ResultsDisplay';
import { useCalculationHistory } from '../../../hooks/useCalculationHistory';
import { CalculationHistory } from '../../common/CalculationHistory';
import { History } from 'lucide-react';

export interface DataResultColunasInterface {
    numberOfColumns?: number;
    numberOfIronBars?: number;
    stirrupSpacing?: number;
    gaugeIronBars?: number;
    metersOfColumns?: number;
    metersHaveStirrup?: number;
    stirrupMeasurements?: {
        shape?: string;
        gauge?: number;
        lengthSides?: {
            length1?: number;
            length2?: number;
            radius?: number;
        };
    };
    totalNumberOfBars?: number;
    totalWeightOfBars?: number;
    totalNumberOfStirrups?: number;
    totalWeightOfStirrups?: number;
    numberOfStirrupsPerColumns: number;
}

function CalculatorColunas() {
    const [result, setResult] = useState<DataResultColunasInterface>({
        numberOfColumns: 0,
        numberOfIronBars: 0,
        stirrupSpacing: 0,
        gaugeIronBars: 0,
        metersOfColumns: 0,
        metersHaveStirrup: 0,
        stirrupMeasurements: {
            shape: '',
            gauge: 0,
            lengthSides: {
                length1: 0,
                length2: 0,
                radius: 0,
            },
        },
        totalNumberOfBars: 0,
        totalWeightOfBars: 0,
        totalNumberOfStirrups: 0,
        totalWeightOfStirrups: 0,
        numberOfStirrupsPerColumns: 0,
    });
    const [showResult, setShowResult] = useState(false);
    const [formData, setFormData] = useState<DataResultColunasInterface>({
        numberOfColumns: 0,
        numberOfIronBars: 0,
        stirrupSpacing: 0,
        gaugeIronBars: 0,
        metersOfColumns: 0,
        metersHaveStirrup: 0,
        stirrupMeasurements: {
            shape: '',
            gauge: 0,
            lengthSides: {
                length1: 0,
                length2: 0,
                radius: 0,
            },
        },
        numberOfStirrupsPerColumns: 0,
    });

    const { history, addToHistory, removeFromHistory, clearHistory } =
        useCalculationHistory('colunas');

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const handleFormSubmit = (data: DataResultColunasInterface) => {
        const totalNumberOfBars = calculatesTotalNumberOfBars(data);
        const totalWeightOfBars = calculatesTotalWeightOfBars(data);
        const totalNumberOfStirrups = calculatesTotalNumberOfStirrups(data);
        const totalWeightOfStirrups = calculatesTotalWeightOfStirrups(data);
        const numberOfStirrupsPerColumns =
            calculatesNumberOfStirrupsPerColumns(data);

        const newResult = {
            ...data,
            totalNumberOfBars,
            totalWeightOfBars,
            totalNumberOfStirrups,
            totalWeightOfStirrups,
            numberOfStirrupsPerColumns,
        };

        setResult(newResult);
        setFormData(data);
        setShowResult(true);

        const totalWeight = totalWeightOfBars + totalWeightOfStirrups;
        const summary = `${data.numberOfColumns} coluna(s) - ${data.metersOfColumns}m - ${data.numberOfIronBars} barras - Ø${data.gaugeIronBars}mm - ${totalWeight.toFixed(2)} Kg`;

        addToHistory(data, newResult, summary);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const resetForm = () => {
        setShowResult(false);
    };

    const loadCalculation = (item: any) => {
        setFormData(item.data);
        setResult(item.result);
        setShowResult(true);
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

                    {showResult !== true ? (
                        <FormCalculatorColunas onSubmit={handleFormSubmit} />
                    ) : (
                        <ResultsDisplay result={result} resetForm={resetForm} />
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

export default CalculatorColunas;
