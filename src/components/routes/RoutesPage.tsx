import { useState, useEffect } from 'react';
import {
    Truck,
    FileUp,
    LayoutList,
    ChevronRight,
    Save,
    Trash2,
    RefreshCw,
} from 'lucide-react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import ImportReport from './ImportReport';
import OrdersPanel from './OrdersPanel';
import { type ParseResult } from './utils/parseErpReport';
import { Button } from '../common/buttons/Button';

type Step = 'import' | 'panel';

export default function RoutesPage() {
    const [step, setStep] = useState<Step>('import');
    const [parseResult, setParseResult] = useState<ParseResult | null>(null);
    const [isRestored, setIsRestored] = useState(false);
    
    useEffect(() => {
        const savedResult = localStorage.getItem('routing_parseResult');
        const savedStep = localStorage.getItem('routing_step');

        if (savedResult) {
            try {
                const parsed = JSON.parse(savedResult);
                const restoredOrders = parsed.orders.map((o: any) => ({
                    ...o,
                    originalDelivery: o.originalDelivery
                        ? new Date(o.originalDelivery)
                        : null,
                    newDelivery: o.newDelivery ? new Date(o.newDelivery) : null,
                }));

                setParseResult({ ...parsed, orders: restoredOrders });
                if (savedStep === 'panel') setStep('panel');
                setIsRestored(true);
            } catch (e) {
                console.error('Falha ao restaurar sessão anterior', e);
            }
        }
    }, []);
    
    useEffect(() => {
        if (parseResult) {
            localStorage.setItem(
                'routing_parseResult',
                JSON.stringify(parseResult),
            );
            localStorage.setItem('routing_step', step);
        }
    }, [parseResult, step]);

    const clearSession = () => {
        if (
            confirm(
                'Tem certeza que deseja apagar o planejamento atual e começar do zero?',
            )
        ) {
            setParseResult(null);
            setStep('import');
            setIsRestored(false);
            localStorage.removeItem('routing_parseResult');
            localStorage.removeItem('routing_step');
            localStorage.removeItem('routing_plannedRoutes'); // Limpa as rotas salvas no outro hook
        }
    };

    const handleNewUpload = (result: ParseResult) => {
        localStorage.removeItem('routing_plannedRoutes');
        setParseResult(result);
    };

    const steps = [
        {
            id: 'import' as Step,
            label: 'Importar PDF',
            icon: <FileUp className="w-4 h-4" />,
        },
        {
            id: 'panel' as Step,
            label: 'Painel de Carga',
            icon: <LayoutList className="w-4 h-4" />,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="grow bg-linear-to-br from-steel-50 to-primary-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {parseResult && (
                        <div className="bg-sky-50 border border-sky-200 px-5 py-3 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 text-sky-800 text-sm font-medium">
                                {isRestored ? (
                                    <RefreshCw className="w-4 h-4" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                <span>
                                    {isRestored
                                        ? 'Sessão anterior restaurada com sucesso.'
                                        : 'Seu planejamento está sendo salvo automaticamente.'}
                                </span>
                            </div>
                            <button
                                onClick={clearSession}
                                className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1.5 transition-colors bg-white px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-200 shadow-sm">
                                <Trash2 className="w-3.5 h-3.5" /> Limpar e
                                Começar do Zero
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-linear-to-r from-sky-600 to-cyan-700 px-6 py-8 sm:px-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Rotas & Entregas
                                    </h1>
                                    <p className="text-sky-100 mt-1">
                                        Importe o PDF e visualize os pedidos
                                        para montar a carga do dia
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-b border-steel-100 flex items-center gap-2">
                            {steps.map((s, i) => (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-2">
                                    <Button
                                        variant="none"
                                        size="none"
                                        onClick={() => {
                                            if (s.id === 'panel' && parseResult)
                                                setStep('panel');
                                            if (s.id === 'import')
                                                setStep('import');
                                        }}
                                        disabled={
                                            s.id === 'panel' && !parseResult
                                        }
                                        icon={s.icon}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all
                                            ${step === s.id ? 'bg-sky-100 text-sky-700' : 'text-steel-500 hover:text-steel-700 disabled:opacity-40 disabled:cursor-not-allowed'}`}>
                                        {s.label}
                                    </Button>
                                    {i < steps.length - 1 && (
                                        <ChevronRight className="w-4 h-4 text-steel-300" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {step === 'import' && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
                            <ImportReport onParsed={handleNewUpload} />
                            {parseResult && parseResult.totalParsed > 0 && (
                                <div className="flex justify-end pt-2 border-t border-steel-100">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => setStep('panel')}
                                        icon={
                                            <LayoutList className="w-5 h-5" />
                                        }>
                                        Ver painel de carga
                                        <ChevronRight className="w-5 h-5 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'panel' && parseResult && (
                        <OrdersPanel
                            orders={parseResult.orders}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
