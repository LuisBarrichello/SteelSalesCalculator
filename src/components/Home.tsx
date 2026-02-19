import { Link } from 'react-router-dom';
import {
    Calculator,
    CirclePile,
    Grid3x3,
    Square,
    SquaresExclude,
    History,
} from 'lucide-react';
import Header from './common/Header';
import Footer from './common/Footer';

function Home() {
    const calculators = [
        {
            to: '/calculator-bobininhas',
            icon: CirclePile,
            title: 'Bobininhas',
            description: 'Cálculo de peso e cortes de bobinas de aço',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            to: '/calculator-sapatas',
            icon: Grid3x3,
            title: 'Sapatas',
            description: 'Dimensionamento de sapatas e estribos',
            color: 'from-violet-500 to-purple-500',
        },
        {
            to: '/calculator-estribos',
            icon: SquaresExclude,
            title: 'Estribos',
            description: 'Cálculo de peso de estribos por forma',
            color: 'from-amber-500 to-orange-500',
        },
        {
            to: '/calculator-colunas',
            icon: Square,
            title: 'Colunas',
            description: 'Dimensionamento completo de colunas',
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-linear-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg">
                                <Calculator className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-steel-900 mb-6">
                            Steel Sales Calculator
                        </h1>

                        <p className="text-lg sm:text-xl text-steel-600 max-w-2xl mx-auto mb-8">
                            Ferramentas profissionais para cálculos de materiais
                            de construção civil. Precisão e agilidade para suas
                            vendas.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-steel-200">
                                <p className="text-sm text-steel-600">Rápido</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    +4
                                </p>
                                <p className="text-xs text-steel-500">
                                    Calculadoras
                                </p>
                            </div>
                            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-steel-200">
                                <p className="text-sm text-steel-600">
                                    Preciso
                                </p>
                                <p className="text-2xl font-bold text-primary-600">
                                    100%
                                </p>
                                <p className="text-xs text-steel-500">
                                    Confiável
                                </p>
                            </div>
                            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-steel-200">
                                <p className="text-sm text-steel-600">Fácil</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    2min
                                </p>
                                <p className="text-xs text-steel-500">
                                    Por cálculo
                                </p>
                            </div>
                            <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-steel-200">
                                <p className="text-sm text-steel-600">
                                    Histórico
                                </p>
                                <p className="text-2xl font-bold text-primary-600">
                                    20
                                </p>
                                <p className="text-xs text-steel-500">
                                    Últimos salvos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Calculator Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {calculators.map((calc) => {
                            const Icon = calc.icon;
                            return (
                                <Link
                                    key={calc.to}
                                    to={calc.to}
                                    className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    {/* Gradient Header */}
                                    <div
                                        className={`h-2 bg-linear-to-r ${calc.color}`}
                                    />

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <div
                                                className={`inline-flex p-3 rounded-lg bg-linear-to-br ${calc.color} bg-opacity-10`}>
                                                <Icon className="w-6 h-6 text-steel-700" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-steel-900 mb-2 group-hover:text-primary-600 transition-colors">
                                            {calc.title}
                                        </h3>
                                        <p className="text-sm text-steel-600 leading-relaxed">
                                            {calc.description}
                                        </p>

                                        <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                                            <span>Acessar</span>
                                            <svg
                                                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Features Section */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                                <svg
                                    className="w-8 h-8 text-primary-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                Precisão Garantida
                            </h3>
                            <p className="text-steel-600">
                                Cálculos baseados em normas técnicas
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                                <svg
                                    className="w-8 h-8 text-primary-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                100% Responsivo
                            </h3>
                            <p className="text-steel-600">
                                Funciona perfeitamente em qualquer dispositivo
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                                <svg
                                    className="w-8 h-8 text-primary-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                Rápido e Intuitivo
                            </h3>
                            <p className="text-steel-600">
                                Interface simples para resultados imediatos
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
                                <History className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                Histórico Automático
                            </h3>
                            <p className="text-steel-600">
                                Os seus últimos 20 cálculos ficam salvos
                                localmente para consulta rápida.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
