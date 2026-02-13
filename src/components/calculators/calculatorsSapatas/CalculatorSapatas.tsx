import { FormEvent, useState } from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import FormCalculatorSapatas from './FormCalculatorSapatas';
import ResultsDisplay from './ResultsDisplay';
import { useCalculationHistory } from '../../../hooks/useCalculationHistory';
import { CalculationHistory } from '../../common/CalculationHistory';
import { History } from 'lucide-react';

function CalcSapatas() {
    const [largura, setLargura] = useState(0);
    const [comprimento, setComprimento] = useState(0);
    const [altura, setAltura] = useState(0);
    const [quantidadeDeFerros, setQuantidadeDeFerros] = useState(0);
    const [quantidadeDeSapatas, setQuantidadeDeSapatas] = useState(0);
    const [bitola, setBitola] = useState('4.2');
    const [result, setResult] = useState(false);

    // Hook de histórico
    const { history, addToHistory, removeFromHistory, clearHistory } =
        useCalculationHistory('sapatas');

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const pesos: { [key: string]: number } = {
        '4.2': 0.115,
        '5': 0.157,
        '6.3': 0.25,
        '8': 0.398,
        '10': 0.628,
        '12.5': 0.985,
        '16': 1.61,
        '20': 2.55,
    };

    const transpasses: { [key: string]: number } = {
        '4.2': 5.5,
        '5': 5.5,
        '6.3': 6,
        '8': 8,
        '10': 10,
        '12.5': 12,
        '16': 16,
        '20': 20,
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setResult(!result);

        if (!result) {
            // Salvando no histórico
            const weightEstribos = calculatorWeightEstribos(
                largura,
                altura,
                bitola,
                quantidadeDeFerros,
            );
            const weightEstribosLess2 = calculatorWeightEstribos(
                comprimento,
                altura - 2,
                bitola,
                quantidadeDeFerros,
            );
            const totalWeight = weightEstribos + weightEstribosLess2;

            const formData = {
                largura,
                comprimento,
                altura,
                quantidadeDeFerros,
                quantidadeDeSapatas,
                bitola,
            };

            const resultData = {
                weightEstribos,
                weightEstribosLess2,
                totalWeight,
            };

            const summary = `${quantidadeDeSapatas} sapata(s) - ${largura}x${comprimento}x${altura}cm - ${quantidadeDeFerros} ferros - Ø${bitola}mm - ${totalWeight.toFixed(2)} Kg`;

            addToHistory(formData, resultData, summary);
        }
    };

    const calculatorWeightEstribos = (
        lado1: number,
        lado2: number,
        bitolaEstribo: string,
        quantidadeFerrosParaEstribo: number,
    ): number => {
        const quantidadeEstribosPorSapata = quantidadeFerrosParaEstribo / 2;
        const totalLength: number =
            lado1 * 2 + lado2 * 2 + transpasses[bitolaEstribo] * 2;
        const weigth: number =
            (totalLength *
                pesos[bitolaEstribo] *
                quantidadeEstribosPorSapata *
                quantidadeDeSapatas) /
            100;

        return parseFloat(weigth.toFixed(2));
    };

    const weightEstribos = calculatorWeightEstribos(
        largura,
        altura,
        bitola,
        quantidadeDeFerros,
    );
    const weightEstribosLess2 = calculatorWeightEstribos(
        comprimento,
        altura - 2,
        bitola,
        quantidadeDeFerros,
    );

    const returnForm = (event: FormEvent) => {
        event.preventDefault();
        setResult(!result);
    };

    // Carregar cálculo do histórico
    const loadCalculation = (item: any) => {
        const data = item.data;
        setLargura(data.largura);
        setComprimento(data.comprimento);
        setAltura(data.altura);
        setQuantidadeDeFerros(data.quantidadeDeFerros);
        setQuantidadeDeSapatas(data.quantidadeDeSapatas);
        setBitola(data.bitola);
        setResult(true);
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

                    {result === true ? (
                        <ResultsDisplay
                            bitola={bitola}
                            quantidadeDeFerros={quantidadeDeFerros}
                            quantidadeDeSapatas={quantidadeDeSapatas}
                            largura={largura}
                            altura={altura}
                            comprimento={comprimento}
                            weightEstribos={weightEstribos}
                            weightEstribosLess2={weightEstribosLess2}
                            returnForm={returnForm}
                        />
                    ) : (
                        <FormCalculatorSapatas
                            largura={largura}
                            setLargura={setLargura}
                            comprimento={comprimento}
                            setComprimento={setComprimento}
                            altura={altura}
                            setAltura={setAltura}
                            quantidadeDeFerros={quantidadeDeFerros}
                            setQuantidadeDeFerros={setQuantidadeDeFerros}
                            quantidadeDeSapatas={quantidadeDeSapatas}
                            setQuantidadeDeSapatas={setQuantidadeDeSapatas}
                            bitola={bitola}
                            setBitola={setBitola}
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

export default CalcSapatas;
