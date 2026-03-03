import { useState } from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { History } from 'lucide-react';
import {
    BendingFormData,
    BendingResult,
    PROFILE_LABELS,
    handleCalculation,
} from './HandleCalculation';
import FormCalculatorDobrasEspeciais from './FormCalculatorDobrasEspeciais';
import ResultDobrasEspeciais from './ResultDobrasEspeciais';
import {
    useCalculationHistory,
    CalculationHistoryItem,
} from '../../../hooks/useCalculationHistory';
import { CalculationHistory } from '../../common/CalculationHistory';

const INITIAL_FORM: BendingFormData = {
    profileType: 'udc',
    thickness: 3.0,
    length: 6,
    quantity: 1,
    B: 0,
    A: 0,
    a: 0,
    L1: 0,
    L2: 0,
};

const INITIAL_RESULT: BendingResult = {
    status: false,
    profileType: 'udc',
    thickness: 0,
    length: 0,
    quantity: 0,
    unitWeight: 0,
    totalWeight: 0,
    developedWidth: 0,
    discount: 0,
    weightPerM2: 0,
};

function CalculatorDobrasEspeciais() {
    const [formData, setFormData] = useState<BendingFormData>(INITIAL_FORM);
    const [result, setResult] = useState<BendingResult>(INITIAL_RESULT);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const { history, addToHistory, removeFromHistory, clearHistory } =
        useCalculationHistory('dobras');

    const handleSubmit = () => {
        const res = handleCalculation(formData);
        setResult(res);

        const dimStr =
            res.profileType === 'l'
                ? `L1=${res.L1} L2=${res.L2}`
                : res.a !== undefined
                  ? `B=${res.B} A=${res.A} a=${res.a}`
                  : `B=${res.B} A=${res.A}`;

        const summary = `${res.quantity}× ${PROFILE_LABELS[res.profileType]} | ${dimStr} mm | esp ${res.thickness} mm | ${res.length} m — ${res.totalWeight.toFixed(2)} kg`;
        addToHistory(formData, res, summary);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setResult(INITIAL_RESULT);
    };

    const loadCalculation = (item: CalculationHistoryItem) => {
        setFormData(item.data as BendingFormData);
        setResult(item.result as BendingResult);
        setIsHistoryOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="grow bg-linear-to-br from-steel-50 to-primary-50 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Botão histórico */}
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

                    {result.status ? (
                        <ResultDobrasEspeciais
                            result={result}
                            resetForm={resetForm}
                        />
                    ) : (
                        <FormCalculatorDobrasEspeciais
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
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

export default CalculatorDobrasEspeciais;
