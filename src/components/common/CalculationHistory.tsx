import { History, Trash2, Clock, ChevronRight, X } from 'lucide-react';
import { CalculationHistoryItem } from '../../hooks/useCalculationHistory';
import { Button } from './buttons/Button';

interface CalculationHistoryProps {
    history: CalculationHistoryItem[];
    onLoadCalculation: (item: CalculationHistoryItem) => void;
    onRemoveItem: (id: string) => void;
    onClearHistory: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export function CalculationHistory({
    history,
    onLoadCalculation,
    onRemoveItem,
    onClearHistory,
    isOpen,
    onClose,
}: CalculationHistoryProps) {
    if (!isOpen) return null;

    const handleClearHistory = () => {
        if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
            onClearHistory();
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 animate-slide-in-right overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="w-6 h-6 text-white" />
                        <h3 className="text-lg font-bold text-white">
                            Histórico de Cálculos
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Fechar histórico">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <History className="w-16 h-16 text-steel-300 mb-4" />
                            <p className="text-steel-600 font-medium mb-2">
                                Nenhum cálculo salvo
                            </p>
                            <p className="text-sm text-steel-500">
                                Os cálculos realizados aparecerão aqui
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border-2 border-steel-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all group">
                                {/* Data e hora */}
                                <div className="flex items-center gap-2 text-xs text-steel-500 mb-3">
                                    <Clock className="w-3 h-3" />
                                    <span>{item.date}</span>
                                </div>

                                {/* Resumo */}
                                <p className="text-sm text-steel-900 font-medium mb-4 line-clamp-2">
                                    {item.summary}
                                </p>

                                {/* Ações */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onLoadCalculation(item)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                                        <span>Carregar</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        aria-label="Remover cálculo">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-4 border-t border-steel-200 bg-steel-50">
                        <Button
                            onClick={handleClearHistory}
                            variant="danger"
                            size="md"
                            fullWidth
                            icon={<Trash2 className="w-4 h-4" />}>
                            Limpar Histórico
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
