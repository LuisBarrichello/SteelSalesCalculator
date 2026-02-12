import { FormEvent, useState } from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import FormCalculatorSapatas from './FormCalculatorSapatas';
import ResultsDisplay from './ResultsDisplay';

function CalcSapatas() {
    const [largura, setLargura] = useState(0);
    const [comprimento, setComprimento] = useState(0);
    const [altura, setAltura] = useState(0);
    const [quantidadeDeFerros, setQuantidadeDeFerros] = useState(0);
    const [quantidadeDeSapatas, setQuantidadeDeSapatas] = useState(0);
    const [bitola, setBitola] = useState('4.2');
    const [result, setResult] = useState(false);

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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gradient-to-br from-steel-50 to-primary-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
    );
}

export default CalcSapatas;
